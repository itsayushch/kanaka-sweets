"use client";

/**
 * Add / edit a product with its sizes (each size has its own price and stock).
 * The server validates everything again (Rule F6); errors it sends appear next
 * to the right field, and nothing typed is lost (Rule B6).
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageField } from "@/components/admin/ImageField";
import { adminFetch, issuesToMap } from "@/components/admin/adminFetch";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  image: string;
  isFeatured: boolean;
  isBestForGifting: boolean;
  isActive: boolean;
  variants: { id?: string; name: string; weight: string; price: string; stock: string }[];
}

const emptyVariant = { name: "", weight: "", price: "", stock: "0" };

export function ProductForm({
  initial,
  categories,
}: {
  initial: ProductFormValues;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const setVariant = (index: number, key: keyof ProductFormValues["variants"][number], value: string) => {
    setValues((v) => ({
      ...v,
      variants: v.variants.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));
    // Clear that size field's error as soon as it is edited (same as other fields).
    setErrors((e) => {
      const errorKey = `variants.${index}.${key}`;
      if (!(errorKey in e)) return e;
      const next = { ...e };
      delete next[errorKey];
      return next;
    });
  };

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrors({});
    setMessage(null);

    // Numbers are typed as text; turn them into numbers for the server.
    const body = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      categoryId: values.categoryId,
      image: values.image,
      isFeatured: values.isFeatured,
      isBestForGifting: values.isBestForGifting,
      isActive: values.isActive,
      variants: values.variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        name: v.name,
        weight: v.weight,
        price: v.price.trim() === "" ? undefined : Number(v.price),
        stock: v.stock.trim() === "" ? undefined : Number(v.stock),
      })),
    };

    const result = isEdit
      ? await adminFetch("PUT", `/api/admin/products/${initial.id}`, body)
      : await adminFetch("POST", "/api/admin/products", body);
    setSaving(false);

    if (result.ok) {
      router.push("/admin/products");
      router.refresh();
      return;
    }
    if (result.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (result.status === 422 && result.data.issues) setErrors(issuesToMap(result.data.issues));
    setMessage(result.data.message ?? "Please fix the highlighted fields.");
  }

  async function remove() {
    setSaving(true);
    const result = await adminFetch("DELETE", `/api/admin/products/${initial.id}`);
    setSaving(false);
    if (result.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setConfirmDelete(false);
      setMessage(result.data.message ?? "Could not remove the product.");
    }
  }

  const field = (bad?: string) =>
    `w-full rounded-xl border px-4 min-h-[48px] text-base bg-white ${bad ? "border-rose-500" : "border-stone-300"}`;
  const err = (key: string) =>
    errors[key] ? <p role="alert" className="text-sm font-semibold text-rose-700 mt-1">{errors[key]}</p> : null;

  return (
    <form onSubmit={save} noValidate className="space-y-6 max-w-3xl">
      {message && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{message}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Name</label>
          <input id="name" value={values.name} onChange={(e) => set("name", e.target.value)} className={field(errors.name)} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-bold mb-1">Web address (optional)</label>
          <input id="slug" value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="made from the name if empty" className={field(errors.slug)} />
          {err("slug")}
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-bold mb-1">Category</label>
        <select id="categoryId" value={values.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={field(errors.categoryId)}>
          <option value="">Choose a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {err("categoryId")}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-bold mb-1">Description</label>
        <textarea id="description" rows={4} value={values.description} onChange={(e) => set("description", e.target.value)} className={field(errors.description) + " py-3"} />
        {err("description")}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-bold mb-1">Image</label>
        <ImageField id="image" value={values.image} onChange={(url) => set("image", url)} error={errors.image} />
      </div>

      {/* ── Sizes: each has its own price and stock ── */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold">Sizes, prices and stock</legend>
        {errors.variants && <p role="alert" className="text-sm font-semibold text-rose-700">{errors.variants}</p>}
        {values.variants.map((row, i) => (
          <div key={row.id ?? `new-${i}`} className="grid grid-cols-2 sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-2 items-start rounded-xl border border-stone-200 p-3">
            <div>
              <input aria-label={`Size ${i + 1} name`} placeholder="e.g. 500g Box" value={row.name} onChange={(e) => setVariant(i, "name", e.target.value)} className={field(errors[`variants.${i}.name`])} />
              {err(`variants.${i}.name`)}
            </div>
            <div>
              <input aria-label={`Size ${i + 1} weight`} placeholder="Weight (optional)" value={row.weight} onChange={(e) => setVariant(i, "weight", e.target.value)} className={field()} />
            </div>
            <div>
              <input aria-label={`Size ${i + 1} price in rupees`} placeholder="Price ₹" inputMode="numeric" value={row.price} onChange={(e) => setVariant(i, "price", e.target.value)} className={field(errors[`variants.${i}.price`])} />
              {err(`variants.${i}.price`)}
            </div>
            <div>
              <input aria-label={`Size ${i + 1} stock`} placeholder="Stock" inputMode="numeric" value={row.stock} onChange={(e) => setVariant(i, "stock", e.target.value)} className={field(errors[`variants.${i}.stock`])} />
              {err(`variants.${i}.stock`)}
            </div>
            <button type="button" onClick={() => setValues((v) => ({ ...v, variants: v.variants.filter((_, j) => j !== i) }))}
              className="min-h-[48px] px-3 text-sm font-semibold text-rose-700 underline">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => setValues((v) => ({ ...v, variants: [...v.variants, { ...emptyVariant }] }))}
          className="rounded-xl border border-stone-300 px-4 min-h-[44px] text-sm font-semibold hover:bg-stone-50">+ Add a size</button>
      </fieldset>

      <div className="flex flex-wrap gap-6">
        {([
          ["isActive", "Show in the shop"],
          ["isFeatured", "Featured on home page"],
          ["isBestForGifting", "Label: Best for gifting"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 min-h-[44px] text-sm font-semibold">
            <input type="checkbox" checked={values[key]} onChange={(e) => set(key, e.target.checked)} className="w-5 h-5 accent-[#871a45]" />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="bg-[#871a45] disabled:opacity-60 text-white font-bold text-sm rounded-xl px-8 min-h-[48px]">
          {saving ? "Saving..." : isEdit ? "Save changes" : "Add product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="min-h-[48px] px-4 text-sm font-semibold underline">Cancel</button>
        {isEdit && (confirmDelete ? (
          <span className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-semibold text-rose-800">Remove this product?</span>
            <button type="button" onClick={remove} disabled={saving} className="rounded-xl bg-rose-700 text-white text-sm font-bold px-4 min-h-[44px]">Yes, remove</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm underline min-h-[44px] px-2">No</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="ml-auto min-h-[44px] px-4 text-sm font-semibold text-rose-700 underline">Delete product</button>
        ))}
      </div>
    </form>
  );
}
