"use client";

import Image from "next/image";
import Link from "next/link";
import { MAX_CART_QUANTITY, useCartStore } from "@/lib/cart-store";
import { useCartLines } from "@/lib/use-cart-lines";
import {
  ArrowRightIcon,
  GiftIcon,
  ShoppingBagIcon,
} from "@/components/icons";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Full cart page content: items, quantity buttons, total and checkout link. */
export function CartView() {
  const { status, lines, subtotal, retry } = useCartLines();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // ── Loading state (B8) ──
  if (status === "loading") {
    return (
      <div role="status" aria-label="Loading your cart" className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  // ── Empty cart state (B8) ──
  if (status === "empty") {
    return (
      <div className="bg-[#FAF6EF] rounded-3xl border border-stone-200/80 p-8 sm:p-14 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#871a45] mx-auto border border-stone-200">
          <ShoppingBagIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2
            className="font-serif text-xl sm:text-2xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Your sweet cart is currently empty
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Choose from our authentic Vijayawada specialties, pure desi cow ghee
            sweets, and festive celebration gift boxes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sweets"
            className="inline-flex items-center gap-2 bg-[#871a45] hover:bg-[#691436] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider min-h-[44px] shadow-sm"
          >
            <span>Browse Sweets</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href="/festival-boxes"
            className="inline-flex items-center gap-2 bg-[#002c3f] hover:bg-[#023e5a] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wider shadow-sm min-h-[44px]"
          >
            <GiftIcon className="w-4 h-4 text-[#F8D030]" />
            <span>Explore Festival Boxes</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Error state (B8) ──
  if (status === "error") {
    return (
      <div
        role="alert"
        className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3"
      >
        <h2 className="font-bold text-rose-800">
          We couldn&apos;t load your cart
        </h2>
        <p className="text-sm text-rose-700">
          Check your connection and try again. Your items are still saved.
        </p>
        <button
          type="button"
          onClick={retry}
          className="bg-[#871a45] text-white font-bold text-sm px-6 py-3 rounded-xl min-h-[44px]"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Ready: list the items ──
  const hasProblem = lines.some(
    (l) => !l.info || l.info.stock < l.item.quantity,
  );

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
      <ul className="space-y-4">
        {lines.map(({ item, info, lineTotal }) => {
          // The product was removed or hidden after it was added to the cart.
          if (!info) {
            return (
              <li
                key={item.variantId}
                className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3"
              >
                <span className="text-sm text-rose-800 font-semibold">
                  An item in your cart is no longer available.
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm font-bold text-rose-800 underline min-h-[44px] px-2"
                >
                  Remove
                </button>
              </li>
            );
          }
          const short = info.stock < item.quantity;
          return (
            <li
              key={item.variantId}
              className="rounded-2xl border border-stone-200 bg-white p-4 flex gap-4"
            >
              <Link
                href={`/${info.categorySlug}/${info.productSlug}`}
                className="shrink-0"
              >
                <Image
                  src={info.image}
                  alt={info.productName}
                  width={96}
                  height={96}
                  sizes="96px"
                  className="w-24 h-24 rounded-xl object-cover bg-stone-100"
                />
              </Link>
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <Link
                    href={`/${info.categorySlug}/${info.productSlug}`}
                    className="font-semibold text-[#002c3f] hover:text-[#871a45] leading-snug block py-[11px] -my-[11px]"
                  >
                    {info.productName}
                  </Link>
                  <p className="text-xs text-stone-600">
                    {info.variantName} · {rupees(info.unitPrice)} each
                  </p>
                </div>
                {short && (
                  <p role="alert" className="text-xs font-semibold text-rose-700">
                    {info.stock === 0
                      ? "Out of stock. Please remove this item."
                      : `Only ${info.stock} left. Please reduce the quantity.`}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.variantId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${info.productName}`}
                      className="w-11 h-11 text-xl font-bold text-[#002c3f] hover:bg-stone-50 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span
                      className="w-10 text-center font-bold text-[#002c3f]"
                      aria-live="polite"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.variantId, item.quantity + 1)
                      }
                      disabled={item.quantity >= MAX_CART_QUANTITY}
                      aria-label={`Increase quantity of ${info.productName}`}
                      className="w-11 h-11 text-xl font-bold text-[#002c3f] hover:bg-stone-50 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-[#871a45]">
                    {rupees(lineTotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="text-xs font-semibold text-stone-600 hover:text-rose-700 underline min-h-[44px] pr-2"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Order summary */}
      <aside className="rounded-2xl border border-stone-200 bg-[#FAF6EF] p-5 space-y-4 lg:sticky lg:top-28">
        <h2 className="font-bold text-[#002c3f]">Order summary</h2>
        <div className="flex items-center justify-between text-sm text-stone-700">
          <span>Items total</span>
          <span className="text-xl font-bold text-[#871a45]">
            {rupees(subtotal)}
          </span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          The final amount is confirmed at checkout using our current prices.
        </p>
        {hasProblem ? (
          <p role="alert" className="text-xs font-semibold text-rose-700">
            Fix the items marked above to continue.
          </p>
        ) : (
          <Link
            href="/checkout"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#871a45] hover:bg-[#691436] text-white py-3.5 px-6 rounded-xl font-bold text-sm min-h-[52px] shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </aside>
    </div>
  );
}
