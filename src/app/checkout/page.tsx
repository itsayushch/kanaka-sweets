import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Kanaka Sweets & Bakery",
  description:
    "Choose home delivery in Vijayawada or shop pickup at Kanaka Sweets & Bakery, Governorpet.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div
      className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-8"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
