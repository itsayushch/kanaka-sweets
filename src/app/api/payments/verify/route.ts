/**
 * POST /api/payments/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * The ONLY place an order becomes PAID (Rule F2). The signature is checked on
 * the server with our secret key. Fake or missing values leave the order
 * unpaid. Rate limiting is added in Phase 5 (Rule F8).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { PaymentError, verifyAndMarkPaid } from "@/lib/payments";

const bodySchema = z.object({
  razorpay_order_id: z.string().trim().min(1).max(100),
  razorpay_payment_id: z.string().trim().min(1).max(100),
  razorpay_signature: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION" }, { status: 422 });
  }

  try {
    const result = await verifyAndMarkPaid({
      razorpayOrderId: parsed.data.razorpay_order_id,
      razorpayPaymentId: parsed.data.razorpay_payment_id,
      signature: parsed.data.razorpay_signature,
    });

    // If stock was taken again for a late payment, refresh the product pages.
    if (result.restocked) revalidateTag("catalogue", { expire: 0 });

    return NextResponse.json({ ok: true, orderNumber: result.orderNumber });
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    console.error("[api/payments/verify]", (error as Error).message);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "We couldn't confirm your payment. Please contact the shop." },
      { status: 500 },
    );
  }
}
