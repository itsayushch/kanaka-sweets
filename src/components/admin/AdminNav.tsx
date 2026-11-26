"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KanakaEmblemIcon } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/orders", label: "Orders", exact: false },
  { href: "/admin/settings", label: "Festival Highlight", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-stone-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand + Quick external/logout actions */}
        <div className="flex items-center justify-between gap-4 py-3 border-b border-stone-100">
          <Link href="/admin" className="flex items-center gap-2.5 group min-h-[44px]">
            <div className="w-9 h-9 rounded-xl bg-[#871a45] flex items-center justify-center text-[#F8D030] shadow-xs">
              <KanakaEmblemIcon className="w-5 h-5 text-[#F8D030]" />
            </div>
            <div>
              <div
                className="text-base font-bold text-[#002c3f] leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Kanaka Admin
              </div>
              <div className="text-[11px] font-medium text-stone-500 leading-tight">
                Store &amp; Order Manager
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs sm:text-sm font-semibold text-[#002c3f] transition-colors"
            >
              <span>View Shop</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-3.5 min-h-[44px] inline-flex items-center rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-xs sm:text-sm font-semibold text-rose-800 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Admin" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 px-4 min-h-[44px] inline-flex items-center rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#871a45] text-white shadow-xs"
                    : "text-[#002c3f] hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
