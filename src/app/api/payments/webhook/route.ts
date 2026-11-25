/**
 * POST /api/payments/webhook  (called by Razorpay's servers, not by browsers)
 *
 * Why: if a customer pays and closes the tab straight away, /api/payments/verify
 * is never called. Razorpay still sends this signed notification, so the order
 * is marked PAID anyway.
 *
 * Security (Rule F2): the request is trusted only if its signature matches the
 * HMAC of the raw body with RAZORPAY_WEBHOOK_SECRET. Without that secret set,
 * the endpoint refuses everything.
 *
 * Setup: Razorpay dashboard (Test mode) -> Settings -> Webhooks -> add
 *   https://YOUR-SITE/api/payments/webhook
 * with the event "payment.captured" and the same secret as in the env variable.
 *
 * Replies: 2xx means "handled, don't send again"; Razorpay retries other codes.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PaymentError, markPaidFromWebhook } from "@/lib/payments";
import { describeError, isValidWebhookSignature } from "@/lib/razorpay";

const eventSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().min(1).max(100),
        order_id: z.string().min(1).max(100),
        amount: z.number().int(),
        currency: z.string().max(10),
        status: z.string().max(30),
      }),
    }),
  }),
});

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "WEBHOOK_NOT_CONFIGURED" }, { status: 503 });
  }

  // The signature covers the exact bytes, so read the body as text first.
  const rawBody = await request.text();
  if (rawBody.length > 100_000) {
    return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  }
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!isValidWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "BAD_SIGNATURE" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  // Only captured payments matter. Other events are acknowledged and ignored.
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success || parsed.data.event !== "payment.captured") {
    return NextResponse.json({ ok: true, ignored: true });
  }
  const payment = parsed.data.payload.payment.entity;
  if (payment.status !== "captured") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const result = await markPaidFromWebhook({
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      amountPaise: payment.amount,
      currency: payment.currency,
    });
    if (!result) return NextResponse.json({ ok: true, ignored: true }); // not our order
    if (result.restocked) revalidateTag("catalogue", { expire: 0 });
    return NextResponse.json({ ok: true, orderNumber: result.orderNumber });
  } catch (error) {
    if (error instanceof PaymentError) {
      // Final answers (sold out and flagged for refund, mismatch, paid by another
      // payment): retrying would not change them, so acknowledge and log.
      console.warn("[api/payments/webhook]", error.code);
      return NextResponse.json({ ok: true, note: error.code });
    }
    // Temporary problem (for example the database): ask Razorpay to retry.
    console.error("[api/payments/webhook]", describeError(error));
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
