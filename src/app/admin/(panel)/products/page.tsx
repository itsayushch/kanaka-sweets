import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { ProductsTableClient, type AdminProductRow } from "@/components/admin/ProductsTableClient";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";

async function ProductList() {
  await requireAdminPage(); // Rule F3

  const products = await prisma.product.findMany({
    orderBy: [{ category: { displayOrder: "asc" } }, { name: "asc" }],
    include: { category: true, variants: { orderBy: { price: "asc" } } },
  });

  const rows: AdminProductRow[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.image,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      stock: v.stock,
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Products
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Add sweets, update variant prices, and control counter stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#871a45] hover:bg-[#691436] text-white font-bold text-sm rounded-xl px-5 min-h-[44px] inline-flex items-center shadow-xs transition-colors"
        >
          + Add product
        </Link>
      </div>

      <ProductsTableClient products={rows} />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ProductList />
    </Suspense>
  );
}
