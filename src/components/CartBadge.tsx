"use client";

import { selectCartCount, useCartStore } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

/** The cart item count shown on the header cart icon (Rule B4). */
export function CartBadge() {
  const hydrated = useHydrated();
  const count = useCartStore(selectCartCount);
  const shown = hydrated ? count : 0;

  return (
    <span
      aria-label={`${shown} items in cart`}
      className="absolute -top-1 -right-1.5 bg-[#871a45] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs"
    >
      {shown > 99 ? "99+" : shown}
    </span>
  );
}
