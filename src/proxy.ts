/**
 * First gate for admin PAGES (Next.js "proxy", formerly middleware).
 *
 * It checks the session for real (not just that a cookie exists), so a missing,
 * expired or forged cookie gets an immediate redirect to the login page.
 *
 * This is NOT the only protection (Rule F3). Every admin page and every
 * /api/admin handler ALSO checks the session itself (src/lib/admin-guard.ts),
 * so removing this file would not expose anything.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

// Pages only. /api/admin handlers answer 401 themselves.
export const config = { matcher: ["/admin/:path*"] };
