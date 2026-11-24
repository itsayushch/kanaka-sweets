/**
 * POST /api/admin/products  -> create a product with its sizes.
 * Admin only (Rule F3): the session is checked first, inside this handler.
 */
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { handleAdminError, invalidJson, readJson, validationError } from "@/lib/admin-api";
import { productSchema } from "@/lib/admin-validation";
import { createProduct } from "@/lib/admin-products";

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  if (body === null) return invalidJson();

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const product = await createProduct(parsed.data);
    revalidateTag("catalogue", { expire: 0 }); // shop pages update straight away
    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    return handleAdminError(error, "api/admin/products POST");
  }
}
