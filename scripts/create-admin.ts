/**
 * Creates (or resets the password of) the admin account.
 *
 *   pnpm create-admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env. If ADMIN_PASSWORD is empty it
 * generates a strong one and saves it to .env (which is gitignored), so the
 * password is never printed or committed. Admin sign-up is disabled in the
 * app, so this script is the only way to make an admin.
 */
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

const ENV_FILE = ".env";

function saveEnv(name: string, value: string) {
  const text = readFileSync(ENV_FILE, "utf8");
  const line = `${name}="${value}"`;
  const next = new RegExp(`^${name}=.*$`, "m").test(text)
    ? text.replace(new RegExp(`^${name}=.*$`, "m"), line)
    : text.replace(/\n?$/, "\n") + line + "\n";
  writeFileSync(ENV_FILE, next);
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@kanakasweets.example").toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!password) {
    password = randomBytes(12).toString("base64url"); // 16 characters
    generated = true;
  }
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

  // Hash with the same function the login uses (scrypt).
  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.account.updateMany({
      where: { userId: existing.id, providerId: "credential" },
      data: { password: hash },
    });
    await prisma.user.update({ where: { id: existing.id }, data: { role: "admin" } });
    console.log(`Updated the password for ${email}`);
  } else {
    const userId = randomBytes(16).toString("hex");
    await prisma.user.create({
      data: {
        id: userId,
        name: "Shop Admin",
        email,
        emailVerified: true,
        role: "admin",
        accounts: {
          create: {
            id: randomBytes(16).toString("hex"),
            accountId: userId,
            providerId: "credential",
            password: hash,
          },
        },
      },
    });
    console.log(`Created admin ${email}`);
  }

  saveEnv("ADMIN_EMAIL", email);
  if (generated) {
    saveEnv("ADMIN_PASSWORD", password);
    console.log("A password was generated and saved as ADMIN_PASSWORD in .env (not shown here).");
  }
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("create-admin failed:", (error as Error).message);
  process.exit(1);
});
