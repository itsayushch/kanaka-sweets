import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";

async function Dashboard() {
  await requireAdminPage(); // Rule F3: check the login on the server

  const [products, lowStock, pending, paid] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count({ where: { stock: { lte: 5 }, product: { isActive: true } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
  ]);

  const cards = [
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Sizes with 5 or less in stock", value: lowStock, href: "/admin/products" },
    { label: "Orders waiting for payment", value: pending, href: "/admin/orders" },
    { label: "Paid orders", value: paid, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#002c3f]">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-stone-200 bg-white p-5 hover:border-[#871a45]">
            <div className="text-3xl font-bold text-[#871a45]">{c.value}</div>
            <div className="text-sm text-stone-600 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
