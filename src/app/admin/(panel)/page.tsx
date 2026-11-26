import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { DashboardSkeleton } from "@/components/admin/AdminSkeletons";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  FAILED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-stone-200 text-stone-700",
};

async function Dashboard() {
  await requireAdminPage(); // Rule F3: check the login on the server

  const [productsCount, lowStockVariants, pendingCount, paidAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 }, product: { isActive: true } },
      orderBy: { stock: "asc" },
      take: 6,
      include: { product: { select: { id: true, name: true } } },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        fulfillmentType: true,
        createdAt: true,
      },
    }),
  ]);

  const paidRevenue = paidAgg._sum.totalAmount ?? 0;
  const paidCount = paidAgg._count._all;

  const kpis = [
    {
      label: "Paid Revenue",
      value: rupees(paidRevenue),
      sub: `${paidCount} paid order${paidCount === 1 ? "" : "s"}`,
      href: "/admin/orders",
      accent: "text-emerald-700",
    },
    {
      label: "Awaiting Payment",
      value: String(pendingCount),
      sub: "Pending checkout orders",
      href: "/admin/orders",
      accent: "text-amber-700",
    },
    {
      label: "Active Catalogue",
      value: String(productsCount),
      sub: "Total products listed",
      href: "/admin/products",
      accent: "text-[#002c3f]",
    },
    {
      label: "Low Stock Alerts",
      value: String(lowStockVariants.length),
      sub: "Sizes with 5 or less left",
      href: "/admin/products",
      accent: lowStockVariants.length > 0 ? "text-rose-700" : "text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Store Dashboard
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Live overview of orders, inventory, and storefront promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/settings"
            className="px-4 min-h-[44px] inline-flex items-center rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-sm font-bold text-[#002c3f] transition-colors"
          >
            Festival Highlight
          </Link>
          <Link
            href="/admin/products/new"
            className="px-5 min-h-[44px] inline-flex items-center rounded-xl bg-[#871a45] hover:bg-[#691436] text-white text-sm font-bold shadow-xs transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-stone-200/90 bg-white p-5 hover:border-[#871a45] hover:shadow-sm transition-all"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {c.label}
            </div>
            <div className={`text-3xl font-bold mt-2 ${c.accent}`}>{c.value}</div>
            <div className="text-xs text-stone-600 mt-1">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Two-Column Action Panels: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <section className="rounded-2xl border border-stone-200/90 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#002c3f]">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#871a45] hover:underline min-h-[44px] inline-flex items-center"
            >
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-stone-500 py-6 text-center">No orders placed yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#871a45]">{o.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          STATUS_STYLE[o.status] ?? "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 truncate mt-0.5">
                      {o.customerName} · {o.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"}
                    </div>
                  </div>
                  <div className="font-bold text-sm text-[#002c3f] shrink-0">
                    {rupees(o.totalAmount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Low Stock Watchlist */}
        <section className="rounded-2xl border border-stone-200/90 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#002c3f]">Low Stock Watchlist</h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#871a45] hover:underline min-h-[44px] inline-flex items-center"
            >
              Manage stock →
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-4 text-center font-medium">
              All active product sizes have healthy stock (&gt; 5 units).
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {lowStockVariants.map((v) => (
                <li key={v.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#002c3f] truncate">
                      {v.product.name}
                    </div>
                    <div className="text-xs text-stone-500">{v.name}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        v.stock === 0
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {v.stock === 0 ? "Sold out" : `${v.stock} left`}
                    </span>
                    <Link
                      href={`/admin/products/${v.product.id}`}
                      className="text-xs font-bold text-[#871a45] underline min-h-[44px] inline-flex items-center px-1"
                    >
                      Restock
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
