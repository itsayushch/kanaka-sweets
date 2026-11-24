import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-guard";
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
    <div className="py-16 max-w-sm mx-auto px-4" style={{ fontFamily: "var(--font-jost)" }}>
      <h1 className="font-serif text-2xl font-bold text-[#002c3f] mb-6 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
        Admin Login
      </h1>
      <Suspense fallback={null}><AlreadySignedIn /></Suspense>
      <LoginForm />
    </div>
  );
}
