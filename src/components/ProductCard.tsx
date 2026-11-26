import Link from "next/link";
import Image from "next/image";
import type { FormattedProduct } from "@/lib/db-products";
import { StarIcon, GiftIcon, VegetarianMarkIcon } from "@/components/icons";
import { QuickAddButton } from "@/components/QuickAddButton";

interface ProductCardProps {
  product: FormattedProduct;
  priority?: boolean;
  /** Heading level of the product name: h2 when the card sits right under the page title, h3 under a section heading. */
  headingLevel?: "h2" | "h3";
}

export function ProductCard({ product, priority = false, headingLevel = "h3" }: ProductCardProps) {
  const Heading = headingLevel;
  const sortedVariants = [...product.variants].sort((a, b) => a.price - b.price);
  const minPrice = sortedVariants[0]?.price ?? 0;
  const isOutOfStock = product.variants.every((v) => v.stock <= 0);
  const defaultVariant = sortedVariants[0];


  return (
    <article
      className="group relative bg-white rounded-2xl border border-stone-200/70 p-3.5 shadow-sm hover:shadow-xl hover:border-stone-300 transition-colors duration-300 flex flex-col h-full"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      {/* ── 1:1 Product Image Container ── */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6EF]">
        <Image
          src={product.image}
          alt={`${product.name} — Kanaka Sweets & Bakery Vijayawada`}
          width={800}
          height={800}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading={priority ? undefined : "lazy"}
        />

        {/* Top-left Badges (BSS Style with vector icon) */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestForGifting ? (
            <span className="bg-[#871a45] text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
              <GiftIcon className="w-3 h-3 text-[#F8D030] shrink-0" />
              <span>Best for Gifting</span>
            </span>
          ) : product.isFeatured ? (
            <span className="bg-[#871a45] text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md whitespace-nowrap">
              Best Seller
            </span>
          ) : (
            <span className="bg-[#002c3f]/90 text-white text-[9px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              Vijayawada Fresh
            </span>
          )}
        </div>

        {/* Green vegetarian mark: bottom-left, so it never covers the badge on narrow phones */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none shadow-sm rounded">
          <VegetarianMarkIcon className="w-4 h-4" />
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
          <div className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold mb-1">
            {product.categoryName} {defaultVariant?.weight ? `• ${defaultVariant.weight}` : ""}
          </div>

          {/* Product Title */}
          <Heading
            className="font-medium text-base sm:text-lg text-[#002c3f] group-hover:text-[#871a45] transition-colors leading-snug"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            <Link
              href={`/${product.categorySlug}/${product.slug}`}
              className="block py-[11px] -my-[11px] focus:outline-none focus-visible:underline"
            >
              {product.name}
            </Link>
          </Heading>

          {/* Short description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price row: the real "from" price, no fake discount */}
        <div className="mt-4 pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-xs text-stone-600">From</span>
            <span className="text-lg sm:text-xl font-bold text-[#871a45]">
              ₹{minPrice}
            </span>
          </div>

          {/* Real add-to-cart (adds the cheapest in-stock size) */}
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
