"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon } from "@/components/icons";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  categorySlug: string;
  variants: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ProductsTableClient({ products }: { products: AdminProductRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) map.set(p.categorySlug, p.categoryName);
    return Array.from(map.entries());
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.categorySlug !== category) return false;
      if (lowStockOnly && !p.variants.some((v) => v.stock <= 5)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.categoryName.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [products, query, category, lowStockOnly]);

  return (
    <div className="space-y-5">
      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name..."
            aria-label="Search products"
            className="w-full pl-10 pr-4 min-h-[44px] rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-[#871a45] focus:outline-none text-base text-[#002c3f]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`px-3.5 min-h-[44px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              category === "all"
                ? "bg-[#002c3f] text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map(([slug, name]) => (
            <button
              key={slug}
              type="button"
              onClick={() => setCategory(slug)}
              className={`px-3.5 min-h-[44px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                category === slug
                  ? "bg-[#002c3f] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLowStockOnly((v) => !v)}
            className={`px-3.5 min-h-[44px] rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              lowStockOnly
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
          >
            Low stock (≤5)
          </button>
        </div>
      </div>

      {/* Mobile Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/70">
                <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-base text-[#002c3f] truncate">{p.name}</h2>
                  <span
                    className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.isActive ? "Shown" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{p.categoryName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {p.variants.map((v) => (
                <span
                  key={v.id}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                    v.stock === 0
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : v.stock <= 5
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-stone-50 border-stone-200 text-stone-700"
                  }`}
                >
                  {v.name}: {rupees(v.price)} · {v.stock === 0 ? "Sold out" : `${v.stock} left`}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
              <Link
                href={`/admin/products/${p.id}`}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center rounded-xl bg-[#871a45] text-white text-sm font-bold"
              >
                Edit product
              </Link>
              <Link
                href={`/${p.categorySlug}/${p.slug}`}
                className="min-h-[44px] px-4 inline-flex items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-[#002c3f]"
              >
                View ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (md+) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/80 text-left text-xs uppercase tracking-wider text-stone-600 border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Sizes, Price &amp; Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/70">
                      <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#002c3f]">{p.name}</div>
                      {p.isFeatured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#871a45]">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-stone-700 font-medium">{p.categoryName}</td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.variants.map((v) => (
                      <span
                        key={v.id}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium ${
                          v.stock === 0
                            ? "bg-rose-50 border-rose-200 text-rose-800"
                            : v.stock <= 5
                              ? "bg-amber-50 border-amber-200 text-amber-900"
                              : "bg-stone-50 border-stone-200 text-stone-700"
                        }`}
                      >
                        <span>{v.name}:</span>
                        <span className="font-bold">{rupees(v.price)}</span>
                        <span className="text-stone-400">·</span>
                        <span>{v.stock === 0 ? "sold out" : `${v.stock} in stock`}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                      p.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.isActive ? "Shown" : "Hidden"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/${p.categorySlug}/${p.slug}`}
                      className="px-3 min-h-[40px] inline-flex items-center rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      View ↗
                    </Link>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="px-4 min-h-[40px] inline-flex items-center rounded-lg bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-600">
          No matching products found.
        </div>
      )}
    </div>
  );
}
