import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { ProductForm } from "@/components/admin/ProductForm";
import { FormSkeleton } from "@/components/admin/AdminSkeletons";

async function NewProduct() {
  await requireAdminPage(); // Rule F3

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#002c3f]"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Add product
        </h1>
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-stone-600 hover:text-[#871a45] min-h-[44px] inline-flex items-center"
        >
          ← Back to products
        </Link>
      </div>
      <ProductForm
        categories={categories}
        initial={{
          name: "",
          slug: "",
          description: "",
          categoryId: "",
          image: "",
          isFeatured: false,
          isBestForGifting: false,
          isActive: true,
          variants: [{ name: "", weight: "", price: "", stock: "0" }],
        }}
      />
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewProduct />
    </Suspense>
  );
}
