/**
 * Safety guard for test scripts that create and delete data.
 * They refuse to run against a remote (live) database.
 * Override only if you really mean it: ALLOW_REMOTE_DB=yes
 */
const url = process.env.DATABASE_URL ?? "";
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);

if (!isLocal && process.env.ALLOW_REMOTE_DB !== "yes") {
  console.error(
    "Refusing to run: DATABASE_URL points at a remote database, and this test creates and deletes data.\n" +
      "Point DATABASE_URL and DIRECT_URL at your local database first (or set ALLOW_REMOTE_DB=yes).",
  );
  process.exit(1);
}
