import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";

// On Vercel (Linux), Prisma's custom output generator leaves `dirname: ""`, so
// it searches `/var/task/src/generated` instead of `/var/task/src/generated/prisma`.
// Point directly at the traced engine file when running on Linux.
if (process.platform === "linux" && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const candidates = [
    path.join(process.cwd(), "src/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"),
    path.join(process.cwd(), ".prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"),
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (found) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = found;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
