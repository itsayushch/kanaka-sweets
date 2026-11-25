"use client";

/**
 * "Add to Cart" button for product cards in lists (Rule B4).
 *
 * It adds ONE of the cheapest size that is in stock (the same price the card
 * shows as "from ₹..."). Only ids and a quantity go in the cart (Rule F1).
 * To pick another size the customer opens the product page via the card.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import type { FormattedProduct } from "@/lib/db-products";

export function QuickAddButton({ product }: { product: FormattedProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cheapest variant that can actually be bought.
  const variant = [...product.variants]
    .sort((a, b) => a.price - b.price)
    .find((v) => v.stock > 0);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Nothing in stock: show a disabled "Sold Out" button (A3, F7).
  if (!variant) {
    return (
      <button
        type="button"
        disabled
        aria-label={`${product.name} is sold out`}
        className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider min-h-[44px] bg-stone-100 text-stone-600 cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  const handleAdd = () => {
    addItem({ productId: product.id, variantId: variant.id, quantity: 1 });
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 8000);
  };

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} (${variant.name}) to cart`}
        className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider min-h-[44px] bg-[#871a45] hover:bg-[#691436] active:scale-[0.98] text-white shadow-sm transition-transform"
      >
        {justAdded ? "Added ✓" : "Add to Cart"}
      </button>
      {/* Clear feedback after adding (B4), announced to screen readers. */}
      <p role="status" aria-live="polite" className="min-h-4 text-[11px] text-center text-stone-600">
        {justAdded ? (
          <>
            {variant.name} added.{" "}
            <Link href="/checkout" className="font-bold text-[#871a45] underline inline-flex items-center min-h-[44px]">
              Checkout
            </Link>
            {" · "}
            <Link href="/cart" className="font-bold text-[#871a45] underline inline-flex items-center min-h-[44px]">
              View cart
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
