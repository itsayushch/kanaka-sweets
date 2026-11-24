import Link from "next/link";
import Image from "next/image";
import type { FormattedProduct } from "@/lib/db-products";

interface ProductCardProps {
  product: FormattedProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // Lowest price variant
  const sortedVariants = [...product.variants].sort((a, b) => a.price - b.price);
  const minPrice = sortedVariants[0]?.price ?? 0;
  const isOutOfStock = product.variants.every((v) => v.stock <= 0);
  const defaultVariant = sortedVariants[0];

  return (
    <article className="group relative bg-white rounded-2xl border border-amber-900/10 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50">
        <Image
          src={product.image}
          alt={`Authentic ${product.name} from Kanaka Sweets Vijayawada`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading={priority ? undefined : "lazy"}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
          {product.isBestForGifting ? (
            <span className="bg-[#4c0e17] text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-400/40">
              <span>🎁</span> Best for Gifting
            </span>
          ) : product.isFeatured ? (
            <span className="bg-amber-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              Specialty
            </span>
          ) : <span />}

          {isOutOfStock && (
            <span className="bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-1">
            {product.categoryName}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#4c0e17] transition-colors line-clamp-1">
            <Link
              href={`/${product.categorySlug}/${product.slug}`}
              className="focus:outline-none focus:underline"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-500">Starting from</div>
            <div className="text-base sm:text-lg font-bold text-[#4c0e17]">
              ₹{minPrice}
              {defaultVariant?.weight && (
                <span className="text-xs font-normal text-stone-500 ml-1">
                  / {defaultVariant.weight}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/${product.categorySlug}/${product.slug}`}
            className={`inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] ${
              isOutOfStock
                ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                : "bg-amber-500 text-stone-900 hover:bg-amber-400 active:scale-95"
            }`}
            aria-label={`View options for ${product.name}`}
          >
            {isOutOfStock ? "Sold Out" : "View Options"}
          </Link>
        </div>
      </div>
    </article>
  );
}
