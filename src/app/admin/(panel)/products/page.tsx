import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

async function ProductList() {
  await requireAdminPage(); // Rule F3

  const products = await prisma.product.findMany({
    orderBy: [{ category: { displayOrder: "asc" } }, { name: "asc" }],
    include: { category: true, variants: { orderBy: { price: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-[#002c3f]">Products</h1>
        <Link href="/admin/products/new" className="bg-[#871a45] text-white font-bold text-sm rounded-xl px-6 min-h-[44px] inline-flex items-center">
          + Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Sizes: price / stock</th>
              <th className="p-3">Status</th>
              <th className="p-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-semibold text-[#002c3f]">{p.name}</td>
                <td className="p-3">{p.category.name}</td>
                <td className="p-3">
                  {p.variants.map((v) => (
                    <div key={v.id} className={v.stock === 0 ? "text-rose-700" : ""}>
                      {v.name}: {rupees(v.price)} / {v.stock === 0 ? "sold out" : v.stock}
                    </div>
                  ))}
                </td>
                <td className="p-3">{p.isActive ? "Shown" : <span className="text-stone-500">Hidden</span>}</td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="font-bold text-[#871a45] underline min-h-[44px] inline-flex items-center">Edit</Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-stone-500">No products yet. Add your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <ProductList />
    </Suspense>
  );
}
