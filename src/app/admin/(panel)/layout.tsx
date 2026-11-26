import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Dedicated full-screen Admin Workspace (sidebar on desktop, compact header on mobile).
 * The login check is NOT done here: every admin page calls requireAdminPage()
 * itself, because a layout is not re-run when you move between pages (Rule F3).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#FAF6EF] flex flex-col lg:flex-row"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <Suspense fallback={<div className="hidden lg:block lg:w-64 lg:shrink-0 bg-[#002c3f]" />}>
        <AdminNav />
      </Suspense>
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
