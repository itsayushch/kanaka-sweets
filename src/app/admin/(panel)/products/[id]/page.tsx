import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { ProductForm } from "@/components/admin/ProductForm";
import { FormSkeleton } from "@/components/admin/AdminSkeletons";

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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#002c3f]"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Edit: {product.name}
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
    <Suspense fallback={<FormSkeleton />}>
      <EditProduct params={params} />
    </Suspense>
  );
}
