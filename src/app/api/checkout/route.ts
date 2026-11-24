/**
 * POST /api/checkout  (Phase 2: creates the order; Razorpay is added in Phase 3)
 *
 * Rule F1: the request holds IDs and quantities only. Any price/amount/total
 *          the browser sends is ignored (the schema has no such field).
 * Rule F6: every field is validated here with Zod.
 * Rule F7: stock is checked and reserved inside a database transaction.
 * Rule F8: rate limiting is added in Phase 5.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { CheckoutError, createPendingOrder } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  // 1. Read the JSON body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  // 2. Validate (Rule F6). Errors are returned per field so the form can show
  //    each message next to its input.
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);
    return NextResponse.json(
      { error: "VALIDATION", fieldErrors, formErrors },
      { status: 422 },
    );
  }

  // 3. Create the order: server-side prices + stock reservation.
  try {
    const order = await createPendingOrder(parsed.data);

    // Stock changed, so refresh the cached product pages straight away.
    revalidateTag("catalogue", { expire: 0 });

    return NextResponse.json(
      { orderNumber: order.orderNumber, totalAmount: order.totalAmount },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json(
        { error: error.code, message: error.message, variantId: error.variantId },
        { status: error.status },
      );
    }
    // Never send internal details to the browser, and never log customer data.
    console.error("[api/checkout]", (error as Error).message);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
