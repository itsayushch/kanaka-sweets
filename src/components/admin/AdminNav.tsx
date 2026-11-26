"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KanakaEmblemIcon, PackageIcon, ShoppingBagIcon, SparklesIcon } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "dashboard" },
  { href: "/admin/products", label: "Products", exact: false, icon: "products" },
  { href: "/admin/orders", label: "Orders", exact: false, icon: "orders" },
  { href: "/admin/settings", label: "Festival Highlight", exact: false, icon: "festival" },
] as const;

function NavIcon({ kind }: { kind: (typeof NAV_ITEMS)[number]["icon"] }) {
  if (kind === "products") return <PackageIcon className="w-4 h-4 shrink-0" />;
  if (kind === "orders") return <ShoppingBagIcon className="w-4 h-4 shrink-0" />;
  if (kind === "festival") return <SparklesIcon className="w-4 h-4 shrink-0" />;
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <>
      {/* ── Desktop Left Sidebar (lg+) ── */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col bg-[#002c3f] text-white sticky top-0 h-screen border-r border-[#013b54]">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 min-h-[44px]">
            <div className="w-10 h-10 rounded-xl bg-[#871a45] flex items-center justify-center text-[#F8D030] shadow-sm shrink-0">
              <KanakaEmblemIcon className="w-5 h-5 text-[#F8D030]" />
            </div>
            <div>
              <div
                className="text-lg font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Kanaka Admin
              </div>
              <div className="text-[11px] font-medium text-white/65 leading-tight">
                Vijayawada Store Manager
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Admin" className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#871a45] text-white shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <NavIcon kind={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="w-full px-3.5 min-h-[44px] flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition-colors"
          >
            <span>View Storefront</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full px-3.5 min-h-[44px] flex items-center justify-center rounded-xl border border-white/15 hover:bg-rose-600/20 hover:border-rose-400/40 text-sm font-semibold text-rose-200 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile / Tablet Top Header (< lg) ── */}
      <header className="lg:hidden bg-[#002c3f] text-white sticky top-0 z-30 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5 min-h-[44px]">
            <div className="w-8 h-8 rounded-lg bg-[#871a45] flex items-center justify-center text-[#F8D030]">
              <KanakaEmblemIcon className="w-4 h-4 text-[#F8D030]" />
            </div>
            <span
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Kanaka Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 min-h-[44px] inline-flex items-center rounded-lg bg-white/10 text-xs font-semibold text-white"
            >
              Shop ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-3 min-h-[44px] inline-flex items-center rounded-lg bg-rose-500/20 text-xs font-semibold text-rose-200 cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin Mobile" className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 px-3.5 min-h-[44px] inline-flex items-center gap-2 rounded-xl text-xs font-bold transition-colors ${
                  active ? "bg-[#871a45] text-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <NavIcon kind={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
