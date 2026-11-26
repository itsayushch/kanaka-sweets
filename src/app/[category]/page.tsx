import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { clip } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllCategories,
} from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";
import { SparklesIcon, LeafIcon, PackageIcon, GiftIcon } from "@/components/icons";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// This page waits for its full content instead of showing a loading placeholder first.
// Category pages are built in advance, so the wait is short, and nothing jumps while
// the page loads (Rule D3). This setting tells Next.js that the wait is intentional.
export const instant = false;

export async function generateStaticParams() {
  return [
    { category: "sweets" },
    { category: "cakes" },
    { category: "snacks" },
    { category: "festival-boxes" },
  ];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const categoryTitles: Record<string, string> = {
    sweets: "Traditional Pure Ghee Sweets & Mithai",
    cakes: "Fresh Eggless Cakes & Celebration Pastries",
    snacks: "Authentic Vijayawada Spicy Mixture & Savouries",
    "festival-boxes": "Festive Sweet Gift Boxes & Diwali Hampers",
  };

  const title = `${categoryTitles[categorySlug] || category.name} | Kanaka Sweets`;
  const description = clip(`${category.description} Same-day shop pickup in Governorpet, Vijayawada.`);

  return {
    // absolute: the title already ends with the shop name, so skip the layout template
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${categorySlug}`,
      images: [
        {
          url:
            category.image ||
            "/images/products/royal-festive-hamper.jpg",
          width: 1200,
          height: 630,
          alt: `${category.name} at Kanaka Sweets & Bakery Vijayawada`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        category.image ||
          "/images/products/royal-festive-hamper.jpg",
      ],
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <CategoryContent params={params} />
  );
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);
  const allCategories = await getAllCategories();

  const categoryHighlights: Record<string, string> = {
    sweets: "100% Pure Desi Cow Ghee",
    cakes: "Baked Fresh Daily • Eggless Options",
    snacks: "Cold-Pressed Groundnut Oil",
    "festival-boxes": "Best for Gifting • Velvet Packaging",
  };
  const highlightLabel = categoryHighlights[categorySlug] || "Handcrafted Daily";

  return (
    <div style={{ fontFamily: "var(--font-jost)" }} className="bg-white">
      {/* ── Compact Editorial Category Header (Products visible above the fold) ── */}
      <section className="bg-[#FAF6EF] border-b border-stone-200/80 py-6 sm:py-8">
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-600 flex items-center gap-1.5 mb-2">
            <Link
              href="/"
              className="hover:text-[#871a45] transition-colors inline-flex items-center min-h-[44px] pr-1"
            >
              Home
            </Link>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <span className="text-[#002c3f] font-semibold">{category.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                {/* H1 — Rule E4 */}
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002c3f] tracking-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {category.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-white border border-stone-200 text-[#871a45] text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#871a45]" />
                  <span>{products.length} Varieties</span>
                </span>
              </div>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {category.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs font-medium text-stone-700">
                <span className="inline-flex items-center gap-1.5">
                  {categorySlug === "festival-boxes" ? (
                    <GiftIcon className="w-3.5 h-3.5 text-[#871a45]" />
                  ) : (
                    <LeafIcon className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>{highlightLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PackageIcon className="w-3.5 h-3.5 text-[#871a45]" />
                  <span>Same-Day Counter Pickup · Vijayawada</span>
                </span>
              </div>
            </div>

            {/* Category Switcher Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 shrink-0">
              {allCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}`}
                  className={`shrink-0 px-4 min-h-[44px] inline-flex items-center rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    c.slug === categorySlug
                      ? "bg-[#871a45] text-white shadow-xs"
                      : "bg-white text-[#002c3f] border border-stone-200/90 hover:border-[#871a45] hover:text-[#871a45]"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section
        className="py-8 sm:py-10 bg-white"
        aria-label={`${category.name} products`}
      >
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-[#871a45]">
                <PackageIcon className="w-8 h-8" />
              </div>
              <h2
                className="text-xl font-bold text-[#002c3f]"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Fresh batch coming soon
              </h2>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                Our confectioners are preparing a fresh batch. Check back shortly or browse other categories.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#871a45] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#691436] transition-colors min-h-[44px]"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} headingLevel="h2" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SEO Footer Copy ── */}
      <div className="bg-[#FAF6EF] border-t border-stone-200/60 py-10">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2
            className="font-serif text-base font-bold text-[#871a45] mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Ordering {category.name} from Kanaka Sweets Vijayawada
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            All our {category.name.toLowerCase()} are prepared fresh daily at our Governorpet
            shop on Eluru Road. We use cold-pressed groundnut oil, pure butter cow ghee, and farm-fresh
            ingredients with zero vanaspati. Whether ordering for family consumption, festive Diwali gifts,
            or wedding hampers, we ensure tamper-proof, vacuum-sealed packaging so every sweet reaches
            you in peak freshness.
          </p>
        </div>
      </div>
    </div>
  );
}
