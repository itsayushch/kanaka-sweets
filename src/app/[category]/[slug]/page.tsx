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
    return {
      title: "Product Not Found",
    };
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

  // Related products from same category
  const relatedAll = await getProductsByCategory(categorySlug);
  const relatedProducts = relatedAll.filter((p) => p.slug !== product.slug).slice(0, 3);

  // Lowest and highest prices for JSON-LD structured data (Rule E6)
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
      {/* Inject JSON-LD Structured Data (Rule E6) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${product.categorySlug}`}
            className="hover:text-amber-800 transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden bg-amber-50/50 border border-amber-900/10 shadow-md">
              <Image
                src={product.image}
                alt={`${product.name} made with pure desi ghee at Kanaka Sweets Vijayawada`}
                fill
                priority // Priority for Product Detail LCP (Rule D1)
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
              {product.isBestForGifting && (
                <div className="absolute top-4 left-4 bg-[#4c0e17] text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-400/40">
                  🎁 Best for Gifting
                </div>
              )}
            </div>

            {/* Extra Images Gallery if present */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-amber-900/10 bg-amber-50"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 33vw, 15vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Interactive Variant Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {product.categoryName}
              </span>
              {/* Single H1 on Product Page (Rule E4) */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mt-1">
                {product.name}
              </h1>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive Options, Dynamic Price & Stock (Rule A3, F7, B4) */}
            <ProductOptions product={product} />
          </div>
        </div>

        {/* Related Products from Category */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-amber-900/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                More from {product.categoryName}
              </h2>
              <Link
                href={`/${product.categorySlug}`}
                className="text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
