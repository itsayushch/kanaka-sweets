/**
 * Better Auth setup for the admin login. SERVER ONLY.
 *
 * - Email + password only. Public sign-up is OFF: admin accounts are created
 *   by the owner with `pnpm create-admin` (see scripts/create-admin.ts).
 * - Sessions are stored in our database (tables: users, sessions, accounts).
 * - The session lives in a cookie that is HttpOnly (JavaScript can't read it).
 * - BETTER_AUTH_SECRET (in .env) signs that cookie.
 */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // nobody can register themselves
  },
  user: {
    additionalFields: {
      // "admin" for the shop owner. input:false = a request can't set it.
      role: { type: "string", required: false, defaultValue: "admin", input: false },
    },
  },
  // Lets server actions set the login cookie. Must be the last plugin.
  plugins: [nextCookies()],
});
