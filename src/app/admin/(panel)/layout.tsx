import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Frame around every admin page. It only draws the navigation bar and canvas.
 * The login check is NOT done here: every admin page calls requireAdminPage()
 * itself, because a layout is not re-run when you move between pages (Rule F3).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF6EF]" style={{ fontFamily: "var(--font-jost)" }}>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
