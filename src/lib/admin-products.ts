/**
 * Product create / update / delete for the admin (Phase 4).
 * Callers (the /api/admin routes) have ALREADY checked the admin session and
 * validated the input with productSchema.
 */
import { prisma } from "@/lib/prisma";
import { slugify, type ProductInput } from "@/lib/admin-validation";

/** An expected problem the admin can fix (not a crash). */
export class AdminError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/** Turn database "already exists" / "bad reference" errors into friendly ones. */
function friendly(error: unknown): never {
  const code = (error as { code?: string }).code;
  if (code === "P2002") {
    throw new AdminError(
      "SLUG_TAKEN",
      "Another product already uses that web address. Change the name or address.",
      409,
    );
  }
  if (code === "P2003") {
    throw new AdminError("BAD_CATEGORY", "That category does not exist.", 422);
  }
  throw error;
}

export async function createProduct(input: ProductInput) {
  const slug = input.slug || slugify(input.name);
  if (!slug) {
    throw new AdminError("BAD_SLUG", "Could not make a web address from that name.", 422);
  }

  try {
    return await prisma.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        categoryId: input.categoryId,
        image: input.image,
        images: [input.image],
        isFeatured: input.isFeatured,
        isBestForGifting: input.isBestForGifting,
        isActive: input.isActive,
        variants: {
          create: input.variants.map((v) => ({
            name: v.name,
            weight: v.weight || null,
            price: v.price,
            stock: v.stock,
          })),
        },
      },
      select: { id: true, slug: true, category: { select: { slug: true } } },
    });
  } catch (error) {
    friendly(error);
  }
}

export async function updateProduct(id: string, input: ProductInput) {
  const slug = input.slug || slugify(input.name);
  if (!slug) {
    throw new AdminError("BAD_SLUG", "Could not make a web address from that name.", 422);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({
        where: { id },
        include: { variants: { select: { id: true } } },
      });
      if (!existing) throw new AdminError("NOT_FOUND", "Product not found.", 404);

      const existingIds = new Set(existing.variants.map((v) => v.id));
      const keptIds = new Set<string>();
      for (const v of input.variants) {
        if (v.id) {
          // A size id must belong to THIS product.
          if (!existingIds.has(v.id)) {
            throw new AdminError("BAD_VARIANT", "A size does not belong to this product.", 422);
          }
          keptIds.add(v.id);
        }
      }

      // Sizes the admin removed: delete them, unless customers already ordered them.
      for (const old of existing.variants) {
        if (keptIds.has(old.id)) continue;
        const used = await tx.orderItem.count({ where: { variantId: old.id } });
        if (used > 0) {
          throw new AdminError(
            "VARIANT_HAS_ORDERS",
            "A size that already has orders can't be deleted. Set its stock to 0 instead.",
            409,
          );
        }
        await tx.productVariant.delete({ where: { id: old.id } });
      }

      await tx.product.update({
        where: { id },
        data: {
          name: input.name,
          slug,
          description: input.description,
          categoryId: input.categoryId,
          image: input.image,
          images: [input.image],
          isFeatured: input.isFeatured,
          isBestForGifting: input.isBestForGifting,
          isActive: input.isActive,
        },
      });

      for (const v of input.variants) {
        const data = {
          name: v.name,
          weight: v.weight || null,
          price: v.price,
          stock: v.stock,
        };
        if (v.id) await tx.productVariant.update({ where: { id: v.id }, data });
        else await tx.productVariant.create({ data: { ...data, productId: id } });
      }

      return { id };
    });
  } catch (error) {
    if (error instanceof AdminError) throw error;
    friendly(error);
  }
}

/**
 * Remove a product. If customers have ordered it we can't delete it (order
 * history must stay intact), so we hide it from the shop instead.
 */
export async function removeProduct(id: string): Promise<{ archived: boolean }> {
  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) throw new AdminError("NOT_FOUND", "Product not found.", 404);

  const orders = await prisma.orderItem.count({ where: { productId: id } });
  if (orders > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return { archived: true };
  }
  await prisma.product.delete({ where: { id } });
  return { archived: false };
}
