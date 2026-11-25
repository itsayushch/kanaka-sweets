/**
 * Proves Rule F2: fake payment-verify calls leave an order UNPAID.
 *
 * What it does:
 *  - inserts its own PENDING test orders directly in the database
 *  - calls POST /api/payments/verify on a running server with fake / wrong /
 *    swapped / missing values and checks the order is still PENDING
 *  - as a positive control, sends one correctly signed call and checks that
 *    one DOES become PAID (so we know the test can tell the difference)
 *  - deletes its test orders and restores any stock it changed
 *
 * Run (the dev or production server must be running with the SAME
 * RAZORPAY_KEY_SECRET as this script):
 *   pnpm test:payments
 * Optional: BASE_URL=http://localhost:3000 (default)
 *
 * The secret is read from the environment and is never printed.
 */
import { createHmac, randomBytes } from "node:crypto";
import { prisma } from "../src/lib/prisma";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SECRET = process.env.RAZORPAY_KEY_SECRET;
// A random IP for this run, so the rate limit (Rule F8) is not tripped by earlier runs.
const TEST_IP = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

const sign = (orderId: string, paymentId: string, secret: string) =>
  createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

async function verify(body: unknown): Promise<number> {
  const res = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": TEST_IP },
    body: JSON.stringify(body),
  });
  return res.status;
}

/** Insert a PENDING (or other status) order that uses an existing variant. */
async function makeOrder(status: "PENDING" | "CANCELLED", variantId: string, productId: string, quantity = 1) {
  const tag = randomBytes(4).toString("hex").toUpperCase();
  const razorpayOrderId = `order_TEST${tag}`;
  const order = await prisma.order.create({
    data: {
      orderNumber: `KS-TEST-${tag}`,
      customerName: "Test Script",
      customerEmail: "test@example.com",
      customerPhone: "9876543210",
      fulfillmentType: "PICKUP",
      pickupDate: new Date(Date.now() + 86400000),
      pickupTimeSlot: "11:00 AM - 1:00 PM",
      totalAmount: 100,
      status,
      razorpayOrderId,
      items: { create: [{ productId, variantId, quantity, price: 100 }] },
    },
  });
  return { id: order.id, razorpayOrderId };
}

async function statusOf(id: string) {
  const o = await prisma.order.findUnique({ where: { id } });
  return o ? { status: o.status, paymentId: o.razorpayPaymentId } : null;
}

