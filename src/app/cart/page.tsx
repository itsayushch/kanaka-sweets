import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart | Kanaka Sweets & Bakery",
  description:
    "View and manage your freshly selected sweets, cakes, and festive boxes.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div
      className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-8"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Your Shopping Cart
      </h1>
      <CartView />
    </div>
  );
}
