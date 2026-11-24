import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Frame around every admin page. It only draws the menu.
 * The login check is NOT done here: every admin page calls requireAdminPage()
 * itself, because a layout is not re-run when you move between pages (Rule F3).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const link = "px-3 min-h-[44px] inline-flex items-center rounded-lg text-sm font-semibold text-[#002c3f] hover:bg-stone-100";
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" style={{ fontFamily: "var(--font-jost)" }}>
      <nav aria-label="Admin" className="flex flex-wrap items-center gap-1 border-b border-stone-200 pb-3 mb-8">
        <Link href="/admin" className={link}>Dashboard</Link>
        <Link href="/admin/products" className={link}>Products</Link>
        <Link href="/admin/orders" className={link}>Orders</Link>
        <Link href="/admin/settings" className={link}>Festival highlight</Link>
        <Link href="/" className={link + " ml-auto"}>View shop</Link>
        <form action={logoutAction}>
          <button type="submit" className={link + " text-rose-700"}>Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
