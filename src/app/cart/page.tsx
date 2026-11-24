import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Kanaka Sweets & Bakery",
  description: "View and manage your freshly selected sweets, cakes, and festive boxes.",
};

export default function CartPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-8">
        Your Shopping Cart
      </h1>

      {/* Designed Empty Cart State (Rule B8) */}
      <div className="bg-white rounded-3xl border border-amber-900/10 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="text-6xl">🛍️</div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="font-serif text-xl font-bold text-stone-800">
            Your sweet cart is currently empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Choose from our authentic Vijayawada specialties, pure desi ghee sweets,
            and festive celebration gift boxes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sweets"
            className="inline-flex items-center gap-2 bg-[#4c0e17] text-amber-200 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#681320] transition-colors min-h-[44px]"
          >
            <span>🍬</span> Browse Sweets
          </Link>
          <Link
            href="/festival-boxes"
            className="inline-flex items-center gap-2 bg-amber-500 text-maroon-950 px-5 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors shadow-sm min-h-[44px]"
          >
            <span>🪔</span> Explore Festival Boxes
          </Link>
        </div>
      </div>
    </div>
  );
}
