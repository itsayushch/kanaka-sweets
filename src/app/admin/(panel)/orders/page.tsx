import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { OrdersListClient, type AdminOrderRow } from "@/components/admin/OrdersListClient";
import { OrdersSkeleton } from "@/components/admin/AdminSkeletons";

async function OrderList() {
  await requireAdminPage(); // Rule F3

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: { include: { product: { select: { name: true } }, variant: { select: { name: true } } } },
    },
  });

  const rows: AdminOrderRow[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAtIso: o.createdAt.toISOString(),
    createdAtLabel: o.createdAt.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: o.status,
    totalAmount: o.totalAmount,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    fulfillmentType: o.fulfillmentType,
    deliveryAddress: o.deliveryAddress,
    deliveryCity: o.deliveryCity,
    deliveryPostalCode: o.deliveryPostalCode,
    pickupDateLabel: o.pickupDate
      ? o.pickupDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium" })
      : null,
    pickupTimeSlot: o.pickupTimeSlot,
    razorpayPaymentId: o.razorpayPaymentId,
    notes: o.notes,
    items: o.items.map((i) => ({
      id: i.id,
      productName: i.product.name,
      variantName: i.variant.name,
      quantity: i.quantity,
      price: i.price,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#002c3f]"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Orders
        </h1>
        <p className="text-sm text-stone-600 mt-0.5">
          Filter by payment status or search by order number, customer name, or phone.
        </p>
      </div>

      <OrdersListClient orders={rows} />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrderList />
    </Suspense>
  );
}
