"use client";

/**
 * Checkout form (Rules A4, B6, F1, F6).
 *
 * - The form sends customer details + cart ids/quantities. It never sends a
 *   price or total (F1): the server works those out from the database.
 * - Validation happens on the server. The server replies with one message per
 *   field and we show each message next to its input (B6).
 * - Every value is kept in React state, so a failed submit never clears what
 *   the customer typed (B6).
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useCartLines } from "@/lib/use-cart-lines";
import { PICKUP_SLOTS, defaultPickup, isSlotPast } from "@/lib/shop-constants";
import { ArrowRightIcon, ShoppingBagIcon } from "@/components/icons";

type FieldName =
  | "customerName"
  | "customerPhone"
  | "customerEmail"
  | "fulfillmentType"
  | "deliveryAddress"
  | "deliveryPostalCode"
  | "pickupDate"
  | "pickupTimeSlot";

interface FormValues {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryAddress: string;
  deliveryPostalCode: string;
  pickupDate: string;
  pickupTimeSlot: string;
  notes: string;
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Today in India as YYYY-MM-DD: the earliest allowed pickup date. */
const todayInIndia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border px-4 min-h-[48px] text-base text-[#002c3f] bg-white focus:outline-none focus:ring-2 focus:ring-[#871a45]/30 ${
    hasError ? "border-rose-500" : "border-stone-300 focus:border-[#871a45]"
  }`;

/** A label + input slot + the error message shown right under the input. */
function Field(props: {
  id: FieldName;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const { id, label, error, hint, children } = props;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold text-[#002c3f]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-stone-600">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clear);
  const items = useCartStore((s) => s.items);
  const { status, lines, subtotal, retry } = useCartLines();

  const [values, setValues] = useState<FormValues>(() => ({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fulfillmentType: "PICKUP",
    deliveryAddress: "",
    deliveryPostalCode: "",
    // Start with the earliest available pickup already chosen (fewer taps, Rule B2).
    pickupDate: defaultPickup().date,
    pickupTimeSlot: defaultPickup().slot,
    notes: "",
  }));
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Remove that field's error as soon as the customer edits it.
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as FieldName];
      return next;
    });
  };

  // ── Page states (B8) ──
  if (status === "loading") {
    return <div role="status" aria-label="Loading checkout" className="h-64 rounded-2xl bg-stone-100 animate-pulse" />;
  }
  if (status === "empty") {
    return (
      <div className="bg-[#FAF6EF] rounded-3xl border border-stone-200 p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#871a45] mx-auto">
          <ShoppingBagIcon className="w-7 h-7" />
        </div>
        <h2 className="font-bold text-lg text-[#002c3f]">Your cart is empty</h2>
        <p className="text-sm text-stone-600">Add something sweet before checking out.</p>
        <Link href="/sweets" className="inline-flex items-center gap-2 bg-[#871a45] text-white px-6 py-3 rounded-xl font-bold text-sm min-h-[44px]">
          Browse Sweets <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div role="alert" className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
        <h2 className="font-bold text-rose-800">We couldn&apos;t load your order details</h2>
        <button type="button" onClick={retry} className="bg-[#871a45] text-white font-bold text-sm px-6 py-3 rounded-xl min-h-[44px]">
          Try again
        </button>
      </div>
    );
  }

  const cartHasProblem = lines.some((l) => !l.info || l.info.stock < l.item.quantity);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    // Send details + ids/quantities only. No price, no total (Rule F1).
    const payload = {
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail,
      fulfillmentType: values.fulfillmentType,
      ...(values.fulfillmentType === "DELIVERY"
        ? {
            deliveryAddress: values.deliveryAddress,
            deliveryPostalCode: values.deliveryPostalCode,
          }
        : {
            pickupDate: values.pickupDate || undefined,
            pickupTimeSlot: values.pickupTimeSlot || undefined,
          }),
      notes: values.notes || undefined,
      items,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        // Order created and stock reserved. The cart is cleared now (the order
        // holds the items). ?pay=1 makes the order page open the payment window.
        clearCart();
        router.push(`/order/${data.orderNumber}?pay=1`);
        return;
      }

      if (res.status === 422 && data.fieldErrors) {
        // Show each message next to its field.
        const next: Partial<Record<FieldName, string>> = {};
        for (const [field, messages] of Object.entries(data.fieldErrors as Record<string, string[]>)) {
          next[field as FieldName] = messages[0];
        }
        setErrors(next);
        if (data.fieldErrors.items) setFormError("There is a problem with your cart. Please review it.");
      } else {
        setFormError(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
      <div className="space-y-6">
        {formError && (
          <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-800 flex items-center justify-between gap-3 flex-wrap">
            <span>{formError}</span>
            <Link href="/cart" className="underline">Review cart</Link>
          </div>
        )}

        {/* ── Your details ── */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
          <h2 className="font-bold text-[#002c3f]">Your details</h2>
          <Field id="customerName" label="Full name" error={errors.customerName}>
            <input
              id="customerName"
              autoComplete="name"
              value={values.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              aria-invalid={!!errors.customerName}
              aria-describedby={errors.customerName ? "customerName-error" : undefined}
              className={inputClass(!!errors.customerName)}
            />
          </Field>
          <Field id="customerPhone" label="Mobile number" error={errors.customerPhone} hint="10-digit Indian mobile number">
            <input
              id="customerPhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              value={values.customerPhone}
              onChange={(e) => set("customerPhone", e.target.value.replace(/\D/g, ""))}
              aria-invalid={!!errors.customerPhone}
              aria-describedby={errors.customerPhone ? "customerPhone-error" : undefined}
              className={inputClass(!!errors.customerPhone)}
            />
          </Field>
          <Field id="customerEmail" label="Email" error={errors.customerEmail}>
            <input
              id="customerEmail"
              type="email"
              autoComplete="email"
              value={values.customerEmail}
              onChange={(e) => set("customerEmail", e.target.value)}
              aria-invalid={!!errors.customerEmail}
              aria-describedby={errors.customerEmail ? "customerEmail-error" : undefined}
              className={inputClass(!!errors.customerEmail)}
            />
          </Field>
        </section>

        {/* ── Delivery or pickup ── */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
          <h2 className="font-bold text-[#002c3f]">How would you like to receive it?</h2>
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Delivery or pickup">
            {(
              [
                ["PICKUP", "Shop pickup", "Collect from our Governorpet shop"],
                ["DELIVERY", "Home delivery", "Delivered in Vijayawada"],
              ] as const
            ).map(([value, title, sub]) => (
              <label
                key={value}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer min-h-[64px] ${
                  values.fulfillmentType === value
                    ? "border-[#871a45] bg-[#FAF6EF] ring-2 ring-[#871a45]/20"
                    : "border-stone-200"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillmentType"
                  value={value}
                  checked={values.fulfillmentType === value}
                  onChange={() => set("fulfillmentType", value)}
                  className="mt-1 w-5 h-5 accent-[#871a45]"
                />
                <span>
                  <span className="block font-semibold text-[#002c3f]">{title}</span>
                  <span className="block text-xs text-stone-600">{sub}</span>
                </span>
              </label>
            ))}
          </div>

          {values.fulfillmentType === "DELIVERY" ? (
            <>
              <Field id="deliveryAddress" label="Delivery address" error={errors.deliveryAddress} hint="House no., street, area">
                <textarea
                  id="deliveryAddress"
                  rows={3}
                  autoComplete="street-address"
                  value={values.deliveryAddress}
                  onChange={(e) => set("deliveryAddress", e.target.value)}
                  aria-invalid={!!errors.deliveryAddress}
                  aria-describedby={errors.deliveryAddress ? "deliveryAddress-error" : undefined}
                  className={inputClass(!!errors.deliveryAddress) + " py-3"}
                />
              </Field>
              <Field id="deliveryPostalCode" label="PIN code" error={errors.deliveryPostalCode}>
                <input
                  id="deliveryPostalCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={values.deliveryPostalCode}
                  onChange={(e) => set("deliveryPostalCode", e.target.value.replace(/\D/g, ""))}
                  aria-invalid={!!errors.deliveryPostalCode}
                  aria-describedby={errors.deliveryPostalCode ? "deliveryPostalCode-error" : undefined}
                  className={inputClass(!!errors.deliveryPostalCode)}
                />
              </Field>
            </>
          ) : (
            <>
              <Field id="pickupDate" label="Pickup date" error={errors.pickupDate}>
                <input
                  id="pickupDate"
                  type="date"
                  min={todayInIndia()}
                  value={values.pickupDate}
                  onChange={(e) => set("pickupDate", e.target.value)}
                  aria-invalid={!!errors.pickupDate}
                  aria-describedby={errors.pickupDate ? "pickupDate-error" : undefined}
                  className={inputClass(!!errors.pickupDate)}
                />
              </Field>
              <Field id="pickupTimeSlot" label="Pickup time slot" error={errors.pickupTimeSlot}>
                <select
                  id="pickupTimeSlot"
                  value={values.pickupTimeSlot}
                  onChange={(e) => set("pickupTimeSlot", e.target.value)}
                  aria-invalid={!!errors.pickupTimeSlot}
                  aria-describedby={errors.pickupTimeSlot ? "pickupTimeSlot-error" : undefined}
                  className={inputClass(!!errors.pickupTimeSlot)}
                >
                  <option value="">Choose a time slot</option>
                  {PICKUP_SLOTS.map((slot) => {
                    // Slots that already started today can't be booked.
                    const past = !!values.pickupDate && isSlotPast(slot, values.pickupDate);
                    return (
                      <option key={slot} value={slot} disabled={past}>
                        {slot}{past ? " (not available today)" : ""}
                      </option>
                    );
                  })}
                </select>
              </Field>
            </>
          )}
        </section>
      </div>

      {/* ── Order summary ── */}
      <aside className="rounded-2xl border border-stone-200 bg-[#FAF6EF] p-5 space-y-4 lg:sticky lg:top-28">
        <h2 className="font-bold text-[#002c3f]">Order summary</h2>
        <ul className="space-y-2 text-sm text-stone-700">
          {lines.map(({ item, info, lineTotal }) => (
            <li key={item.variantId} className="flex justify-between gap-3">
              <span>
                {info ? `${info.productName} (${info.variantName})` : "Unavailable item"} × {item.quantity}
              </span>
              <span className="font-semibold shrink-0">{info ? rupees(lineTotal) : "-"}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-stone-200 pt-3">
          <span className="font-semibold text-[#002c3f]">Total</span>
          <span className="text-xl font-bold text-[#871a45]">{rupees(subtotal)}</span>
        </div>
        <p className="text-xs text-stone-600">
          The final amount is calculated again on our server from current prices.
        </p>
        {cartHasProblem && (
          <p role="alert" className="text-xs font-semibold text-rose-700">
            Some items are unavailable. <Link href="/cart" className="underline">Fix your cart</Link>
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || cartHasProblem}
          className="w-full bg-[#871a45] hover:bg-[#691436] disabled:opacity-60 text-white py-3.5 px-6 rounded-xl font-bold text-sm min-h-[52px] shadow-sm"
        >
          {submitting ? "Placing your order..." : "Place Order"}
        </button>
      </aside>
    </form>
  );
}
