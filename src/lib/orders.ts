/**
 * Server-side pricing and order creation (Rules F1, F6, F7).
 *
 * How checkout works, step by step:
 *  1. The browser sends only IDs and quantities (never a price).
 *  2. `priceCart` loads each variant from the database and works out the
 *     real unit price and line total. THIS is where the order total comes from.
 *  3. `createPendingOrder` runs inside ONE database transaction:
 *       a. reserve stock: subtract the quantity from each variant, but only
 *          if enough stock is left (a single atomic UPDATE, so two buyers can
 *          never both get the last item);
 *       b. save the order as PENDING with the server-calculated total.
 *     If anything fails, the whole transaction rolls back and no stock is lost.
 *  4. If the order is never paid (payment fails or 30 minutes pass), the
 *     reserved stock is given back by `closeOrderAndRestoreStock`.
 */
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { MAX_QUANTITY } from "@/lib/shop-constants";
import type { CartItemInput, CheckoutInput } from "@/lib/validation";

/** A database client or a transaction client: both can run queries. */
type Db = Prisma.TransactionClient;

/** Unpaid orders keep their reserved stock for this long. */
export const RESERVATION_MINUTES = 30;

/** An error we expect and can explain to the customer (not a crash). */
export class CheckoutError extends Error {
  code: "ITEM_NOT_FOUND" | "OUT_OF_STOCK" | "INVALID_QUANTITY";
  status: number;
  variantId?: string;

  constructor(
    code: CheckoutError["code"],
    message: string,
    status: number,
    variantId?: string,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.variantId = variantId;
  }
}

/** One cart line with its real, database-sourced price. */
export interface PricedLine {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  categorySlug: string;
  variantName: string;
  weight: string;
  image: string;
  unitPrice: number; // INR, from the database
  quantity: number;
  lineTotal: number; // unitPrice x quantity
  stock: number; // stock right now (display only; checkout re-checks)
}

/** Merge duplicate variants (same variant added twice) into one line. */
function mergeItems(items: CartItemInput[]): CartItemInput[] {
  const merged = new Map<string, CartItemInput>();
  for (const item of items) {
    const existing = merged.get(item.variantId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(item.variantId, { ...item });
    }
  }
  return [...merged.values()];
}

/**
 * Look up every cart item in the database and price it.
 * Items that no longer exist (or whose product is inactive) are returned in
 * `missing` instead of throwing, so the cart page can show what is left.
 */
export async function priceCart(
  db: Db,
  items: CartItemInput[],
): Promise<{ lines: PricedLine[]; missing: string[] }> {
  const wanted = mergeItems(items);
  const variants = await db.productVariant.findMany({
    where: { id: { in: wanted.map((i) => i.variantId) } },
    include: { product: { include: { category: true } } },
  });
  const byId = new Map(variants.map((v) => [v.id, v]));

  const lines: PricedLine[] = [];
  const missing: string[] = [];

  for (const item of wanted) {
    const v = byId.get(item.variantId);
    // The variant must exist, belong to the product the cart says, and the
    // product must still be on sale.
    if (!v || v.productId !== item.productId || !v.product.isActive) {
      missing.push(item.variantId);
      continue;
    }
    lines.push({
      productId: v.productId,
      variantId: v.id,
      productName: v.product.name,
      productSlug: v.product.slug,
      categorySlug: v.product.category.slug,
      variantName: v.name,
      weight: v.weight ?? "",
      image: v.product.image,
      unitPrice: v.price,
      quantity: item.quantity,
      lineTotal: v.price * item.quantity,
      stock: v.stock,
    });
  }
  return { lines, missing };
}

/** Human-friendly order number, e.g. KS-261125-A1B2C3. */
function newOrderNumber(): string {
  const day = new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) // 2026-11-25
    .replaceAll("-", "")
    .slice(2); // 261125
  return `KS-${day}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

/**
 * Give stock back for an order that will not be paid, and close it.
 *
 * Only an order that is still PENDING can be closed. The status change and the
 * stock restore happen together, so stock is restored exactly once even if
 * this runs twice at the same time.
 * Returns true if this call closed the order.
 */
export async function closeOrderAndRestoreStock(
  db: Db,
  orderId: string,
  newStatus: "FAILED" | "CANCELLED",
): Promise<boolean> {
  const moved = await db.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status: newStatus },
  });
  if (moved.count === 0) return false; // already paid, closed or restored

  const items = await db.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await db.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });
  }
  return true;
}

/** Cancel unpaid orders older than the reservation window and free their stock. */
export async function expireOldReservations(db: Db): Promise<number> {
  const cutoff = new Date(Date.now() - RESERVATION_MINUTES * 60 * 1000);
  const stale = await db.order.findMany({
    where: { status: "PENDING", createdAt: { lt: cutoff } },
    select: { id: true },
  });
  let closed = 0;
  for (const order of stale) {
    if (await closeOrderAndRestoreStock(db, order.id, "CANCELLED")) closed++;
  }
  return closed;
}

/**
 * Create a PENDING order and reserve its stock, all in one transaction.
 * `input` has already passed checkoutSchema validation.
 */
export async function createPendingOrder(input: CheckoutInput) {
  return prisma.$transaction(
    async (tx) => {
      // Free up stock held by abandoned orders first.
      await expireOldReservations(tx);

      // 1. Price the cart from the database (Rule F1).
      const { lines, missing } = await priceCart(tx, input.items);
      if (missing.length > 0) {
        throw new CheckoutError(
          "ITEM_NOT_FOUND",
          "An item in your cart is no longer available. Please review your cart.",
          409,
          missing[0],
        );
      }

      // 2. Reserve stock (Rule F7). The UPDATE only matches if enough stock
      //    is left, so a sold-out or short variant changes nothing (count 0).
      for (const line of lines) {
        if (line.quantity > MAX_QUANTITY) {
          throw new CheckoutError(
            "INVALID_QUANTITY",
            `You can order at most ${MAX_QUANTITY} of one item.`,
            422,
            line.variantId,
          );
        }
        const reserved = await tx.productVariant.updateMany({
          where: { id: line.variantId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (reserved.count === 0) {
          throw new CheckoutError(
            "OUT_OF_STOCK",
            `Sorry, ${line.productName} (${line.variantName}) is out of stock or has less than ${line.quantity} left.`,
            409,
            line.variantId,
          );
        }
      }

      // 3. The total is the sum of database prices. Nothing from the browser.
      const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);

      const isDelivery = input.fulfillmentType === "DELIVERY";
      const order = await tx.order.create({
        data: {
          orderNumber: newOrderNumber(),
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          fulfillmentType: input.fulfillmentType,
          deliveryAddress: isDelivery ? input.deliveryAddress : null,
          deliveryPostalCode: isDelivery ? input.deliveryPostalCode : null,
          // Pickup date is stored as midnight India time on that day.
          pickupDate:
            !isDelivery && input.pickupDate
              ? new Date(`${input.pickupDate}T00:00:00+05:30`)
              : null,
          pickupTimeSlot: isDelivery ? null : (input.pickupTimeSlot ?? null),
          notes: input.notes || null,
          totalAmount,
          status: "PENDING",
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              variantId: l.variantId,
              quantity: l.quantity,
              price: l.unitPrice, // price at the time of order
            })),
          },
        },
        select: { id: true, orderNumber: true, totalAmount: true },
      });

      return order;
    },
    { timeout: 15000 },
  );
}
