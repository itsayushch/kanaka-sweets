import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { ProductForm } from "@/components/admin/ProductForm";

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage(); // Rule F3

  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { price: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#002c3f]">Edit: {product.name}</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          image: product.image,
          isFeatured: product.isFeatured,
          isBestForGifting: product.isBestForGifting,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            weight: v.weight ?? "",
            price: String(v.price),
            stock: String(v.stock),
          })),
        }}
      />
    </div>
  );
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}
