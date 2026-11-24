/**
 * Optimistic admin gate (Next.js "proxy", formerly middleware).
 *
 * This only checks that a session cookie EXISTS, so visitors without one are
 * sent to the login page quickly. It does NOT prove the cookie is valid.
 * The real check (src/lib/admin-guard.ts) runs inside every admin page and
 * every /api/admin handler (Rule F3).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

// Pages only. /api/admin handlers answer 401 themselves.
export const config = { matcher: ["/admin/:path*"] };
