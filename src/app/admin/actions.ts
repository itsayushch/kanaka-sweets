"use server";

/**
 * Admin login / logout server actions.
 * Login is rate limited (Rule F8): per IP and per email address.
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { checkRateLimit, clientIp, waitText } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email").max(120).pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Enter your password").max(200),
});

export interface LoginState {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string; // kept so the email isn't lost after a failed attempt (B6)
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });

  if (!parsed.success) {
    const f = z.flattenError(parsed.error).fieldErrors;
    return { email, fieldErrors: { email: f.email?.[0], password: f.password?.[0] } };
  }

  // Rate limit BEFORE checking the password (Rule F8). Two limits: one per IP
  // address, and one per email so many IPs can't take turns guessing one account.
  const requestHeaders = await headers();
  const byIp = await checkRateLimit("login", clientIp(requestHeaders));
  const byEmail = await checkRateLimit("loginEmail", parsed.data.email.toLowerCase());
  if (!byIp.allowed || !byEmail.allowed) {
    const wait = Math.max(byIp.retryAfterSec, byEmail.retryAfterSec);
    return { email, error: `Too many login attempts. Please try again in ${waitText(wait)}.` };
  }

  try {
    // Checks the password and sets the session cookie.
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: requestHeaders,
    });
  } catch {
    // Same message for "no such user" and "wrong password" on purpose.
    return { email, error: "Incorrect email or password." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
