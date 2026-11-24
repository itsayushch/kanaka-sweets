import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingBagIcon, GiftIcon, ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Shopping Cart | Kanaka Sweets & Bakery",
  description: "View and manage your freshly selected sweets, cakes, and festive boxes.",
};

export default function CartPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: "var(--font-jost)" }}>
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-8"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Your Shopping Cart
      </h1>

      {/* Designed Empty Cart State (Rule B8) */}
      <div className="bg-[#FAF6EF] rounded-3xl border border-stone-200/80 p-8 sm:p-14 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#871a45] mx-auto border border-stone-200">
          <ShoppingBagIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2
            className="font-serif text-xl sm:text-2xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Your sweet cart is currently empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Choose from our authentic Vijayawada specialties, pure desi cow ghee sweets,
            and festive celebration gift boxes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sweets"
            className="inline-flex items-center gap-2 bg-[#871a45] hover:bg-[#691436] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all min-h-[44px] shadow-sm"
          >
            <span>Browse Sweets</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href="/festival-boxes"
            className="inline-flex items-center gap-2 bg-[#002c3f] hover:bg-[#023e5a] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wider transition-all shadow-sm min-h-[44px]"
          >
            <GiftIcon className="w-4 h-4 text-[#F8D030]" />
            <span>Explore Festival Boxes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
