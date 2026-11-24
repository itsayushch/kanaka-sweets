/**
 * POST /api/payments/create   body: { orderNumber }
 *
 * Creates (or reuses) the Razorpay payment order for one of our PENDING
 * orders. The amount is read from OUR database, never from the request
 * (Rule F1). Rate limiting is added in Phase 5 (Rule F8).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentError, createPaymentForOrder } from "@/lib/payments";

const bodySchema = z.object({ orderNumber: z.string().trim().min(1).max(40) });

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
    const payment = await createPaymentForOrder(parsed.data.orderNumber);
    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status },
      );
    }
    // Never leak internal details (or keys) to the browser.
    console.error("[api/payments/create]", (error as Error).message);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "We couldn't start the payment. Please try again." },
      { status: 500 },
    );
  }
}
