/**
 * Proves Rules F3 (admin protected on the server) and F9 (upload limits).
 *
 *   pnpm test:admin        (a server must be running; BASE_URL defaults to :3000)
 *
 * Part 1: calls every admin page and API WITHOUT logging in. They must refuse.
 * Part 2: logs in as the admin from .env and checks that the same calls work,
 *         and that uploads reject a .txt, a fake image, a wrong type and a big file.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in .env and are never printed.
 */
import { auth } from "../src/lib/auth";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

const json = { "content-type": "application/json" };

async function call(method: string, path: string, opts: { cookie?: string; body?: BodyInit; headers?: Record<string, string> } = {}) {
  const res = await fetch(BASE_URL + path, {
    method,
    redirect: "manual", // we want to SEE redirects, not follow them
    headers: { ...(opts.cookie ? { cookie: opts.cookie } : {}), ...opts.headers },
    body: opts.body,
  });
  return res;
}

function uploadBody(bytes: Uint8Array, filename: string, type: string) {
  const form = new FormData();
  form.append("file", new File([bytes as BlobPart], filename, { type }));
  return form;
}

async function main() {
  console.log("== Part 1: NOT logged in. Everything must be refused ==");

  for (const [method, path, body] of [
    ["POST", "/api/admin/products", "{}"],
    ["PUT", "/api/admin/products/anything", "{}"],
    ["DELETE", "/api/admin/products/anything", undefined],
    ["PUT", "/api/admin/settings", "{}"],
  ] as const) {
    const res = await call(method, path, { headers: json, body });
    check(`${method} ${path} -> 401`, res.status === 401, `got ${res.status}`);
  }
  const up = await call("POST", "/api/admin/upload", { body: uploadBody(new Uint8Array([0xff, 0xd8, 0xff]), "a.jpg", "image/jpeg") });
  check("POST /api/admin/upload -> 401", up.status === 401, `got ${up.status}`);

  for (const path of ["/admin", "/admin/products", "/admin/products/new", "/admin/orders", "/admin/settings"]) {
    const res = await call("GET", path);
    const where = res.headers.get("location") ?? "";
    check(`GET ${path} -> redirect to login`, res.status >= 300 && res.status < 400 && where.includes("/admin/login"), `got ${res.status} ${where}`);
  }

  // A made-up session cookie must not work either (the proxy lets it through to the page,
  // so this proves the page itself checks the session on the server).
  const fake = "better-auth.session_token=forged-value.forged-signature";
  const forgedApi = await call("POST", "/api/admin/products", { cookie: fake, headers: json, body: "{}" });
  check("forged session cookie on API -> 401", forgedApi.status === 401, `got ${forgedApi.status}`);
  const forgedPage = await call("GET", "/admin/orders", { cookie: fake });
  check("forged session cookie on page -> redirect to login", forgedPage.status >= 300 && forgedPage.status < 400 && (forgedPage.headers.get("location") ?? "").includes("/admin/login"), `got ${forgedPage.status}`);

  console.log("\n== Part 2: logged in as admin ==");
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("SKIP  ADMIN_EMAIL / ADMIN_PASSWORD not set. Run: pnpm create-admin");
  } else {
    const loginResponse = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
    const cookie = loginResponse.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    check("login produced a session cookie", cookie.includes("session_token"));

    const ok = await call("GET", "/admin", { cookie });
    check("GET /admin works when logged in", ok.status === 200, `got ${ok.status}`);
    const bad = await call("POST", "/api/admin/products", { cookie, headers: json, body: "{}" });
    check("POST /api/admin/products with {} -> 422 (validated, not 401)", bad.status === 422, `got ${bad.status}`);

    console.log("\n== Part 3: upload limits (Rule F9), logged in ==");
    const txt = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(new TextEncoder().encode("hello, not an image"), "notes.txt", "text/plain") });
    check("a .txt file is rejected", txt.status === 415, `got ${txt.status}`);

    const fakePng = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(new TextEncoder().encode("this is text pretending to be a png"), "evil.png", "image/png") });
    check("text renamed .png (type image/png) is rejected", fakePng.status === 415, `got ${fakePng.status}`);

    const svg = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'/>"), "x.svg", "image/svg+xml") });
    check("an SVG is rejected", svg.status === 415, `got ${svg.status}`);

    const gif = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(new TextEncoder().encode("GIF89a......"), "x.gif", "image/gif") });
    check("a GIF is rejected", gif.status === 415, `got ${gif.status}`);

    const big = new Uint8Array(3 * 1024 * 1024);
    big.set([0xff, 0xd8, 0xff]); // starts like a real JPEG, but is 3 MB
    const large = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(big, "big.jpg", "image/jpeg") });
    check("a 3 MB image is rejected (limit 2 MB)", large.status === 413, `got ${large.status}`);

    const noFile = await call("POST", "/api/admin/upload", { cookie, body: new FormData() });
    check("no file -> 400", noFile.status === 400, `got ${noFile.status}`);

    // A small, genuine PNG passes the checks. Without Cloudinary keys it then stops at 503.
    const png = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64"));
    const good = await call("POST", "/api/admin/upload", { cookie, body: uploadBody(png, "pixel.png", "image/png") });
    const expected = process.env.CLOUDINARY_API_SECRET ? 200 : 503;
    check("a real PNG passes the checks", good.status === expected, `got ${good.status}${expected === 503 ? " (503 = checks passed, Cloudinary keys not set)" : ""}`);
  }

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Test script crashed:", (error as Error).message);
  process.exit(1);
});
