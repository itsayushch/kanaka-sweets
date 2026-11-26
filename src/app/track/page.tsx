import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { orderNumberSchema } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the payment and pickup status of your Kanaka Sweets & Bakery order.",
  robots: { index: false },
};

type SearchParams = Promise<{ order?: string | string[] }>;

/**
 * The order number form. It sends the number in the address (?order=), so it works
 * as a plain form. A number that exists goes to that order's status page, which
 * shows no name, phone or address.
 */
async function TrackForm({ searchParams }: { searchParams: SearchParams }) {
  const { order } = await searchParams;
  const typed = typeof order === "string" ? order.slice(0, 40) : undefined;
  let error = "";

  // `typed` is undefined on the first visit, before anything was submitted.
  if (typed !== undefined) {
    const parsed = orderNumberSchema.safeParse(typed);
    if (!parsed.success) {
      error = "Enter your order number as shown on your order, like KS-261125-A1B2C3.";
    } else {
      const found = await prisma.order.findUnique({
        where: { orderNumber: parsed.data },
        select: { orderNumber: true },
      });
      if (found) redirect(`/order/${found.orderNumber}`);
      error = "We couldn't find that order. Check the number, or call the shop.";
    }
  }

  return (
    <form action="/track" className="space-y-2">
      <label htmlFor="order" className="block text-sm font-bold text-[#002c3f]">
        Order number
      </label>
      <input
        id="order"
        name="order"
        type="text"
        defaultValue={typed}
        maxLength={40}
        autoComplete="off"
        autoCapitalize="characters"
        placeholder="KS-261125-A1B2C3"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "order-error" : "order-hint"}
        className="w-full rounded-xl border border-stone-300 px-4 min-h-[48px] text-base text-[#002c3f] focus:outline-none focus:ring-2 focus:ring-[#871a45]/30 aria-[invalid=true]:border-rose-600"
      />
      {error ? (
        <p id="order-error" role="alert" className="text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : (
        <p id="order-hint" className="text-sm text-stone-600">
          It starts with KS- and was shown after you placed your order.
        </p>
      )}
      <button
        type="submit"
        className="w-full bg-[#871a45] hover:bg-[#691436] text-white font-bold text-sm rounded-xl min-h-[48px] transition-colors"
      >
        Check order
      </button>
    </form>
  );
}

export default function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="py-12 max-w-md mx-auto px-4 sm:px-6" style={{ fontFamily: "var(--font-jost)" }}>
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-6 text-center"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Track your order
      </h1>
      <Suspense
        fallback={<div role="status" aria-label="Loading" className="h-40 rounded-2xl bg-stone-100 animate-pulse" />}
      >
        <TrackForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
