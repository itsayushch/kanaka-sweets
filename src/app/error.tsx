"use client";

/**
 * Shown when a page crashes unexpectedly (Rule B8: designed error state).
 * The customer gets a friendly message, a way to retry, and a one-tap call or
 * WhatsApp. The technical details are only logged, never shown.
 */
import { useEffect } from "react";
import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error instanceof Error ? error.message : "unknown error");
  }, [error]);

  return (
    <div
      className="min-h-[50vh] flex items-center justify-center px-4 py-16"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <div className="max-w-md text-center space-y-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f]" style={{ fontFamily: "var(--font-fraunces)" }}>
          Something went wrong
        </h1>
        <p className="text-stone-600 leading-relaxed">
          Sorry, this page could not load. Please try again. If it keeps happening, call or message us and
          we&apos;ll take your order directly.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="bg-[#871a45] hover:bg-[#691436] text-white font-bold text-sm rounded-xl px-6 min-h-[48px]"
          >
            Try again
          </button>
          <a
            href="tel:+919000000000"
            className="inline-flex items-center gap-2 border-2 border-[#871a45] text-[#871a45] font-bold text-sm rounded-xl px-5 min-h-[48px]"
          >
            <PhoneIcon className="w-4 h-4" /> Call us
          </a>
          <a
            href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0f7a3d] text-white font-bold text-sm rounded-xl px-5 min-h-[48px]"
          >
            <WhatsAppIcon className="w-4 h-4" /> WhatsApp
          </a>
        </div>
        <Link href="/" className="inline-block text-sm font-semibold text-stone-600 underline min-h-[44px] leading-[44px]">
          Back to home
        </Link>
      </div>
    </div>
  );
}
