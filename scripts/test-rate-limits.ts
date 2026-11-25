/**
 * Proves Rule F8 for the API endpoints: after too many requests from one IP the
 * server answers 429 (Too Many Requests), while other visitors are unaffected.
 *
 *   pnpm test:rate-limits      (a server must be running; BASE_URL defaults to :3000)
 *
 * It sends deliberately invalid requests (empty bodies), so nothing is created
 * in the database. Each run uses brand new random IP addresses, so earlier runs
 * can't affect it. (Locally the server reads the IP from x-forwarded-for; on
 * Vercel the platform sets that header itself.)
 *
 * The admin LOGIN limit is tested in a real browser (see the Phase 5 summary).
 */
// (makes this file its own module so its names do not clash with other scripts)
export {};

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

const randomIp = () => `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

async function hit(path: string, ip: string) {
  return fetch(BASE_URL + path, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: "{}", // invalid on purpose: it is refused (422/400) but still counts as an attempt
  });
}

/** Send `max` requests (all must get through), then one more (must be blocked). */
async function testEndpoint(label: string, path: string, max: number) {
  console.log(`\n== ${label}: limit is ${max} requests per 10 minutes per IP ==`);
  const ip = randomIp();

  const statuses: number[] = [];
  for (let i = 0; i < max; i++) statuses.push((await hit(path, ip)).status);
  check(`first ${max} requests are NOT blocked`, statuses.every((s) => s !== 429), `statuses: ${[...new Set(statuses)].join(",")}`);

  const blocked = await hit(path, ip);
  const body = await blocked.json().catch(() => ({}));
  check(`request ${max + 1} is blocked with 429`, blocked.status === 429, `got ${blocked.status}`);
  check("response has a Retry-After header", Number(blocked.headers.get("retry-after")) > 0, `Retry-After: ${blocked.headers.get("retry-after")}`);
  check("response explains how long to wait", body.error === "RATE_LIMITED" && /try again in/i.test(body.message ?? ""), body.message);

  const again = await hit(path, ip);
  check("still blocked on the next try", again.status === 429, `got ${again.status}`);

  const other = await hit(path, randomIp());
  check("a DIFFERENT visitor (other IP) is not blocked", other.status !== 429, `got ${other.status}`);
}

async function main() {
  await testEndpoint("Checkout", "/api/checkout", 10);
  await testEndpoint("Create payment", "/api/payments/create", 20);
  await testEndpoint("Verify payment", "/api/payments/verify", 30);

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Test script crashed:", (error as Error).message);
  process.exit(1);
});
