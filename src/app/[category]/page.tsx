import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllCategories,
} from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

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

  const title = `${categoryTitles[categorySlug] || category.name} | Kanaka Sweets Vijayawada`;
  const description = `${category.description} Handcrafted daily at our Governorpet shop with pure desi cow ghee. Same-day shop pickup available in Vijayawada.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kanaka-sweets.vercel.app/${categorySlug}`,
      images: [
        {
          url:
            category.image ||
            "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
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
          "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
      ],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  "use cache";
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(categorySlug);
  const allCategories = await getAllCategories();

  return (
    <div style={{ fontFamily: "var(--font-jost)" }} className="bg-white">
      {/* ── Category Hero Banner (Royal Blue & Gold Starbursts) ── */}
      <section className="relative bg-[#023757] text-white overflow-hidden py-12 sm:py-16">
        <div className="absolute top-4 right-10 text-[#F8D030]/20 text-5xl font-serif pointer-events-none select-none">
          ✦
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="text-xs text-white/60 flex items-center gap-2">
                <Link href="/" className="hover:text-[#F8D030] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-white font-medium">{category.name}</span>
              </nav>

              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#F8D030]">
                <span>✦</span>
                <span className="tracking-widest uppercase">
                  KANAKA SWEETS • VIJAYAWADA
                </span>
              </div>

              {/* H1 — Rule E4 */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {category.name}
              </h1>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {[
                  `✨ ${products.length} Fresh Varieties`,
                  "🧈 100% Pure Cow Ghee",
                  "📦 Same-Day Counter Pickup",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 border border-white/20 text-white/90 text-xs px-3.5 py-1.5 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 hidden md:block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src={category.image}
                  alt={`${category.name} collection`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Switcher Strip ── */}
      <div className="bg-[#FAF6EF] border-b border-stone-200/80 sticky top-[var(--navbar-h,0px)] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3.5">
            {allCategories.map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all min-h-[38px] inline-flex items-center ${
                  c.slug === categorySlug
                    ? "bg-[#871a45] text-white shadow-sm"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-[#871a45] hover:text-[#871a45]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Grid (BSS Style) ── */}
      <section
        className="py-12 sm:py-16 bg-white"
        aria-label={`${category.name} products`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <span className="text-5xl">🍬</span>
              <h2
                className="text-xl font-bold text-[#002c3f]"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Fresh batch coming soon
              </h2>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SEO Footer Copy ── */}
      <div className="bg-[#FAF6EF] border-t border-stone-200/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
