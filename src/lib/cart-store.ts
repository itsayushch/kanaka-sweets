/**
 * The shopping cart, kept in the browser (Zustand + localStorage).
 *
 * Rule F1: a cart line holds ONLY ids and a quantity. There is no price here,
 * so there is nothing for a customer to tamper with. Real prices are loaded
 * from the server (/api/cart) and checkout recalculates the total itself.
 *
 * persist() saves the cart to localStorage, so items stay after a refresh.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_QUANTITY } from "@/lib/shop-constants";

/** Most of one item a customer may order (same limit the server enforces). */
export const MAX_CART_QUANTITY = MAX_QUANTITY;

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Add to the cart, or increase the quantity if the variant is already there. */
  addItem: (item: CartItem) => void;
  /** Set an exact quantity (clamped to 1-20). */
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
}

const clamp = (q: number) => Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(q)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: clamp(i.quantity + item.quantity) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clamp(item.quantity) }] };
        }),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: clamp(quantity) } : i,
          ),
        })),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "kanaka-cart", version: 1 },
  ),
);

/** Total number of units in the cart (what the header badge shows). */
export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);
