import Link from "next/link";
import Image from "next/image";
import type { FormattedProduct } from "@/lib/db-products";
import { StarIcon, GiftIcon } from "@/components/icons";

interface ProductCardProps {
  product: FormattedProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const sortedVariants = [...product.variants].sort((a, b) => a.price - b.price);
  const minPrice = sortedVariants[0]?.price ?? 0;
  const isOutOfStock = product.variants.every((v) => v.stock <= 0);
  const defaultVariant = sortedVariants[0];

  // Realistic MRP display (15% strikethrough for luxury confectionery feel)
  const originalPrice = Math.round(minPrice * 1.15);

  return (
    <article
      className="group relative bg-white rounded-2xl border border-stone-200/70 p-3.5 shadow-sm hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col h-full"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── 1:1 Product Image Container ── */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6EF]">
        <Image
          src={product.image}
          alt={`${product.name} — Kanaka Sweets & Bakery Vijayawada`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading={priority ? undefined : "lazy"}
        />

        {/* Top-left Badges (BSS Style with vector icon) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestForGifting ? (
            <span className="bg-[#871a45] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <GiftIcon className="w-3 h-3 text-[#F8D030]" />
              <span>Best for Gifting</span>
            </span>
          ) : product.isFeatured ? (
            <span className="bg-[#871a45] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              Best Seller
            </span>
          ) : (
            <span className="bg-[#002c3f]/90 text-white text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm">
              Vijayawada Fresh
            </span>
          )}
        </div>

        {/* Top-right FSSAI Green Vegetarian Dot */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <div
            className="w-4 h-4 bg-white/95 rounded border border-emerald-600 flex items-center justify-center p-0.5 shadow-sm"
            title="100% Pure Vegetarian"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
        </div>

        {/* Bottom-right Rating Badge (BSS Style with vector Star) */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          <span className="bg-[#002c3f]/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <StarIcon className="w-3 h-3 text-[#F8D030]" />
            <span>4.8</span>
          </span>
        </div>

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Product Info ── */}
      <div className="mt-3.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Subtitle / Spec tag */}
          <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
            {product.categoryName} {defaultVariant?.weight ? `• ${defaultVariant.weight}` : ""}
          </div>

          {/* Product Title */}
          <h3
            className="font-medium text-base sm:text-lg text-[#002c3f] group-hover:text-[#871a45] transition-colors line-clamp-1 leading-snug"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            <Link
              href={`/${product.categorySlug}/${product.slug}`}
              className="focus:outline-none focus-visible:underline"
            >
              {product.name}
            </Link>
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Row (BSS Architecture: Selling + Strikethrough + Discount Pill) */}
        <div className="mt-4 pt-2 border-t border-stone-100">
          <div className="flex items-baseline justify-between gap-1 mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-[#871a45]">
                ₹{minPrice}
              </span>
              <span className="text-xs text-stone-400 line-through font-normal">
                ₹{originalPrice}
              </span>
            </div>
            <span className="bg-[#fce8e8] text-[#c93b3b] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full">
              12% Off
            </span>
          </div>

          {/* Full-width "ADD TO CART" Button (BSS signature) */}
          <Link
            href={`/${product.categorySlug}/${product.slug}`}
            className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all min-h-[44px] shadow-sm ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-[#871a45] hover:bg-[#691436] active:scale-[0.98] text-white shadow-plum-700/10"
            }`}
            aria-label={`${isOutOfStock ? "Out of stock" : "Add to cart"} ${product.name}`}
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </Link>
        </div>
      </div>
    </article>
  );
}
