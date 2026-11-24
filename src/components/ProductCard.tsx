import Link from "next/link";
import Image from "next/image";
import type { FormattedProduct } from "@/lib/db-products";

interface ProductCardProps {
  product: FormattedProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const sortedVariants = [...product.variants].sort((a, b) => a.price - b.price);
  const minPrice = sortedVariants[0]?.price ?? 0;
  const isOutOfStock = product.variants.every((v) => v.stock <= 0);
  const defaultVariant = sortedVariants[0];

  return (
    <article
      className="group relative bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── Image 1:1 ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF6EF]">
        <Image
          src={product.image}
          alt={`${product.name} — handcrafted at Kanaka Sweets, Vijayawada`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading={priority ? undefined : "lazy"}
        />

        {/* Top-left badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestForGifting && (
            <span className="bg-[#871a45] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
              🎁 Best for Gifting
            </span>
          )}
          {!product.isBestForGifting && product.isFeatured && (
            <span className="bg-[#F8D030] text-[#002c3f] text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
              ★ Bestseller
            </span>
          )}
        </div>

        {/* Out-of-stock overlay badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category tag */}
        <div className="text-[10px] uppercase tracking-widest text-[#871a45] font-bold mb-1">
          {product.categoryName}
        </div>

        {/* Product name */}
        <h3 className="font-serif text-base sm:text-lg font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors line-clamp-1 leading-snug"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          <Link
            href={`/${product.categorySlug}/${product.slug}`}
            className="focus:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wide">Starting from</div>
            <div className="text-lg font-bold text-[#871a45]">
              ₹{minPrice}
              {defaultVariant?.weight && (
                <span className="text-xs font-normal text-stone-400 ml-1">
                  / {defaultVariant.weight}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/${product.categorySlug}/${product.slug}`}
            className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-colors min-h-[44px] ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-[#871a45] hover:bg-[#691436] text-white active:scale-[0.98]"
            }`}
            aria-label={`${isOutOfStock ? "Out of stock" : "View options for"} ${product.name}`}
          >
            {isOutOfStock ? "Sold Out" : "View Options →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
