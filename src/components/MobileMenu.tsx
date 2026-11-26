"use client";

import { useState } from "react";
import Link from "next/link";
import { UserIcon, PhoneIcon } from "@/components/icons";

const MOBILE_LINKS = [
  { href: "/sweets", label: "Sweets & Mithai" },
  { href: "/cakes", label: "Fresh Cakes & Bakery" },
  { href: "/snacks", label: "Vijayawada Savouries" },
  { href: "/festival-boxes", label: "Festival Gift Boxes" },
  { href: "/contact", label: "Shop Location & Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="flex flex-col items-center justify-center text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[44px] min-h-[44px] cursor-pointer"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </div>
        <span className="text-[10px] font-semibold leading-none mt-1" style={{ fontFamily: "var(--font-jost)" }}>
          Menu
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-xl z-50 px-4 py-4 space-y-1">
          <nav aria-label="Mobile Categories" className="flex flex-col divide-y divide-stone-100">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold text-[#002c3f] hover:text-[#871a45] flex items-center justify-between min-h-[44px]"
              >
                <span>{link.label}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-semibold text-[#002c3f] hover:text-[#871a45] flex items-center gap-2 min-h-[44px]"
            >
              <UserIcon className="w-4 h-4" />
              <span>Admin / Profile</span>
            </Link>
            <a
              href="tel:+919000000000"
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-bold text-[#871a45] flex items-center gap-2 min-h-[44px]"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Call +91 90000 00000</span>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
