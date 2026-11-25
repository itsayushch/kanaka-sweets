/**
 * POST /api/cart
 * Takes the cart (IDs + quantities only) and returns the items with their
 * real names, images and prices from the database, so the cart page can show
 * them. The browser cart never stores a price (Rule F1).
 * These prices are for DISPLAY. /api/checkout calculates the real total again.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { priceCart, releaseExpiredReservations } from "@/lib/orders";
import { revalidateTag } from "next/cache";
import { cartItemsSchema } from "@/lib/validation";

const bodySchema = z.object({ items: cartItemsSchema });

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
    // Give back stock from abandoned orders, so sold-out items become available again.
    if ((await releaseExpiredReservations()) > 0) {
      revalidateTag("catalogue", { expire: 0 });
    }

    const { lines, missing } = await priceCart(prisma, parsed.data.items);
    const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    return NextResponse.json({ lines, missing, totalAmount });
  } catch (error) {
    console.error("[api/cart]", (error as Error).message);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
