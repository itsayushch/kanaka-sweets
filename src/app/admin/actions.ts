"use server";

/**
 * Admin login / logout server actions.
 * Rate limiting on login is added in Phase 5 (Rule F8).
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

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

  try {
    // Checks the password and sets the session cookie.
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: await headers(),
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
