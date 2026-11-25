/**
 * Checks the database lock-down (Rule F5):
 *   - Row Level Security is ON for every table in the public schema
 *   - there are NO policies (so nothing is opened to the public roles)
 *   - if the Supabase roles "anon" / "authenticated" exist, they have no
 *     privileges on any table
 *
 *   pnpm check:rls
 */
import { prisma } from "../src/lib/prisma";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

async function main() {
  const tables = await prisma.$queryRaw<{ tablename: string; rowsecurity: boolean }[]>`
    SELECT tablename, rowsecurity FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE '\_prisma%' ORDER BY tablename`;
  console.log("table              RLS");
  for (const t of tables) console.log(`${t.tablename.padEnd(18)} ${t.rowsecurity ? "on" : "OFF"}`);
  console.log("");

  const off = tables.filter((t) => !t.rowsecurity).map((t) => t.tablename);
  check(`RLS is on for all ${tables.length} tables`, tables.length > 0 && off.length === 0, off.length ? "OFF: " + off.join(", ") : "");

  const policies = await prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM pg_policies WHERE schemaname = 'public'`;
  check("no policies exist (nothing is opened to the public)", Number(policies[0].n) === 0, `${policies[0].n} policies`);

  const roles = await prisma.$queryRaw<{ rolname: string }[]>`SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')`;
  if (roles.length === 0) {
    console.log("SKIP  anon / authenticated roles do not exist here (plain Postgres). Re-run this against Supabase.");
  } else {
    for (const { rolname } of roles) {
      const rows = await prisma.$queryRaw<{ tablename: string }[]>`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
          AND (has_table_privilege(${rolname}, format('public.%I', tablename), 'SELECT')
            OR has_table_privilege(${rolname}, format('public.%I', tablename), 'INSERT')
            OR has_table_privilege(${rolname}, format('public.%I', tablename), 'UPDATE')
            OR has_table_privilege(${rolname}, format('public.%I', tablename), 'DELETE'))`;
      check(`role "${rolname}" has no access to any table`, rows.length === 0, rows.map((r) => r.tablename).join(", "));
    }
  }

  await prisma.$disconnect();
  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("check-rls crashed:", (error as Error).message);
  process.exit(1);
});
