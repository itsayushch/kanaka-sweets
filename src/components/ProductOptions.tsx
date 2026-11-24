"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormattedProduct } from "@/lib/db-products";

interface ProductOptionsProps {
  product: FormattedProduct;
}

export function ProductOptions({ product }: ProductOptionsProps) {
  // Default to first variant in stock, or the first variant
  const initialVariant =
    product.variants.find((v) => v.stock > 0) || product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialVariant ? initialVariant.id : ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || initialVariant;

  const isCurrentOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isCurrentOutOfStock) return;

    // Update cart count badge in navbar if present
    const badge = document.getElementById("cart-badge-count");
    if (badge) {
      const current = parseInt(badge.textContent || "0", 10) || 0;
      badge.textContent = String(current + quantity);
    }

    // Trigger clear visual feedback (Rule B4)
    setAddedMessage(`Added ${quantity} × ${selectedVariant.name} to cart!`);
    setTimeout(() => {
      setAddedMessage(null);
    }, 4000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Kanaka Sweets! I'd like to order: ${product.name} (${selectedVariant?.name || ""}) - Quantity: ${quantity}. Price: ₹${(selectedVariant?.price ?? 0) * quantity}. Please let me know pickup/delivery availability.`
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Price Display (Rule A3) */}
      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-900/10">
        <div className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
          Price for {selectedVariant?.name || "selected size"}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#4c0e17]">
            ₹{selectedVariant?.price ?? 0}
          </span>
          <span className="text-xs text-stone-500 font-normal">
            (Inclusive of all taxes)
          </span>
        </div>
        {selectedVariant?.weight && (
          <div className="text-xs text-stone-600 mt-1">
            Package net weight: <strong className="text-stone-800">{selectedVariant.weight}</strong>
          </div>
        )}
      </div>

      {/* Variant Selection Options (Rule A3) */}
      <div>
        <label className="block text-sm font-bold text-stone-900 mb-2">
          Select Weight / Size Option:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            const isOut = v.stock <= 0;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedVariantId(v.id);
                  setAddedMessage(null);
                }}
                className={`relative p-3 rounded-xl border text-left transition-all min-h-[44px] flex flex-col justify-between ${
                  isSelected
                    ? "border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 shadow-sm"
                    : "border-stone-200 bg-white hover:border-amber-300"
                } ${isOut ? "opacity-75 bg-stone-50" : ""}`}
                aria-label={`${v.name} for ₹${v.price}${isOut ? " (Out of stock)" : ""}`}
              >
                <div>
                  <div className="font-semibold text-sm text-stone-900">
                    {v.name}
                  </div>
                  <div className="text-xs font-bold text-[#4c0e17] mt-0.5">
                    ₹{v.price}
                  </div>
                </div>
                {isOut ? (
                  <span className="text-[10px] font-semibold text-rose-600 mt-1 inline-block">
                    Out of stock
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-medium mt-1 inline-block">
                    In Stock
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-bold text-stone-900 mb-2">
          Quantity:
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isCurrentOutOfStock}
              className="w-11 h-11 flex items-center justify-center text-lg font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center text-base font-bold text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              disabled={quantity >= 20 || isCurrentOutOfStock}
              className="w-11 h-11 flex items-center justify-center text-lg font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-xs text-stone-500">
            Total: <strong>₹{(selectedVariant?.price ?? 0) * quantity}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCurrentOutOfStock}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm min-h-[48px] transition-all ${
            isCurrentOutOfStock
              ? "bg-stone-200 text-stone-400 cursor-not-allowed"
              : "bg-amber-500 text-stone-950 hover:bg-amber-400 active:scale-[0.99] shadow-amber-500/20"
          }`}
        >
          <span>🛍️</span>
          <span>
            {isCurrentOutOfStock
              ? "Selected Size is Out of Stock"
              : `Add to Cart • ₹${(selectedVariant?.price ?? 0) * quantity}`}
          </span>
        </button>

        {/* WhatsApp Direct Order Button (Rule B3 & B2) */}
        <a
          href={`https://wa.me/919848022338?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors min-h-[44px] shadow-sm"
        >
          <span>💬</span>
          <span>Order Directly via WhatsApp</span>
        </a>
      </div>

      {/* Visual Feedback on Add to Cart (Rule B4) */}
      {addedMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-semibold flex items-center justify-between animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{addedMessage}</span>
          </div>
          <Link
            href="/cart"
            className="text-xs bg-emerald-700 text-white px-2.5 py-1 rounded font-bold hover:bg-emerald-800 transition-colors"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Trust Highlights */}
      <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span>✨</span>
          <span>Handmade daily in Vijayawada</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🧈</span>
          <span>Pure Desi Cow Ghee only</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📦</span>
          <span>Vacuum-sealed fresh packing</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span>Same-day shop pickup ready</span>
        </div>
      </div>
    </div>
  );
}
