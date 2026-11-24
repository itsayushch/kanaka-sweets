/**
 * Server-side admin checks (Rule F3).
 *
 * EVERY admin page and EVERY /api/admin/* handler calls one of these itself.
 * We never rely only on proxy.ts or on hiding links: those are convenience,
 * this is the real lock.
 *
 *  - requireAdminPage()  for pages and layouts: sends visitors to the login.
 *  - denyUnlessAdmin()   for API route handlers: answers 401 as JSON.
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/** The logged-in admin's session, or null if not logged in / not an admin. */
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") return null;
  return session;
}

/** For pages: redirect to the login page unless an admin is logged in. */
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * For API route handlers. Returns a 401 response if the caller is not a
 * logged-in admin, otherwise null. Use it as the first line of the handler:
 *
 *   const denied = await denyUnlessAdmin();
 *   if (denied) return denied;
 */
export async function denyUnlessAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return null;
}
