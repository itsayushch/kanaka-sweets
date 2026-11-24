/**
 * Zod schemas for checkout input (Rule F6).
 *
 * These run on the SERVER in /api/cart and /api/checkout. The browser form
 * also shows errors, but the server never trusts the browser.
 *
 * Note (Rule F1): there is deliberately NO price / amount / total field here.
 * Zod strips unknown keys, so even if a request sends `price` or `total`,
 * it is thrown away before any code can use it.
 */
import { z } from "zod";

/** Max quantity of one item per order (Rule F6: quantity 1-20). */
export const MAX_QUANTITY = 20;

/** Pickup time slots offered at the shop (extra sales idea, Rule C5). */
export const PICKUP_SLOTS = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
] as const;

/** One cart line: only IDs and a quantity, never a price. */
export const cartItemSchema = z.object({
  productId: z.string().min(1).max(64),
  variantId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export const cartItemsSchema = z.array(cartItemSchema).min(1).max(30);

export type CartItemInput = z.infer<typeof cartItemSchema>;

/** Today's date in India as YYYY-MM-DD (used to reject past pickup dates). */
export function todayInIndia(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Date `days` from now in India as YYYY-MM-DD. */
function daysFromTodayInIndia(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export const checkoutSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(80, "Name is too long"),
    // Indian mobile number: exactly 10 digits, starting with 6, 7, 8 or 9.
    customerPhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    customerEmail: z
      .string()
      .trim()
      .max(120, "Email is too long")
      .pipe(z.email("Enter a valid email address")),
    fulfillmentType: z.enum(["DELIVERY", "PICKUP"], {
      error: "Choose home delivery or shop pickup",
    }),
    deliveryAddress: z.string().trim().max(300).optional(),
    deliveryPostalCode: z.string().trim().optional(),
    pickupDate: z.string().trim().optional(), // YYYY-MM-DD
    pickupTimeSlot: z.enum(PICKUP_SLOTS).optional(),
    notes: z.string().trim().max(300).optional(),
    items: cartItemsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "DELIVERY") {
      // Home delivery needs an address.
      if (!data.deliveryAddress || data.deliveryAddress.length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryAddress"],
          message: "Enter your full delivery address (house, street, area)",
        });
      }
      if (
        !data.deliveryPostalCode ||
        !/^\d{6}$/.test(data.deliveryPostalCode)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryPostalCode"],
          message: "Enter a 6-digit PIN code",
        });
      }
    } else {
      // Shop pickup needs a date that is today or later (not in the past).
      const today = todayInIndia();
      if (!data.pickupDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.pickupDate)) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupDate"],
          message: "Choose a pickup date",
        });
      } else if (data.pickupDate < today) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupDate"],
          message: "Pickup date cannot be in the past",
        });
      } else if (data.pickupDate > daysFromTodayInIndia(60)) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupDate"],
          message: "Pickup date must be within the next 60 days",
        });
      }
      if (!data.pickupTimeSlot) {
        ctx.addIssue({
          code: "custom",
          path: ["pickupTimeSlot"],
          message: "Choose a pickup time slot",
        });
      }
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
