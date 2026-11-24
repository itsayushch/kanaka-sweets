"use client";

import { useState } from "react";
import Link from "next/link";
import type { FormattedProduct } from "@/lib/db-products";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingBagIcon,
  WhatsAppIcon,
  CheckIcon,
  ShieldCheckIcon,
  PackageIcon,
  LightningIcon,
  LeafIcon,
} from "@/components/icons";

interface ProductOptionsProps {
  product: FormattedProduct;
}

export function ProductOptions({ product }: ProductOptionsProps) {
  const initialVariant =
    product.variants.find((v) => v.stock > 0) || product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialVariant ? initialVariant.id : ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || initialVariant;

  const isCurrentOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isCurrentOutOfStock) return;

    // Only ids and a quantity go into the cart. The price is never stored (F1).
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    });

    // Clear feedback (Rule B4): message here + the header badge count updates.
    setAddedMessage(`Added ${quantity} × ${selectedVariant.name} to cart!`);
    setTimeout(() => setAddedMessage(null), 4000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Kanaka Sweets! I'd like to order: ${product.name} (${selectedVariant?.name || ""}) — Qty: ${quantity}. Please confirm availability.`
  );

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-jost)" }}>
      {/* Price display */}
      <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-stone-200">
        <div className="text-xs uppercase tracking-wider text-[#871a45] font-bold mb-1">
          Price for {selectedVariant?.name || "selected size"}
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-bold text-[#871a45]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            ₹{selectedVariant?.price ?? 0}
          </span>
          <span className="text-xs text-stone-400">incl. all taxes</span>
        </div>
        {selectedVariant?.weight && (
          <div className="text-xs text-stone-500 mt-1">
            Net weight:{" "}
            <strong className="text-stone-700">{selectedVariant.weight}</strong>
          </div>
        )}
      </div>

      {/* Variant selection */}
      <div>
        <label className="block text-sm font-bold text-[#002c3f] mb-2.5">
          Select Weight / Size:
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
                className={`relative p-3 rounded-xl border text-left transition-all min-h-[64px] flex flex-col justify-between ${
                  isSelected
                    ? "border-[#871a45] bg-[#FAF6EF] ring-2 ring-[#871a45]/20 shadow-sm"
                    : "border-stone-200 bg-white hover:border-[#871a45]/40"
                } ${isOut ? "opacity-60" : ""}`}
                aria-label={`${v.name} ₹${v.price}${isOut ? " — out of stock" : ""}`}
              >
                <div>
                  <div className="font-semibold text-sm text-[#002c3f]">
                    {v.name}
                  </div>
                  <div className="text-xs font-bold text-[#871a45] mt-0.5">
                    ₹{v.price}
                  </div>
                </div>
                {isOut ? (
                  <span className="text-[10px] font-semibold text-rose-600 mt-1">
                    Out of stock
                  </span>
                ) : (
                  <span className="text-[10px] text-[#2D5E3F] font-semibold mt-1">
                    In Stock
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-bold text-[#002c3f] mb-2.5">
          Quantity:
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isCurrentOutOfStock}
              className="w-11 h-11 flex items-center justify-center text-xl font-bold text-[#002c3f] hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-base font-bold text-[#002c3f]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              disabled={quantity >= 20 || isCurrentOutOfStock}
              className="w-11 h-11 flex items-center justify-center text-xl font-bold text-[#002c3f] hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm text-stone-500">
            Total:{" "}
            <strong className="text-[#871a45] text-base">
              ₹{(selectedVariant?.price ?? 0) * quantity}
            </strong>
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCurrentOutOfStock}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 min-h-[52px] transition-all ${
            isCurrentOutOfStock
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : "bg-[#871a45] hover:bg-[#691436] text-white active:scale-[0.99] shadow-sm"
          }`}
        >
          <ShoppingBagIcon className="w-4 h-4 text-white" />
          <span>
            {isCurrentOutOfStock
              ? "Selected size is out of stock"
              : `Add to Cart · ₹${(selectedVariant?.price ?? 0) * quantity}`}
          </span>
        </button>

        <a
          href={`https://wa.me/919848022338?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white min-h-[48px] transition-colors shadow-sm"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>Order via WhatsApp</span>
        </a>
      </div>

      {/* Add to Cart feedback (Rule B4) */}
      {addedMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-semibold flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-600" />
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

      {/* Trust highlights with vector icons */}
      <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-[#871a45]" />
          <span>Pure Desi Cow Ghee</span>
        </div>
        <div className="flex items-center gap-2">
          <PackageIcon className="w-4 h-4 text-[#871a45]" />
          <span>Vacuum-sealed packing</span>
        </div>
        <div className="flex items-center gap-2">
          <LightningIcon className="w-4 h-4 text-[#871a45]" />
          <span>Same-day shop pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <LeafIcon className="w-4 h-4 text-[#871a45]" />
          <span>Zero preservatives</span>
        </div>
      </div>
    </div>
  );
}
