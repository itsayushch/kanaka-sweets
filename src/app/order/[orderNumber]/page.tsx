import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RESERVATION_MINUTES } from "@/lib/orders";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Your Order | Kanaka Sweets & Bakery",
  description: "Order status for your Kanaka Sweets & Bakery order.",
  robots: { index: false },
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Order status page. It is read live from the database (never cached) and
 * deliberately shows NO name, phone, email or address: the order number is
 * the only thing needed to open it.
 */
async function OrderDetails({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      totalAmount: true,
      fulfillmentType: true,
      pickupDate: true,
      pickupTimeSlot: true,
      items: {
        select: {
          quantity: true,
          price: true,
          product: { select: { name: true } },
          variant: { select: { name: true } },
        },
      },
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#FAF6EF] border border-stone-200 p-6 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckIcon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#002c3f]">Order received</h2>
        <p className="text-sm text-stone-600">
          Order number <strong className="text-[#871a45]">{order.orderNumber}</strong>
        </p>
        <p className="text-sm text-stone-600">
          Status:{" "}
          <strong>
            {order.status === "PENDING" ? "Awaiting payment" : order.status}
          </strong>
        </p>
        {order.status === "PENDING" && (
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Your items are reserved for {RESERVATION_MINUTES} minutes. Online
            payment is the next step and is being connected.
          </p>
        )}
      </div>

      <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100">
        {order.items.map((item, i) => (
          <li key={i} className="p-4 flex justify-between gap-3 text-sm">
            <span>
              {item.product.name} ({item.variant.name}) × {item.quantity}
            </span>
            <span className="font-semibold">
              {rupees(item.price * item.quantity)}
            </span>
          </li>
        ))}
        <li className="p-4 flex justify-between font-bold text-[#002c3f]">
          <span>Total</span>
          <span className="text-[#871a45]">{rupees(order.totalAmount)}</span>
        </li>
      </ul>

      {order.fulfillmentType === "PICKUP" && order.pickupDate && (
        <p className="text-sm text-stone-700 text-center">
          Shop pickup on{" "}
          <strong>
            {order.pickupDate.toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          , {order.pickupTimeSlot}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="tel:+919848022338"
          className="inline-flex items-center gap-2 border border-[#871a45] text-[#871a45] font-bold text-sm px-5 py-3 rounded-xl min-h-[44px]"
        >
          <PhoneIcon className="w-4 h-4" /> Call the shop
        </a>
        <a
          href={`https://wa.me/919848022338?text=${encodeURIComponent(`Hello Kanaka Sweets! About my order ${order.orderNumber}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-3 rounded-xl min-h-[44px]"
        >
          <WhatsAppIcon className="w-4 h-4" /> WhatsApp us
        </a>
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-stone-600 underline min-h-[44px] px-2">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  return (
    <div
      className="py-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f] mb-8 text-center"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Your Order
      </h1>
      {/* Live data: wrapped in Suspense so the rest of the page can be prerendered. */}
      <Suspense fallback={<div role="status" aria-label="Loading order" className="h-48 rounded-2xl bg-stone-100 animate-pulse" />}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}
