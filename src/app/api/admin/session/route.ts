import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";

/**
 * Lightweight read-only session check for the header ProfileMenu.
 * Returns 200 { authenticated: false } for guests so storefront pages never log 404s.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    email: session.user.email,
    name: session.user.name,
  });
}
