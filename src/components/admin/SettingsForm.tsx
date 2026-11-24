"use client";

/**
 * Festival highlight controls (Rule A5): switch it on or off and edit its text and image.
 * Saving calls /api/admin/settings, then the home page refreshes its cache.
 */
import { useState } from "react";
import { ImageField } from "@/components/admin/ImageField";
import { adminFetch, issuesToMap } from "@/components/admin/adminFetch";

export interface SettingsValues {
  festivalHighlightActive: boolean;
  festivalHighlightTitle: string;
  festivalHighlightSubtitle: string;
  festivalHighlightText: string;
  festivalHighlightImage: string;
  festivalHighlightDiscount: string;
}

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setStatus(null);
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrors({});
    setStatus(null);
    const result = await adminFetch("PUT", "/api/admin/settings", values);
    setSaving(false);
    if (result.ok) {
      setStatus({ ok: true, text: "Saved. The home page now shows your changes." });
      return;
    }
    if (result.status === 422 && result.data.issues) setErrors(issuesToMap(result.data.issues));
    setStatus({ ok: false, text: result.data.message ?? "Please fix the highlighted fields." });
  }

  const field = (bad?: string) =>
    `w-full rounded-xl border px-4 min-h-[48px] text-base bg-white ${bad ? "border-rose-500" : "border-stone-300"}`;
  const err = (key: string) =>
    errors[key] ? <p role="alert" className="text-sm font-semibold text-rose-700 mt-1">{errors[key]}</p> : null;

  return (
    <form onSubmit={save} noValidate className="space-y-5 max-w-2xl">
      {status && (
        <p role={status.ok ? "status" : "alert"} className={`rounded-xl border p-3 text-sm font-semibold ${status.ok ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800"}`}>
          {status.text}
        </p>
      )}

      <label className="flex items-center gap-3 min-h-[48px] rounded-xl border border-stone-200 p-3 font-bold">
        <input type="checkbox" checked={values.festivalHighlightActive} onChange={(e) => set("festivalHighlightActive", e.target.checked)} className="w-6 h-6 accent-[#871a45]" />
        Show the festival highlight on the home page
      </label>

      <div>
        <label htmlFor="title" className="block text-sm font-bold mb-1">Title</label>
        <input id="title" value={values.festivalHighlightTitle} onChange={(e) => set("festivalHighlightTitle", e.target.value)} className={field(errors.festivalHighlightTitle)} />
        {err("festivalHighlightTitle")}
      </div>
      <div>
        <label htmlFor="subtitle" className="block text-sm font-bold mb-1">Subtitle</label>
        <input id="subtitle" value={values.festivalHighlightSubtitle} onChange={(e) => set("festivalHighlightSubtitle", e.target.value)} className={field(errors.festivalHighlightSubtitle)} />
        {err("festivalHighlightSubtitle")}
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-bold mb-1">Text</label>
        <textarea id="text" rows={4} value={values.festivalHighlightText} onChange={(e) => set("festivalHighlightText", e.target.value)} className={field(errors.festivalHighlightText) + " py-3"} />
        {err("festivalHighlightText")}
      </div>
      <div>
        <label htmlFor="discount" className="block text-sm font-bold mb-1">Offer line (optional)</label>
        <input id="discount" value={values.festivalHighlightDiscount} onChange={(e) => set("festivalHighlightDiscount", e.target.value)} className={field(errors.festivalHighlightDiscount)} />
        {err("festivalHighlightDiscount")}
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-bold mb-1">Image</label>
        <ImageField id="image" value={values.festivalHighlightImage} onChange={(url) => set("festivalHighlightImage", url)} error={errors.festivalHighlightImage} />
      </div>

      <button type="submit" disabled={saving} className="bg-[#871a45] disabled:opacity-60 text-white font-bold text-sm rounded-xl px-8 min-h-[48px]">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
