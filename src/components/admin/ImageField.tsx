"use client";

/**
 * Image field for the admin: paste an image link, or upload a file.
 * The upload goes to /api/admin/upload, which re-checks type and size on the
 * server (Rule F9). The checks here only save the owner a wasted upload.
 */
import { useState } from "react";
import Image from "next/image";

const MAX_BYTES = 2 * 1024 * 1024;

export function ImageField({
  id,
  value,
  onChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Choose a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("The image is over 2 MB. Please choose a smaller one.");
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) onChange(data.url);
      else setUploadError(data.message ?? "Upload failed. Please try again.");
    } catch {
      setUploadError("Could not reach the server. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const showPreview = value.startsWith("/") || value.startsWith("https://");

  return (
    <div className="space-y-2">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or /images/..."
        className={`w-full rounded-xl border px-4 min-h-[48px] text-base ${error ? "border-rose-500" : "border-stone-300"}`}
      />
      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 min-h-[44px] text-sm font-semibold cursor-pointer hover:bg-stone-50">
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-stone-500">JPEG, PNG or WebP, up to 2 MB</span>
      </div>
      {uploadError && <p role="alert" className="text-sm font-semibold text-rose-700">{uploadError}</p>}
      {error && <p role="alert" className="text-sm font-semibold text-rose-700">{error}</p>}
      {showPreview && (
        <Image src={value} alt="Preview" width={120} height={120} unoptimized className="rounded-xl object-cover w-28 h-28 bg-stone-100" />
      )}
    </div>
  );
}