async function main() {
  // Pick one in-stock variant and one sold-out variant from the seed data.
  const inStock = await prisma.productVariant.findFirst({ where: { stock: { gte: 5 } } });
  const soldOut = await prisma.productVariant.findFirst({ where: { stock: 0 } });
  if (!inStock || !soldOut) throw new Error("Run the seed first: pnpm exec prisma db seed");
  const stockBefore = inStock.stock;

  const created: string[] = [];
  try {
    const A = await makeOrder("PENDING", inStock.id, inStock.productId);
    created.push(A.id);
    const unpaid = async () => (await statusOf(A.id))?.status === "PENDING";

    console.log("== Fake verify calls must leave the order unpaid ==");

    check("garbage signature -> refused",
      (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_FAKE", razorpay_signature: "fake" })) === 400);
    check("order still PENDING", await unpaid());

    check("missing fields -> refused",
      (await verify({ razorpay_order_id: A.razorpayOrderId })) === 422);
    check("empty body -> refused", (await verify({})) === 422);
    check("order still PENDING", await unpaid());

    check("signature made with the WRONG secret -> refused",
      (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_FAKE",
        razorpay_signature: sign(A.razorpayOrderId, "pay_FAKE", "not-the-real-secret") })) === 400);
    check("order still PENDING", await unpaid());

    check("client 'status: PAID' / 'amount' fields are ignored",
      (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_FAKE",
        razorpay_signature: "fake", status: "PAID", amount: 0 })) === 400);
    check("order still PENDING", await unpaid());

    if (!SECRET) {
      console.log("\nSKIP  positive-control tests: RAZORPAY_KEY_SECRET is not set for this script.");
    } else {
      console.log("\n== Positive control: a correctly signed call DOES work ==");

      check("valid signature but UNKNOWN order id -> 404, nothing created",
        (await verify({ razorpay_order_id: "order_DOESNOTEXIST", razorpay_payment_id: "pay_X",
          razorpay_signature: sign("order_DOESNOTEXIST", "pay_X", SECRET) })) === 404);

      check("signature of another payment id (swapped) -> refused",
        (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_B",
          razorpay_signature: sign(A.razorpayOrderId, "pay_A", SECRET) })) === 400);
      check("order still PENDING", await unpaid());

      check("valid signature -> accepted",
        (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_A",
          razorpay_signature: sign(A.razorpayOrderId, "pay_A", SECRET) })) === 200);
      let s = await statusOf(A.id);
      check("order is now PAID with the payment id saved", s?.status === "PAID" && s.paymentId === "pay_A");

      check("same valid call repeated -> harmless (200)",
        (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_A",
          razorpay_signature: sign(A.razorpayOrderId, "pay_A", SECRET) })) === 200);
      check("a DIFFERENT valid payment on a paid order -> refused (409)",
        (await verify({ razorpay_order_id: A.razorpayOrderId, razorpay_payment_id: "pay_C",
          razorpay_signature: sign(A.razorpayOrderId, "pay_C", SECRET) })) === 409);
      s = await statusOf(A.id);
      check("payment id unchanged", s?.paymentId === "pay_A");

      console.log("\n== Late payment on an expired (CANCELLED) order re-checks stock ==");
      const B = await makeOrder("CANCELLED", inStock.id, inStock.productId, 2);
      created.push(B.id);
      check("stock available -> re-reserved and order PAID",
        (await verify({ razorpay_order_id: B.razorpayOrderId, razorpay_payment_id: "pay_B1",
          razorpay_signature: sign(B.razorpayOrderId, "pay_B1", SECRET) })) === 200
        && (await statusOf(B.id))?.status === "PAID");
      const afterB = await prisma.productVariant.findUnique({ where: { id: inStock.id } });
      check("stock was taken again (2 units)", afterB?.stock === stockBefore - 2, `before ${stockBefore}, after ${afterB?.stock}`);

      const C = await makeOrder("CANCELLED", soldOut.id, soldOut.productId, 1);
      created.push(C.id);
      check("stock gone -> refused (409), order NOT marked PAID",
        (await verify({ razorpay_order_id: C.razorpayOrderId, razorpay_payment_id: "pay_C1",
          razorpay_signature: sign(C.razorpayOrderId, "pay_C1", SECRET) })) === 409
        && (await statusOf(C.id))?.status === "CANCELLED");
      const noteRow = await prisma.order.findUnique({ where: { id: C.id } });
      check("order flagged for refund and stock still 0",
        !!noteRow?.notes?.startsWith("REFUND NEEDED") && (await prisma.productVariant.findUnique({ where: { id: soldOut.id } }))?.stock === 0);
    }
    console.log(String.fromCharCode(10) + "== Webhook and simultaneous confirmations ==");
    const HOOK = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!SECRET || !HOOK) {
      console.log("SKIP  webhook tests: set RAZORPAY_WEBHOOK_SECRET for the server and this script.");
    } else {
      const webhook = async (orderId: string, paymentId: string, amount: number, secret: string) => {
        const raw = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: paymentId, order_id: orderId, amount, currency: "INR", status: "captured" } } } });
        const res = await fetch(`${BASE_URL}/api/payments/webhook`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-razorpay-signature": createHmac("sha256", secret).update(raw).digest("hex") },
          body: raw,
        });
        return res.status;
      };
      const stock = async () => (await prisma.productVariant.findUnique({ where: { id: inStock.id } }))!.stock;

      const D = await makeOrder("PENDING", inStock.id, inStock.productId);
      created.push(D.id);
      check("webhook with the wrong secret -> refused", (await webhook(D.razorpayOrderId, "pay_D", 10000, "wrong")) === 400 && (await statusOf(D.id))?.status === "PENDING");
      check("webhook with the wrong amount -> not paid", (await webhook(D.razorpayOrderId, "pay_D", 100, HOOK)) === 200 && (await statusOf(D.id))?.status === "PENDING");
      check("genuine webhook -> order PAID", (await webhook(D.razorpayOrderId, "pay_D", 10000, HOOK)) === 200 && (await statusOf(D.id))?.status === "PAID");
      check("webhook for an unknown order -> acknowledged, nothing created", (await webhook("order_NOPE", "pay_X", 10000, HOOK)) === 200);

      for (let round = 1; round <= 3; round++) {
        const E = await makeOrder("CANCELLED", inStock.id, inStock.productId, 1);
        created.push(E.id);
        const before = await stock();
        const pay = `pay_E${round}`;
        const body = { razorpay_order_id: E.razorpayOrderId, razorpay_payment_id: pay, razorpay_signature: sign(E.razorpayOrderId, pay, SECRET) };
        const statuses = await Promise.all([verify(body), webhook(E.razorpayOrderId, pay, 10000, HOOK), verify(body), webhook(E.razorpayOrderId, pay, 10000, HOOK)]);
        const after = await stock();
        check(`round ${round}: 4 simultaneous confirmations take the stock exactly once`, statuses.every((x) => x === 200) && after === before - 1 && (await statusOf(E.id))?.status === "PAID", `statuses ${statuses.join(",")}, stock ${before} -> ${after}`);
      }
    }
  } finally {
    // Clean up: remove test orders and put stock back exactly as it was.
    await prisma.order.deleteMany({ where: { id: { in: created } } });
    await prisma.productVariant.update({ where: { id: inStock.id }, data: { stock: stockBefore } });
    await prisma.$disconnect();
  }

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Test script crashed:", (error as Error).message);
  process.exit(1);
});
