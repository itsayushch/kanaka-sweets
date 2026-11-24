/**
 * POST /api/admin/upload  (multipart form, field "file") -> { url }
 *
 * Admin only (Rule F3). Accepts only JPEG, PNG or WebP up to 2 MB and checks
 * this on the server (Rule F9). See src/lib/uploads.ts.
 */
import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import {
  MAX_UPLOAD_BYTES,
  UploadError,
  checkImageFile,
  isStorageConfigured,
  storeImage,
} from "@/lib/uploads";

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  try {
    // Refuse huge uploads early, before reading the body (a little extra room
    // for the multipart wrapper around the file).
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
      throw new UploadError("The image is too large. The limit is 2 MB.", 413);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new UploadError("Send the image as a form upload with a field named file.", 400);
    }
    const file = form.get("file");
    if (!(file instanceof File)) throw new UploadError("No file was sent.", 400);

    // Size + type + real-content checks (throws if the file is not allowed).
    const { bytes, type } = await checkImageFile(file);

    if (!isStorageConfigured()) {
      throw new UploadError("Image uploads are not set up yet (Cloudinary keys missing).", 503);
    }
    const url = await storeImage(bytes, type);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: "UPLOAD_REJECTED", message: error.message }, { status: error.status });
    }
    console.error("[api/admin/upload]", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "SERVER_ERROR", message: "Upload failed. Please try again." }, { status: 500 });
  }
}
