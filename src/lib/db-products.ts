import { prisma } from "@/lib/prisma";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_SITE_SETTINGS,
  type SeedCategory,
  type SeedProduct,
  type SeedSiteSettings,
} from "@/data/seed-data";

export interface CategoryWithProducts extends SeedCategory {
  productsCount: number;
}

export interface FormattedProduct extends SeedProduct {
  categoryName: string;
}

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  // If it's the unconfigured localhost placeholder from prisma init, don't query
  if (url.includes("localhost:51213")) return false;
  return true;
}

/**
 * Get all categories, ordered by displayOrder.
 * Falls back gracefully to seed data if DB is temporarily unreachable.
 */
export async function getAllCategories(): Promise<SeedCategory[]> {
  if (isDbConfigured()) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
      });
      if (categories && categories.length > 0) {
        return categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image || "",
          displayOrder: c.displayOrder,
        }));
      }
    } catch (error) {
      console.warn("[DB] Failed to fetch categories from database, using cached seed data:", (error as Error).message);
    }
  }
  return SEED_CATEGORIES;
}

/**
 * Get a specific category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<SeedCategory | null> {
  if (isDbConfigured()) {
    try {
      const cat = await prisma.category.findUnique({
        where: { slug },
      });
      if (cat) {
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image || "",
          displayOrder: cat.displayOrder,
        };
      }
    } catch (error) {
      console.warn(`[DB] Failed to fetch category "${slug}" from database:`, (error as Error).message);
    }
  }
  return SEED_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/**
 * Get all products belonging to a category slug.
 */
export async function getProductsByCategory(categorySlug: string): Promise<FormattedProduct[]> {
  if (isDbConfigured()) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: {
          products: {
            where: { isActive: true },
            include: {
              variants: {
                orderBy: { price: "asc" },
              },
            },
          },
        },
      });

      if (category && category.products.length > 0) {
        return category.products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          categorySlug: category.slug,
          categoryName: category.name,
          description: p.description,
          image: p.image,
          images: p.images.length > 0 ? p.images : [p.image],
          isFeatured: p.isFeatured,
          isBestForGifting: p.isBestForGifting,
          isActive: p.isActive,
          variants: p.variants.map((v) => ({
            id: v.id,
            name: v.name,
            weight: v.weight || "",
            price: v.price,
            stock: v.stock,
            sku: v.sku || "",
          })),
        }));
      }
    } catch (error) {
      console.warn(`[DB] Failed to fetch products for category "${categorySlug}":`, (error as Error).message);
    }
  }

  const category = SEED_CATEGORIES.find((c) => c.slug === categorySlug);
  return SEED_PRODUCTS.filter((p) => p.categorySlug === categorySlug && p.isActive).map((p) => ({
    ...p,
    categoryName: category?.name ?? categorySlug,
  }));
}

/**
 * Get a single product by category slug and product slug.
 */
export async function getProductBySlug(categorySlug: string, productSlug: string): Promise<FormattedProduct | null> {
  if (isDbConfigured()) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          slug: productSlug,
          category: { slug: categorySlug },
          isActive: true,
        },
        include: {
          category: true,
          variants: {
            orderBy: { price: "asc" },
          },
        },
      });

      if (product) {
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categorySlug: product.category.slug,
          categoryName: product.category.name,
          description: product.description,
          image: product.image,
          images: product.images.length > 0 ? product.images : [product.image],
          isFeatured: product.isFeatured,
          isBestForGifting: product.isBestForGifting,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            weight: v.weight || "",
            price: v.price,
            stock: v.stock,
            sku: v.sku || "",
          })),
        };
      }
    } catch (error) {
      console.warn(`[DB] Failed to fetch product "${productSlug}":`, (error as Error).message);
    }
  }

  const category = SEED_CATEGORIES.find((c) => c.slug === categorySlug);
  const found = SEED_PRODUCTS.find((p) => p.slug === productSlug && p.categorySlug === categorySlug && p.isActive);
  if (!found) return null;

  return {
    ...found,
    categoryName: category?.name ?? categorySlug,
  };
}

/**
 * Get featured products for the home page.
 */
export async function getFeaturedProducts(): Promise<FormattedProduct[]> {
  if (isDbConfigured()) {
    try {
      const products = await prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        include: {
          category: true,
          variants: {
            orderBy: { price: "asc" },
          },
        },
        take: 8,
      });

      if (products && products.length > 0) {
        return products.map((p) => ({
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
            weight: v.weight || "",
            price: v.price,
            stock: v.stock,
            sku: v.sku || "",
          })),
        }));
      }
    } catch (error) {
      console.warn("[DB] Failed to fetch featured products:", (error as Error).message);
    }
  }

  return SEED_PRODUCTS.filter((p) => p.isFeatured && p.isActive).map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.slug === p.categorySlug);
    return {
      ...p,
      categoryName: cat?.name ?? p.categorySlug,
    };
  });
}

/**
 * Get all active products (used for sitemap and dynamic paths).
 */
export async function getAllProducts(): Promise<FormattedProduct[]> {
  if (isDbConfigured()) {
    try {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
          variants: {
            orderBy: { price: "asc" },
          },
        },
      });

      if (products && products.length > 0) {
        return products.map((p) => ({
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
            weight: v.weight || "",
            price: v.price,
            stock: v.stock,
            sku: v.sku || "",
          })),
        }));
      }
    } catch (error) {
      console.warn("[DB] Failed to fetch all products:", (error as Error).message);
    }
  }

  return SEED_PRODUCTS.filter((p) => p.isActive).map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.slug === p.categorySlug);
    return {
      ...p,
      categoryName: cat?.name ?? p.categorySlug,
    };
  });
}

/**
 * Get site settings (festival highlight banner, texts, toggle).
 */
export async function getSiteSettings(): Promise<SeedSiteSettings> {
  if (isDbConfigured()) {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "global" },
      });
      if (settings) {
        return {
          festivalHighlightActive: settings.festivalHighlightActive,
          festivalHighlightTitle: settings.festivalHighlightTitle,
          festivalHighlightSubtitle: settings.festivalHighlightSubtitle,
          festivalHighlightText: settings.festivalHighlightText,
          festivalHighlightImage: settings.festivalHighlightImage,
          festivalHighlightDiscount: settings.festivalHighlightDiscount || "",
        };
      }
    } catch (error) {
      console.warn("[DB] Failed to fetch site settings:", (error as Error).message);
    }
  }
  return SEED_SITE_SETTINGS;
}
