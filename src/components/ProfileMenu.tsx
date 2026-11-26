"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon } from "@/components/icons";

interface AdminUser {
  email?: string;
  name?: string;
  role?: string;
}

export function ProfileMenu() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/get-session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: AdminUser } | null) => {
        if (!active) return;
        if (data?.user?.role === "admin") {
          setAdminUser(data.user);
        } else {
          setAdminUser(null);
        }
      })
      .catch(() => {
        if (active) setAdminUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        credentials: "include",
      });
      setAdminUser(null);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const rowClass =
    "block py-1.5 text-[13px] text-stone-700 hover:text-[#002c3f] hover:font-semibold transition-colors";

  return (
    <div className="hidden sm:flex relative group/profile items-center h-full">
      <Link
        href={adminUser ? "/admin" : "/admin/login"}
        className="flex flex-col items-center justify-center text-[#002c3f] group-hover/profile:text-[#871a45] transition-colors min-w-[44px] min-h-[44px] border-b-2 border-transparent group-hover/profile:border-[#871a45]"
        aria-label={adminUser ? "Store Manager Dashboard" : "Profile and Store Manager Login"}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-[#002c3f] group-hover/profile:text-[#871a45] transition-colors" />
          {adminUser && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white"
              title="Signed in as Store Manager"
            />
          )}
        </div>
        <span
          className="text-[10px] font-semibold leading-none mt-1 text-[#002c3f] group-hover/profile:text-[#871a45] transition-colors"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          {adminUser ? "Admin" : "Profile"}
        </span>
      </Link>

      {/* Myntra-style clean white dropdown */}
      <div className="absolute right-0 top-full w-64 invisible opacity-0 group-hover/profile:visible group-hover/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:opacity-100 transition-[opacity,visibility] duration-150 z-50">
        <div className="bg-white border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4 text-left">
          {/* Top Welcome / Auth Section */}
          <div className="pb-3.5 border-b border-stone-200/70">
            {adminUser ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-[#002c3f]">Store Manager</span>
                </div>
                <p className="text-xs text-stone-600 truncate mt-0.5">
                  {adminUser.email || adminUser.name || "Signed in"}
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center mt-3 px-4 min-h-[38px] border border-stone-300 hover:border-[#871a45] text-xs font-bold uppercase tracking-wider text-[#871a45] transition-colors"
                >
                  Open Dashboard
                </Link>
              </>
            ) : (
              <>
                <div className="text-sm font-bold text-[#002c3f]">Welcome</div>
                <p className="text-xs text-stone-600 mt-0.5">
                  To manage shop, products and orders
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center mt-3 px-4 min-h-[38px] border border-stone-300 hover:border-[#871a45] text-xs font-bold uppercase tracking-wider text-[#871a45] transition-colors"
                >
                  Store Manager Login
                </Link>
              </>
            )}
          </div>

          {/* Admin Links (only when signed in as admin) */}
          {adminUser && (
            <div className="py-2.5 border-b border-stone-200/70">
              <Link href="/admin/products" className={rowClass}>
                Products &amp; Stock
              </Link>
              <Link href="/admin/orders" className={rowClass}>
                Customer Orders
              </Link>
              <Link href="/admin/settings" className={rowClass}>
                Festival Highlight
              </Link>
            </div>
          )}

          {/* Storefront Quick Links */}
          <div className="py-2.5 border-b border-stone-200/70">
            <Link href="/cart" className={rowClass}>
              Cart &amp; Checkout
            </Link>
            <Link
              href="/festival-boxes"
              className="flex items-center gap-2 py-1.5 text-[13px] text-stone-700 hover:text-[#002c3f] hover:font-semibold transition-colors"
            >
              <span>Festival Boxes</span>
              <span className="bg-[#871a45] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs leading-none">
                Gifting
              </span>
            </Link>
            <Link href="/sweets" className={rowClass}>
              Pure Ghee Sweets
            </Link>
            <Link href="/cakes" className={rowClass}>
              Cakes &amp; Bakery
            </Link>
            <Link href="/snacks" className={rowClass}>
              Vijayawada Savouries
            </Link>
          </div>

          {/* Support & Sign out */}
          <div className="pt-2.5">
            <Link href="/contact" className={rowClass}>
              Contact &amp; Directions
            </Link>
            <a
              href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20order"
              target="_blank"
              rel="noopener noreferrer"
              className={rowClass}
            >
              WhatsApp Order
            </a>
            <a href="tel:+919000000000" className={rowClass}>
              Call +91 90000 00000
            </a>
            {adminUser && (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="block w-full text-left py-1.5 mt-1 text-[13px] font-semibold text-rose-700 hover:text-rose-900 cursor-pointer disabled:opacity-60"
              >
                {signingOut ? "Signing out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
