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

  return (
    <div className="hidden sm:flex relative group/profile items-center">
      <Link
        href={adminUser ? "/admin" : "/admin/login"}
        className="flex flex-col items-center justify-center text-[#002c3f] group-hover/profile:text-[#871a45] transition-colors min-w-[44px] min-h-[44px]"
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

      {/* Dropdown Panel */}
      <div className="absolute right-0 top-full pt-2.5 w-64 invisible opacity-0 group-hover/profile:visible group-hover/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:opacity-100 transition-[opacity,visibility] duration-150 z-50">
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-[0_14px_40px_rgba(0,0,0,0.14)] overflow-hidden text-left">
          {/* Header */}
          <div className="px-4 py-3 bg-[#FAF6EF] border-b border-stone-200/70">
            {adminUser ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Store Manager
                  </span>
                </div>
                <div className="text-xs font-medium text-[#002c3f] truncate">
                  {adminUser.email || adminUser.name || "Signed in"}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[13px] font-bold text-[#002c3f]">
                  Welcome to Kanaka Sweets
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Fast guest checkout · No sign-up needed
                </p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-1.5">
            {adminUser ? (
              <ul className="space-y-0.5 text-[13px] font-medium text-[#002c3f]">
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] font-semibold transition-colors"
                  >
                    <span>Admin Dashboard</span>
                    <span className="text-[10px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products"
                    className="block px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    Manage Products &amp; Stock
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/orders"
                    className="block px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    View Customer Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className="block px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    Festival Highlight
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-0.5 text-[13px] font-medium text-[#002c3f]">
                <li>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    My Cart &amp; Checkout
                  </Link>
                </li>
                <li>
                  <Link
                    href="/festival-boxes"
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    <span>Festival Gift Boxes</span>
                    <span className="text-[10px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded">
                      Gifting
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block px-3 py-2 rounded-lg hover:bg-[#FAF6EF] hover:text-[#871a45] transition-colors"
                  >
                    Shop Location &amp; Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-2.5 border-t border-stone-100 bg-stone-50/60">
            {adminUser ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full min-h-[38px] px-3 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="w-full min-h-[38px] px-3 rounded-lg bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-2xs"
              >
                Store Manager Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
