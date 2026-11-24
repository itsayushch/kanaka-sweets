/**
 * Admin image upload rules (Rule F9) and storage. SERVER ONLY.
 *
 * The checks happen here on the server. The browser form may also check, but
 * we never trust it.
 *   1. size: at most 2 MB
 *   2. type: JPEG, PNG or WebP only (by the declared type AND by the file's
 *      real first bytes, so a .txt renamed to .png is rejected)
 * Accepted files are stored on Cloudinary.
 */
import { createHash } from "node:crypto";

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export class UploadError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Look at the first bytes of the file to see what it really is. */
function sniffImageType(bytes: Uint8Array): (typeof ALLOWED_IMAGE_TYPES)[number] | null {
  // JPEG starts FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  // PNG starts 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((b, i) => bytes[i] === b)) return "image/png";
  // WebP is "RIFF" + 4 size bytes + "WEBP"
  const text = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Check an uploaded file. Throws UploadError with a plain message if it is not allowed. */
export async function checkImageFile(file: File): Promise<{ bytes: Uint8Array; type: string }> {
  if (file.size === 0) throw new UploadError("The file is empty.", 400);
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("The image is too large. The limit is 2 MB.", 413);
  }
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadError("Only JPEG, PNG or WebP images are allowed.", 415);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const real = sniffImageType(bytes);
  if (!real || real !== file.type) {
    throw new UploadError("That file is not a real JPEG, PNG or WebP image.", 415);
  }
  return { bytes, type: real };
}

/** True when the Cloudinary variables are set in .env. */
export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/** Upload a checked image to Cloudinary (signed upload) and return its https URL. */
export async function storeImage(bytes: Uint8Array, type: string): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) {
    throw new UploadError("Image uploads are not set up yet (Cloudinary keys missing).", 503);
  }

  // Cloudinary signature: SHA-1 of the sorted parameters followed by the secret.
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = "kanaka-sweets";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append("file", new Blob([bytes as BlobPart], { type }));
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new UploadError("The image could not be saved. Please try again.", 502);

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new UploadError("The image could not be saved. Please try again.", 502);
  return data.secure_url;
}
