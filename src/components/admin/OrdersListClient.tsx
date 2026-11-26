"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  createdAtIso: string;
  createdAtLabel: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: string;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  pickupDateLabel: string | null;
  pickupTimeSlot: string | null;
  razorpayPaymentId: string | null;
  notes: string | null;
  items: {
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
  }[];
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  FAILED: "bg-rose-100 text-rose-800 border-rose-200",
  CANCELLED: "bg-stone-200 text-stone-700 border-stone-300",
};

const STATUS_FILTERS = ["ALL", "PAID", "PENDING", "FAILED", "CANCELLED"] as const;

export function OrdersListClient({ orders }: { orders: AdminOrderRow[] }) {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("ALL");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: orders.length, PAID: 0, PENDING: 0, FAILED: 0, CANCELLED: 0 };
    for (const o of orders) {
      map[o.status] = (map[o.status] ?? 0) + 1;
    }
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
      if (
        q &&
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.customerPhone.includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, statusFilter, query]);

  return (
    <div className="space-y-5">
      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #, customer name or phone..."
            aria-label="Search orders"
            className="w-full pl-10 pr-4 min-h-[44px] rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-[#871a45] focus:outline-none text-base text-[#002c3f]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 min-h-[44px] rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#871a45] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {st === "ALL" ? "All" : st} ({counts[st] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-600">
          {orders.length === 0 ? "No orders yet." : "No orders match your filter."}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-stone-200/90 bg-white p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-[#871a45]">{o.orderNumber}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {o.fulfillmentType === "DELIVERY" ? "Delivery" : "Shop Pickup"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{o.createdAtLabel}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${
                      STATUS_STYLE[o.status] ?? "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {o.status}
                  </span>
                  <div className="text-lg font-bold text-[#002c3f] mt-1">
                    {rupees(o.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm bg-stone-50/70 rounded-xl p-3.5 border border-stone-100">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Customer
                  </div>
                  <div className="font-semibold text-[#002c3f]">{o.customerName}</div>
                  <div>
                    <a href={`tel:${o.customerPhone}`} className="text-[#871a45] font-medium underline">
                      {o.customerPhone}
                    </a>
                  </div>
                  <div className="text-stone-600 break-all">{o.customerEmail}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {o.fulfillmentType === "DELIVERY" ? "Home Delivery" : "Shop Pickup"}
                  </div>
                  {o.fulfillmentType === "DELIVERY" ? (
                    <>
                      <div className="text-[#002c3f]">{o.deliveryAddress}</div>
                      <div className="text-stone-600">
                        {o.deliveryCity} {o.deliveryPostalCode}
                      </div>
                    </>
                  ) : (
                    <div className="text-[#002c3f] font-medium">
                      {o.pickupDateLabel} · {o.pickupTimeSlot}
                    </div>
                  )}
                </div>
              </div>

              <ul className="text-sm divide-y divide-stone-100">
                {o.items.map((i) => (
                  <li key={i.id} className="py-2 flex justify-between gap-3">
                    <span className="text-[#002c3f]">
                      <span className="font-semibold">{i.productName}</span>{" "}
                      <span className="text-stone-500">({i.variantName})</span> × {i.quantity}
                    </span>
                    <span className="font-semibold text-[#002c3f]">
                      {rupees(i.price * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {o.razorpayPaymentId && (
                <div className="text-xs text-stone-500 break-all pt-1 border-t border-stone-100">
                  Razorpay Payment ID: <span className="font-mono">{o.razorpayPaymentId}</span>
                </div>
              )}
              {o.notes && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-sm font-semibold text-rose-800">
                  {o.notes}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
