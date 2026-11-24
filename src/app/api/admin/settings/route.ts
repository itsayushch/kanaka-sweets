/**
 * PUT /api/admin/settings -> festival highlight: switch on/off, edit text and image (A5).
 * Admin only (Rule F3): the session is checked first, inside this handler.
 */
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { handleAdminError, invalidJson, readJson, validationError } from "@/lib/admin-api";
import { settingsSchema } from "@/lib/admin-validation";

export async function PUT(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  if (body === null) return invalidJson();

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    // One settings row, id "global".
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: { id: "global", ...parsed.data },
    });
    revalidateTag("site-settings", { expire: 0 }); // home page updates straight away
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAdminError(error, "api/admin/settings PUT");
  }
}
