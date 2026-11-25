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

/** Current date (YYYY-MM-DD) and minutes since midnight, in India. */
function nowInIndia(): { date: string; minutes: number } {
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [h, m] = new Date()
    .toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit" })
    .split(":")
    .map(Number);
  return { date, minutes: (h % 24) * 60 + m }; // some engines print midnight as 24:00
}

/** Start of a slot like "4:00 PM - 6:00 PM" as minutes since midnight (960). */
function slotStartMinutes(slot: string): number {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)/.exec(slot);
  if (!match) return 0;
  let hour = Number(match[1]) % 12;
  if (match[3] === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

/**
 * True if the slot has already started on that date in India, so it can no
 * longer be booked. Only today can be "past": later dates are always fine.
 */
export function isSlotPast(slot: string, pickupDate: string): boolean {
  const now = nowInIndia();
  return pickupDate === now.date && slotStartMinutes(slot) <= now.minutes;
}

/** Add days to a YYYY-MM-DD date (calendar arithmetic, no time zones involved). */
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * The earliest pickup the customer can book: today, in the first slot that has
 * not started yet; or tomorrow's first slot if today's are all over. The checkout
 * form starts with this selected so a customer has fewer things to tap (Rule B2).
 * They can change both.
 */
export function defaultPickup(): { date: string; slot: string } {
  const today = nowInIndia().date;
  const slot = PICKUP_SLOTS.find((s) => !isSlotPast(s, today));
  if (slot) return { date: today, slot };
  return { date: addDays(today, 1), slot: PICKUP_SLOTS[0] };
}
