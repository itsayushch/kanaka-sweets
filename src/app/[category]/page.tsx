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
    <div style={{ fontFamily: "var(--font-jost)" }}>
      {/* ── Category Hero ── */}
      <section className="bg-[#002c3f] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="text-xs text-white/50 flex items-center gap-1.5">
                <Link href="/" className="hover:text-white/80 transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-white/80 font-medium">{category.name}</span>
              </nav>

              <p className="text-[#F8D030] text-xs font-bold uppercase tracking-[0.2em]">
                Kanaka Sweets &amp; Bakery · Vijayawada
              </p>

              {/* H1 — Rule E4 */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {category.name}
              </h1>

              <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-lg">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  `✨ ${products.length} Varieties`,
                  "🧈 100% Pure Ghee",
                  "📦 Same-day Pickup",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <Image
                  src={category.image}
                  alt={`${category.name} at Kanaka Sweets Vijayawada`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Switcher ── */}
      <div className="bg-[#FAF6EF] border-b border-stone-200 sticky top-[var(--navbar-h,0px)] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
            {allCategories.map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors min-h-[36px] inline-flex items-center ${
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

      {/* ── Products Grid ── */}
      <section
        className="py-10 sm:py-14 bg-white"
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
                className="inline-flex items-center gap-2 bg-[#871a45] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#691436] transition-colors min-h-[44px]"
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

      {/* ── SEO footer copy ── */}
      <div className="bg-[#FAF6EF] border-t border-stone-100 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-serif text-sm font-bold text-[#871a45] mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Ordering {category.name} from Kanaka Sweets Vijayawada
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-3xl">
            All our {category.name.toLowerCase()} are prepared fresh daily at our Governorpet
            shop on Eluru Road. We use cold-pressed oils, pure butter ghee, and farm-fresh
            ingredients. Whether ordering for daily consumption, a wedding celebration, or festival
            gifts, we ensure tamper-proof, vacuum-sealed packaging so every item reaches you at
            peak freshness.
          </p>
        </div>
      </div>
    </div>
  );
}
