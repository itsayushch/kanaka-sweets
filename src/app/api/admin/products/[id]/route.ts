/**
 * PUT    /api/admin/products/[id]  -> edit a product, its prices, sizes and stock.
 * DELETE /api/admin/products/[id]  -> remove it (or hide it if it has orders).
 * Admin only (Rule F3): the session is checked first, inside each handler.
 */
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { handleAdminError, invalidJson, readJson, validationError } from "@/lib/admin-api";
import { productSchema } from "@/lib/admin-validation";
import { removeProduct, updateProduct } from "@/lib/admin-products";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJson(request);
  if (body === null) return invalidJson();

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    await updateProduct(id, parsed.data);
    revalidateTag("catalogue", { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error, "api/admin/products PUT");
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    const result = await removeProduct(id);
    revalidateTag("catalogue", { expire: 0 });
    return NextResponse.json({ ok: true, archived: result.archived });
  } catch (error) {
    return handleAdminError(error, "api/admin/products DELETE");
  }
}
