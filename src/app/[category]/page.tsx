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
    return {
      title: "Category Not Found",
    };
  }

  const categoryTitles: Record<string, string> = {
    sweets: "Traditional Pure Ghee Sweets & Mithai",
    cakes: "Fresh Eggless Cakes & Celebration Pastries",
    snacks: "Authentic Vijayawada Spicy Mixture & Savouries",
    "festival-boxes": "Festive Sweet Gift Boxes & Diwali Hampers",
  };

  const title = `${categoryTitles[categorySlug] || category.name} | Kanaka Sweets Vijayawada`;
  const description = `${category.description} Handcrafted daily at our Governorpet shop with pure desi cow ghee. Delivery & same-day shop pickup in Vijayawada.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kanaka-sweets.vercel.app/${categorySlug}`,
      images: [
        {
          url: category.image || "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
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
      images: [category.image || "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80"],
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
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-500 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-800 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-semibold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4c0e17] to-[#6b1422] text-[#fdfbf7] p-6 sm:p-10 shadow-lg border border-amber-500/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold">
              Kanaka Sweets & Bakery • Vijayawada
            </span>
            {/* Single H1 per page (Rule E4) */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl leading-relaxed">
              {category.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs text-amber-200">
              <span className="bg-[#380b11] px-3 py-1.5 rounded-full border border-amber-400/20">
                ✨ {products.length} Varieties Available
              </span>
              <span className="bg-[#380b11] px-3 py-1.5 rounded-full border border-amber-400/20">
                🧈 100% Pure Desi Ghee
              </span>
              <span className="bg-[#380b11] px-3 py-1.5 rounded-full border border-amber-400/20">
                📦 Same-day Pickup Available
              </span>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:block">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-400/30 shadow-md">
              <Image
                src={category.image}
                alt={`${category.name} collection`}
                fill
                priority // Priority for category hero image
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Categories Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <span className="text-stone-500 font-medium whitespace-nowrap mr-1">Switch:</span>
        {allCategories.map((c) => (
          <Link
            key={c.id}
            href={`/${c.slug}`}
            className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors min-h-[36px] inline-flex items-center ${
              c.slug === categorySlug
                ? "bg-[#4c0e17] text-amber-300"
                : "bg-stone-100 text-stone-700 hover:bg-amber-100"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      <section aria-label={`${category.name} list`}>
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
            <span className="text-4xl">🍬</span>
            <h2 className="text-xl font-serif font-bold text-stone-800">
              No products found in this category
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Our master confectioners are preparing a fresh batch. Check back shortly or browse other categories.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Footer SEO Copy (Rule C4 & E7) */}
      <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-900/10 text-xs text-stone-600 space-y-2 leading-relaxed">
        <h2 className="font-serif text-sm font-bold text-[#4c0e17]">
          Ordering {category.name} from Kanaka Sweets Vijayawada
        </h2>
        <p>
          All our {category.name.toLowerCase()} are prepared fresh every day at our
          Governorpet shop on Eluru Road. We use cold-pressed oils, pure butter ghee,
          and farm-fresh ingredients. Whether you are ordering for daily consumption,
          a wedding celebration, or festival gifts, we ensure tamper-proof, vacuum-sealed
          packaging so every item reaches you in peak freshness.
        </p>
      </div>
    </div>
  );
}
