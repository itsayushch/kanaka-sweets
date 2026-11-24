/**
 * Shop-wide constants shared by the server (validation) and the browser
 * (forms). Kept in a tiny file with no imports so the browser bundle does not
 * pull in Zod just to read a list.
 */

/** Max quantity of one item per order (Rule F6: quantity 1-20). */
export const MAX_QUANTITY = 20;

/** Pickup time slots offered at the shop (extra sales idea, Rule C5). */
export const PICKUP_SLOTS = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
] as const;
