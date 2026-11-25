import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { searchProducts } from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Kanaka Sweets & Bakery for sweets, cakes, snacks and festival boxes.",
  robots: { index: false },
};

type SearchParams = Promise<{ q?: string | string[] }>;

/** The search box and the results. Reads the search term from the address (?q=). */
async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  // Only a single, trimmed, short string is used (never trust the address bar).
  const term = (typeof q === "string" ? q : "").trim().slice(0, 60);
  const products = term ? await searchProducts(term) : [];

  return (
    <>
      <form action="/search" role="search" className="flex gap-2 max-w-xl mb-8">
        <input
          type="search"
          name="q"
          defaultValue={term}
          maxLength={60}
          aria-label="Search sweets, cakes and gift boxes"
          placeholder="Try kaju, cake or gift box"
          className="flex-1 min-w-0 rounded-xl border border-stone-300 px-4 min-h-[48px] text-base text-[#002c3f] focus:outline-none focus:ring-2 focus:ring-[#871a45]/30"
        />
        <button type="submit" className="bg-[#871a45] hover:bg-[#691436] text-white font-bold text-sm rounded-xl px-6 min-h-[48px]">
          Search
        </button>
      </form>

      {term && products.length > 0 && (
        <>
          <p role="status" className="text-sm text-stone-600 mb-4">
            {products.length} {products.length === 1 ? "result" : "results"} for &ldquo;{term}&rdquo;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} headingLevel="h2" />
            ))}
          </div>
        </>
      )}

      {/* No products state (Rule B8), also shown before the first search */}
      {(!term || products.length === 0) && (
        <div className="rounded-3xl border border-stone-200 bg-[#FAF6EF] p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-[#002c3f]">
            {term ? `Nothing matched "${term}"` : "What are you looking for?"}
          </h2>
          <p className="text-sm text-stone-600">
            Browse a category, or call us and we&apos;ll help you choose.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              ["/sweets", "Sweets"],
              ["/cakes", "Cakes"],
              ["/snacks", "Snacks"],
              ["/festival-boxes", "Festival Boxes"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="inline-flex items-center rounded-full border border-[#871a45] text-[#871a45] font-bold text-sm px-5 min-h-[44px]">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: "var(--font-jost)" }}>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
        Search our shop
      </h1>
      <Suspense fallback={<div role="status" aria-label="Searching" className="h-48 rounded-2xl bg-stone-100 animate-pulse" />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
