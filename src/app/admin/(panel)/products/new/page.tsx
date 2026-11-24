import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { ProductForm } from "@/components/admin/ProductForm";

async function NewProduct() {
  await requireAdminPage(); // Rule F3

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#002c3f]">Add product</h1>
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
    <Suspense fallback={<p role="status">Loading...</p>}>
      <NewProduct />
    </Suspense>
  );
}
