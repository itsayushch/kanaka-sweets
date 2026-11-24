/**
 * Catalogue data access: reads categories, products and site settings
 * from the database (Supabase Postgres via Prisma).
 *
 * - There is NO fallback to src/data/seed-data.ts. If the database is down
 *   or empty, the error surfaces so we notice it. Seed data is only used by
 *   prisma/seed.ts to fill the database.
 * - Every read uses "use cache" with a tag. Pages are served from the cache,
 *   and the Phase 4 admin actions call revalidateTag("catalogue") or
 *   revalidateTag("site-settings") after saving, so edits show up quickly.
 *   cacheLife("hours") is the safety net if a tag is ever missed.
 */
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  SeedCategory,
  SeedProduct,
  SeedSiteSettings,
} from "@/data/seed-data"; // types only: no seed data is imported at runtime

export interface CategoryWithProducts extends SeedCategory {
  productsCount: number;
}

export interface FormattedProduct extends SeedProduct {
  categoryName: string;
}

/** Prisma include used by every product query (variants cheapest first). */
const productInclude = {
  category: true,
  variants: { orderBy: { price: "asc" } },
} as const;

/** Shape of a product row loaded with `productInclude`. */
type ProductRow = Awaited<
  ReturnType<typeof prisma.product.findMany<{ include: typeof productInclude }>>
>[number];

/** Convert a database product row into the shape the UI components use. */
function toFormattedProduct(p: ProductRow): FormattedProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
    description: p.description,
    image: p.image,
    images: p.images.length > 0 ? p.images : [p.image],
    isFeatured: p.isFeatured,
    isBestForGifting: p.isBestForGifting,
    isActive: p.isActive,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      weight: v.weight ?? "",
      price: v.price,
      stock: v.stock,
      sku: v.sku ?? "",
    })),
  };
}

/** Get all categories, ordered by displayOrder. */
export async function getAllCategories(): Promise<SeedCategory[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image ?? "",
    displayOrder: c.displayOrder,
  }));
}

/** Get one category by slug, or null if it doesn't exist. */
export async function getCategoryBySlug(
  slug: string,
): Promise<SeedCategory | null> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const c = await prisma.category.findUnique({ where: { slug } });
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image ?? "",
    displayOrder: c.displayOrder,
  };
}

/** Get all active products in a category (empty array if none). */
export async function getProductsByCategory(
  categorySlug: string,
): Promise<FormattedProduct[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const products = await prisma.product.findMany({
    where: { isActive: true, category: { slug: categorySlug } },
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toFormattedProduct);
}

/** Get a single active product by category slug and product slug. */
export async function getProductBySlug(
  categorySlug: string,
  productSlug: string,
): Promise<FormattedProduct | null> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const product = await prisma.product.findFirst({
    where: {
      slug: productSlug,
      isActive: true,
      category: { slug: categorySlug },
    },
    include: productInclude,
  });
  return product ? toFormattedProduct(product) : null;
}

/** Get featured products for the home page (max 8). */
export async function getFeaturedProducts(): Promise<FormattedProduct[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: productInclude,
    orderBy: { createdAt: "asc" },
    take: 8,
  });
  return products.map(toFormattedProduct);
}

/** Get all active products (used for the sitemap and static paths). */
export async function getAllProducts(): Promise<FormattedProduct[]> {
  "use cache";
  cacheTag("catalogue");
  cacheLife("hours");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toFormattedProduct);
}

/**
 * Get the festival highlight settings (single row, id "global").
 * Throws if the row is missing: run `pnpm exec prisma db seed`.
 */
export async function getSiteSettings(): Promise<SeedSiteSettings> {
  "use cache";
  cacheTag("site-settings");
  cacheLife("hours");

  const s = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  if (!s) {
    throw new Error(
      'SiteSettings row "global" not found. Run: pnpm exec prisma db seed',
    );
  }
  return {
    festivalHighlightActive: s.festivalHighlightActive,
    festivalHighlightTitle: s.festivalHighlightTitle,
    festivalHighlightSubtitle: s.festivalHighlightSubtitle,
    festivalHighlightText: s.festivalHighlightText,
    festivalHighlightImage: s.festivalHighlightImage,
    festivalHighlightDiscount: s.festivalHighlightDiscount ?? "",
  };
}
