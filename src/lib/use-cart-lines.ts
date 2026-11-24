"use client";

/**
 * Loads display details (name, image, current price, stock) for the items in
 * the cart. The cart itself only has ids and quantities, so this asks the
 * server (/api/cart). Used by the cart page and the checkout page.
 *
 * Prices here are for DISPLAY only. /api/checkout works out the real total
 * on the server again (Rule F1).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import type { PricedLine } from "@/lib/orders";

/** Server details for one cart item (price, name, ...) without the quantity. */
export type LineInfo = Omit<PricedLine, "quantity" | "lineTotal">;

export interface CartLine {
  item: CartItem;
  /** undefined if the server says this item no longer exists */
  info: LineInfo | undefined;
  lineTotal: number;
}

type Loaded = { key: string; infoByVariant: Record<string, LineInfo> } | { key: string; failed: true };

export function useCartLines() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Only re-fetch when the SET of items changes, not when a quantity changes.
  const key = items.map((i) => `${i.productId}:${i.variantId}`).join(",");

  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    const controller = new AbortController();
    const body = items.map((i) => ({ ...i, quantity: 1 }));

    fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: body }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ lines: PricedLine[] }>;
      })
      .then((data) => {
        const infoByVariant: Record<string, LineInfo> = {};
        for (const l of data.lines) infoByVariant[l.variantId] = l;
        setLoaded({ key, infoByVariant });
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setLoaded({ key, failed: true });
      });

    return () => controller.abort();
    // `items` is read inside, but `key` already changes whenever its set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, key, attempt]);

  const retry = useCallback(() => {
    setLoaded(null);
    setAttempt((n) => n + 1);
  }, []);

  const status: "loading" | "empty" | "error" | "ready" = !hydrated
    ? "loading"
    : items.length === 0
      ? "empty"
      : loaded?.key !== key
        ? "loading"
        : "failed" in loaded
          ? "error"
          : "ready";

  const infoByVariant =
    loaded && !("failed" in loaded) && loaded.key === key ? loaded.infoByVariant : {};

  const lines: CartLine[] = useMemo(
    () =>
      items.map((item) => {
        const info = infoByVariant[item.variantId];
        return { item, info, lineTotal: info ? info.unitPrice * item.quantity : 0 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, loaded],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return { status, lines, subtotal, retry };
}
