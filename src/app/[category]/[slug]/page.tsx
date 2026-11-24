import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getProductBySlug,
  getAllProducts,
  getProductsByCategory,
} from "@/lib/db-products";
import { ProductOptions } from "@/components/ProductOptions";
import { ProductCard } from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { category: categorySlug, slug: productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const title = `${product.name} (from ₹${minPrice}) | Kanaka Sweets Vijayawada`;
  const description = `${product.description} Order freshly made ${product.name} in Vijayawada with same-day shop pickup or doorstep delivery. Prepared with pure desi cow ghee.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kanaka-sweets.vercel.app/${categorySlug}/${productSlug}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: `Handcrafted ${product.name} from Kanaka Sweets & Bakery Vijayawada`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  "use cache";
  const { category: categorySlug, slug: productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  const relatedAll = await getProductsByCategory(categorySlug);
  const relatedProducts = relatedAll
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const isAvailable = product.variants.some((v) => v.stock > 0);

  // JSON-LD Product schema (Rule E6)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "Kanaka Sweets & Bakery",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants.length,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      offers: product.variants.map((v) => ({
        "@type": "Offer",
        name: v.name,
        price: v.price,
        priceCurrency: "INR",
        availability:
          v.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Kanaka Sweets & Bakery",
        },
      })),
    },
  };

  return (
    <>
      {/* JSON-LD (Rule E6) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12"
        style={{ fontFamily: "var(--font-jost)" }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-stone-400 flex items-center gap-1.5 flex-wrap"
        >
          <Link href="/" className="hover:text-[#871a45] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${product.categorySlug}`}
            className="hover:text-[#871a45] transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-stone-700 font-semibold">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#FAF6EF] border border-stone-100 shadow-sm">
              <Image
                src={product.image}
                alt={`${product.name} — handcrafted at Kanaka Sweets, Vijayawada`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
              {product.isBestForGifting && (
                <div className="absolute top-4 left-4 bg-[#871a45] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  🎁 Best for Gifting
                </div>
              )}
            </div>

            {/* Additional images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-stone-100 bg-[#FAF6EF]"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} — view ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 10vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product details */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#871a45]">
                {product.categoryName}
              </span>

              {/* H1 — Rule E4 */}
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#002c3f] mt-2 leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {product.name}
              </h1>

              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive options (Rule A3, F7, B4) */}
            <ProductOptions product={product} />
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section
            className="pt-8 border-t border-stone-100 space-y-6"
            aria-labelledby="related-heading"
          >
            <div className="flex items-center justify-between">
              <h2
                id="related-heading"
                className="text-xl sm:text-2xl font-bold text-[#002c3f]"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                More from {product.categoryName}
              </h2>
              <Link
                href={`/${product.categorySlug}`}
                className="text-sm font-bold text-[#871a45] hover:text-[#691436] transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
