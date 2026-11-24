/**
 * Payment logic: create a Razorpay order, then verify the payment (Rules F1, F2).
 *
 * The life of a payment:
 *  1. Checkout saved the order as PENDING with a total worked out on the server.
 *  2. `createPaymentForOrder` asks Razorpay for a payment order for EXACTLY that
 *     database total (Rule F1) and saves the Razorpay order id on our order.
 *  3. The customer pays in the Razorpay window. Razorpay gives the browser an
 *     order id, a payment id and a signature.
 *  4. `verifyAndMarkPaid` checks the signature on the server. Only a valid
 *     signature, for an order that exists in OUR database, can make an order
 *     PAID (Rule F2). Anything else changes nothing.
 */
import { prisma } from "@/lib/prisma";
import { isReservationExpired } from "@/lib/orders";
import {
  getRazorpayClient,
  getRazorpayKeyId,
  isValidPaymentSignature,
} from "@/lib/razorpay";

/** An expected problem we can explain to the customer (not a crash). */
export class PaymentError extends Error {
  code:
    | "ORDER_NOT_FOUND"
    | "ORDER_NOT_PAYABLE"
    | "BAD_SIGNATURE"
    | "ALREADY_PAID"
    | "STOCK_UNAVAILABLE";
  status: number;

  constructor(code: PaymentError["code"], message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: create the Razorpay order
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get (or create) the Razorpay payment order for one of our PENDING orders.
 * Returns what the browser needs to open the Razorpay window.
 */
export async function createPaymentForOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    throw new PaymentError("ORDER_NOT_FOUND", "We couldn't find that order.", 404);
  }

  // Only an unpaid order whose stock is still held can be paid.
  if (order.status !== "PENDING" || isReservationExpired(order.createdAt)) {
    throw new PaymentError(
      "ORDER_NOT_PAYABLE",
      order.status === "PAID"
        ? "This order is already paid."
        : "This order has expired. Please place a new order.",
      409,
    );
  }

  // Amount comes from OUR database, in paise (1 rupee = 100 paise). Never from
  // the browser (Rule F1).
  const amountPaise = order.totalAmount * 100;

  // The customer may retry a failed payment: reuse the same Razorpay order.
  let razorpayOrderId = order.razorpayOrderId;
  if (!razorpayOrderId) {
    const created = await getRazorpayClient().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: order.orderNumber,
    });
    razorpayOrderId = created.id;

    // Save it only if nobody else saved one first (two tabs clicking Pay).
    const saved = await prisma.order.updateMany({
      where: { id: order.id, razorpayOrderId: null },
      data: { razorpayOrderId },
    });
    if (saved.count === 0) {
      const latest = await prisma.order.findUnique({ where: { id: order.id } });
      razorpayOrderId = latest?.razorpayOrderId ?? razorpayOrderId;
    }
  }

  return {
    orderNumber: order.orderNumber,
    razorpayOrderId,
    amountPaise,
    keyId: getRazorpayKeyId(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: verify the payment and mark the order PAID
// ─────────────────────────────────────────────────────────────────────────────

/** Thrown inside the transaction to roll back a failed stock re-reservation. */
class StockGone extends Error {}

export interface VerifyInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}

export async function verifyAndMarkPaid(input: VerifyInput) {
  const { razorpayOrderId, razorpayPaymentId, signature } = input;

  // 1. Is the signature genuine? Fake or tampered values stop here and nothing
  //    in the database changes (Rule F2).
  if (!isValidPaymentSignature(razorpayOrderId, razorpayPaymentId, signature)) {
    throw new PaymentError("BAD_SIGNATURE", "Payment could not be verified.", 400);
  }

  // 2. Does this Razorpay order belong to an order in OUR database?
  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: true },
  });
  if (!order) {
    throw new PaymentError("ORDER_NOT_FOUND", "We couldn't find that order.", 404);
  }

  // 3. Already paid? Repeating the same call is harmless; a different payment
  //    id for an already-paid order is refused.
  if (order.status === "PAID") {
    if (order.razorpayPaymentId === razorpayPaymentId) {
      return { orderNumber: order.orderNumber, restocked: false };
    }
    throw new PaymentError("ALREADY_PAID", "This order is already paid.", 409);
  }

  // 4. Normal case: the order is PENDING and its stock is still held. The
  //    "where status = PENDING" makes the change happen only once.
  if (order.status === "PENDING") {
    const marked = await prisma.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "PAID", razorpayPaymentId, razorpaySignature: signature },
    });
    if (marked.count === 1) {
      return { orderNumber: order.orderNumber, restocked: false };
    }
    // Lost a race (e.g. it expired a moment ago): fall through to re-check stock.
  }

  // 5. The order was cancelled or expired (its stock was given back) but the
  //    customer paid anyway. Re-check stock now: if every item
  //    is still available we take the stock again and mark the order PAID.
  try {
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const reserved = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count === 0) throw new StockGone(); // rolls everything back
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: "PAID", razorpayPaymentId, razorpaySignature: signature },
      });
    });
    return { orderNumber: order.orderNumber, restocked: true };
  } catch (error) {
    if (!(error instanceof StockGone)) throw error;

    // Money was taken but the items are gone. We can't mark it PAID. Record the
    // payment id on the order so the shop can refund it from Razorpay.
    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayPaymentId,
        notes: "REFUND NEEDED: payment received after the reservation expired and stock ran out.",
      },
    });
    throw new PaymentError(
      "STOCK_UNAVAILABLE",
      "Your payment was received, but an item sold out before it was confirmed. The shop will contact you and refund it.",
      409,
    );
  }
}
