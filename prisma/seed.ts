import { PrismaClient } from "../src/generated/prisma/client.js";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_SITE_SETTINGS } from "../src/data/seed-data.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Kanaka Sweets & Bakery...");

  // 1. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {
      festivalHighlightActive: SEED_SITE_SETTINGS.festivalHighlightActive,
      festivalHighlightTitle: SEED_SITE_SETTINGS.festivalHighlightTitle,
      festivalHighlightSubtitle: SEED_SITE_SETTINGS.festivalHighlightSubtitle,
      festivalHighlightText: SEED_SITE_SETTINGS.festivalHighlightText,
      festivalHighlightImage: SEED_SITE_SETTINGS.festivalHighlightImage,
      festivalHighlightDiscount: SEED_SITE_SETTINGS.festivalHighlightDiscount,
    },
    create: {
      id: "global",
      festivalHighlightActive: SEED_SITE_SETTINGS.festivalHighlightActive,
      festivalHighlightTitle: SEED_SITE_SETTINGS.festivalHighlightTitle,
      festivalHighlightSubtitle: SEED_SITE_SETTINGS.festivalHighlightSubtitle,
      festivalHighlightText: SEED_SITE_SETTINGS.festivalHighlightText,
      festivalHighlightImage: SEED_SITE_SETTINGS.festivalHighlightImage,
      festivalHighlightDiscount: SEED_SITE_SETTINGS.festivalHighlightDiscount,
    },
  });
  console.log("✔ Site settings seeded");

  // 2. Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of SEED_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
      },
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(`✔ ${SEED_CATEGORIES.length} Categories seeded`);

  // 3. Seed Products and Variants
  for (const prod of SEED_PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        image: prod.image,
        images: prod.images,
        isFeatured: prod.isFeatured,
        isBestForGifting: prod.isBestForGifting,
        isActive: prod.isActive,
        categoryId: categoryId,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        image: prod.image,
        images: prod.images,
        isFeatured: prod.isFeatured,
        isBestForGifting: prod.isBestForGifting,
        isActive: prod.isActive,
        categoryId: categoryId,
      },
    });

    for (const v of prod.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          name: v.name,
          weight: v.weight,
          price: v.price,
          stock: v.stock,
          productId: product.id,
        },
        create: {
          name: v.name,
          weight: v.weight,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
          productId: product.id,
        },
      });
    }
  }
  console.log(`✔ ${SEED_PRODUCTS.length} Products and their variants seeded`);
  console.log("Seeding complete! 🪔");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
