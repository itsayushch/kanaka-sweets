import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { SettingsForm } from "@/components/admin/SettingsForm";

async function Settings() {
  await requireAdminPage(); // Rule F3

  // Read live (not the cached copy) so the form always shows what is saved.
  const s = await prisma.siteSettings.findUnique({ where: { id: "global" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#002c3f]">Festival highlight</h1>
      <p className="text-sm text-stone-600 max-w-2xl">
        This is the festival section on the home page that makes Festival Boxes stand out.
      </p>
      <SettingsForm
        initial={{
          festivalHighlightActive: s?.festivalHighlightActive ?? true,
          festivalHighlightTitle: s?.festivalHighlightTitle ?? "",
          festivalHighlightSubtitle: s?.festivalHighlightSubtitle ?? "",
          festivalHighlightText: s?.festivalHighlightText ?? "",
          festivalHighlightImage: s?.festivalHighlightImage ?? "",
          festivalHighlightDiscount: s?.festivalHighlightDiscount ?? "",
        }}
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p role="status">Loading...</p>}>
      <Settings />
    </Suspense>
  );
}
