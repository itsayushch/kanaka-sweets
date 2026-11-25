import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  FAILED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-stone-200 text-stone-700",
};

async function OrderList() {
  await requireAdminPage(); // Rule F3

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: { include: { product: { select: { name: true } }, variant: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#002c3f]">Orders</h1>

      {orders.length === 0 && (
        <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-600">No orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o.id} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-bold text-[#871a45]">{o.orderNumber}</div>
                <div className="text-xs text-stone-600">
                  {o.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[o.status] ?? ""}`}>{o.status}</span>
                <div className="text-lg font-bold text-[#002c3f] mt-1">{rupees(o.totalAmount)}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">{o.customerName}</div>
                <div><a href={`tel:${o.customerPhone}`} className="underline">{o.customerPhone}</a></div>
                <div className="break-all">{o.customerEmail}</div>
              </div>
              <div>
                {o.fulfillmentType === "DELIVERY" ? (
                  <>
                    <div className="font-semibold">Home delivery</div>
                    <div>{o.deliveryAddress}</div>
                    <div>{o.deliveryCity} {o.deliveryPostalCode}</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold">Shop pickup</div>
                    <div>
                      {o.pickupDate?.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium" })}, {o.pickupTimeSlot}
                    </div>
                  </>
                )}
              </div>
            </div>

            <ul className="text-sm divide-y divide-stone-100 border-t border-stone-100">
              {o.items.map((i) => (
                <li key={i.id} className="py-1.5 flex justify-between gap-3">
                  <span>{i.product.name} ({i.variant.name}) × {i.quantity}</span>
                  <span>{rupees(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>

            {o.razorpayPaymentId && <div className="text-xs text-stone-600 break-all">Payment id: {o.razorpayPaymentId}</div>}
            {o.notes && <div className="rounded-lg bg-rose-50 border border-rose-200 p-2 text-sm font-semibold text-rose-800">{o.notes}</div>}
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <OrderList />
    </Suspense>
  );
}
