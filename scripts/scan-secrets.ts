/**
 * Secrets scan (Rule F4): no secret keys in frontend code or the GitHub
 * repository, including commit history.
 *
 *   pnpm build && pnpm scan:secrets
 *
 * It checks three places:
 *   1. every tracked file in the repo
 *   2. the WHOLE git history (every commit, every branch)
 *   3. the JavaScript sent to browsers (.next/static), from your last build
 * It looks for (a) the real secret values that are in your local .env, and
 * (b) well-known secret formats (Razorpay keys, private keys, database URLs
 * with passwords, JWTs...). It never prints a secret, only where it was found.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

const git = (...args: string[]) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).trim();

// ── 1. The real secret values from .env (kept in memory, never printed) ─────
function secretValuesFromEnv(): { name: string; value: string }[] {
  if (!existsSync(".env")) return [];
  const found: { name: string; value: string }[] = [];
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!m) continue;
    const [, name, raw] = m;
    const value = raw.replace(/^["']|["']$/g, "");
    if (value.length < 8) continue;
    // Variables that are secret (or contain a password).
    const looksSecret = /SECRET|TOKEN|PASSWORD|API_KEY|KEY_ID|_URL$/.test(name) && !/^NEXT_PUBLIC_(?!RAZORPAY)/.test(name);
    if (!looksSecret) continue;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(value)) continue; // plain local address, nothing secret
    found.push({ name, value });
    // Also test the password inside a database URL on its own.
    const pw = /^[a-z+]+:\/\/[^:\s]+:([^@\s]+)@/.exec(value);
    if (pw && pw[1].length >= 6) found.push({ name: `${name} (password part)`, value: decodeURIComponent(pw[1]) });
  }
  return found;
}

// ── well-known secret formats ───────────────────────────────────────────────
const PATTERNS: { label: string; re: RegExp }[] = [
  { label: "Razorpay key (rzp_test_/rzp_live_ + id)", re: /rzp_(test|live)_[A-Za-z0-9]{10,}/ },
  { label: "private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { label: "database URL with a password", re: /postgres(ql)?:\/\/[^:\s/]+:(?!password|\*\*\*|<|YOUR|xxxx)[^@\s/]{4,}@(?!localhost:5432\/dbname)[^\s"']+/i },
  { label: "JWT (e.g. Supabase keys)", re: /eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/ },
  { label: "AWS access key", re: /AKIA[0-9A-Z]{16}/ },
  { label: "live secret key (sk_live_...)", re: /sk_live_[A-Za-z0-9]{10,}/ },
];

const secretNames = [
  "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET", "BETTER_AUTH_SECRET", "DATABASE_URL", "DIRECT_URL",
  "UPSTASH_REDIS_REST_TOKEN", "CLOUDINARY_API_SECRET", "ADMIN_PASSWORD",
];

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function main() {
  const secrets = secretValuesFromEnv();
  console.log(`(checking ${secrets.length} secret values from .env; none are printed)\n`);

  // ── Repository files ──
  console.log("== 1. Files tracked by git ==");
  const files = git("ls-files").split("\n").filter((f) => f && !/(pnpm-lock\.yaml|\.(png|jpg|jpeg|webp|ico|woff2?|pdf))$/i.test(f));
  const tracked = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

  check(".env is not tracked by git", !git("ls-files").split("\n").includes(".env"));
  check(".env is ignored by .gitignore", (() => { try { git("check-ignore", ".env"); return true; } catch { return false; } })());
  check("confidential docs/ PDFs are not tracked", !git("ls-files", "docs").length);

  const hitsInFiles = secrets.filter((s) => [...tracked.values()].some((text) => text.includes(s.value)));
  check("no real secret value from .env appears in any tracked file", hitsInFiles.length === 0, hitsInFiles.map((s) => s.name).join(", "));

  const patternHitsFiles: string[] = [];
  for (const [file, text] of tracked) {
    for (const p of PATTERNS) if (p.re.test(text)) patternHitsFiles.push(`${file}: ${p.label}`);
  }
  check("no secret-looking strings in tracked files", patternHitsFiles.length === 0, patternHitsFiles.join("; "));

  // ── Git history ──
  console.log("\n== 2. Whole git history ==");
  const commitCount = git("rev-list", "--all", "--count");
  check(".env was never committed in any commit", git("log", "--all", "--oneline", "--", ".env", ".env.local", ".env.production").length === 0, `${commitCount} commits checked`);

  const historyHits: string[] = [];
  for (const s of secrets) {
    const commits = git("log", "--all", "--oneline", "-S" + s.value);
    if (commits) historyHits.push(`${s.name} in ${commits.split("\n").length} commit(s)`);
  }
  check("no real secret value from .env ever appears in git history", historyHits.length === 0, historyHits.join("; "));

  // Read every commit's added lines (skipping the lock file) and test each pattern.
  const patternHistory = new Set<string>();
  const patch = git("log", "--all", "-p", "--no-color", "--", ".", ":(exclude)pnpm-lock.yaml");
  let commit = "";
  for (const line of patch.split(String.fromCharCode(10))) {
    if (line.startsWith("commit ")) commit = line.slice(7, 14);
    else if (line.startsWith("+") && !line.startsWith("+++")) {
      for (const p of PATTERNS) if (p.re.test(line)) patternHistory.add(`${p.label} in ${commit}`);
    }
  }
  check("no secret-looking strings anywhere in git history", patternHistory.size === 0, [...patternHistory].join("; "));

  // ── Browser bundle ──
  console.log("\n== 3. JavaScript sent to browsers (.next/static) ==");
  if (!existsSync(".next/static")) {
    console.log("SKIP  no build found. Run pnpm build first.");
  } else {
    const bundle = [...walk(".next/static")].filter((f) => /\.(js|css|map|html|json)$/.test(f));
    const texts = bundle.map((f) => readFileSync(f, "utf8"));
    check(`scanned ${bundle.length} browser files`, bundle.length > 0);

    const bundleSecretHits = secrets.filter((s) => texts.some((t) => t.includes(s.value)));
    check("no real secret value from .env is in the browser JavaScript", bundleSecretHits.length === 0, bundleSecretHits.map((s) => s.name).join(", "));

    const bundlePatterns: string[] = [];
    for (const p of PATTERNS) if (texts.some((t) => p.re.test(t))) bundlePatterns.push(p.label);
    check("no secret-looking strings in the browser JavaScript", bundlePatterns.length === 0, bundlePatterns.join("; "));

    const nameHits = secretNames.filter((n) => texts.some((t) => t.includes(n)));
    check("no secret variable NAMES in the browser JavaScript", nameHits.length === 0, nameHits.join(", "));

    // The three searches the Helper PDF suggests, so you can see what a reviewer sees.
    for (const word of ["rzp_", "secret", "key_secret"]) {
      const files = bundle.filter((_, i) => texts[i].toLowerCase().includes(word));
      console.log(`INFO  "${word}" appears in ${files.length} browser file(s)${files.length ? " (check these are library words, not keys)" : ""}`);
    }
  }

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("scan-secrets crashed:", (error as Error).message);
  process.exit(1);
});
