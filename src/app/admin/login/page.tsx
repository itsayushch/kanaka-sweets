import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-guard";
import { KanakaEmblemIcon } from "@/components/icons";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to manage Kanaka Sweets & Bakery.",
  robots: { index: false, follow: false },
};

/** Already signed in? Skip the form. (Reads cookies, so it sits in Suspense.) */
async function AlreadySignedIn() {
  if (await getAdminSession()) redirect("/admin");
  return null;
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-[calc(100vh-140px)] bg-[#FAF6EF] py-12 sm:py-16 px-4 flex flex-col items-center justify-center"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <Suspense fallback={null}>
        <AlreadySignedIn />
      </Suspense>

      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#871a45] text-[#F8D030] flex items-center justify-center mx-auto shadow-sm">
            <KanakaEmblemIcon className="w-6 h-6 text-[#F8D030]" />
          </div>
          <h1
            className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Store Manager Login
          </h1>
          <p className="text-sm text-stone-600">
            Sign in to manage products, stock, orders, and festival highlights.
          </p>
        </div>

        <LoginForm />

        <div className="pt-2 border-t border-stone-100 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-[#871a45] inline-flex items-center justify-center min-h-[44px] px-3"
          >
            ← Back to Kanaka Sweets Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
