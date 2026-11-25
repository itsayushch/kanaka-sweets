/**
 * Proves the admin panel really changes the shop (Rules A5, F6, F7 and the
 * Brief's admin section): add / edit / remove products, prices, sizes, stock,
 * and the festival highlight switch.
 *
 *   pnpm test:admin-crud     (a server must be running; BASE_URL defaults to :3000)
 *
 * It logs in as the admin from .env (never printing the password), calls the
 * real /api/admin endpoints, checks the PUBLIC pages change, and then deletes
 * everything it created and restores the festival settings.
 */
import "./lib/local-db-only"; // must stay first: blocks runs against a live database
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
}

// A random IP for this run, so the rate limit (Rule F8) is not tripped by earlier runs.
const TEST_IP = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

let cookie = "";
const api = async (method: string, path: string, body?: unknown) => {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { cookie, ...(body === undefined ? {} : { "content-type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data } as { status: number; data: Record<string, unknown> };
};
const page = async (path: string) => {
  const res = await fetch(BASE_URL + path);
  return { status: res.status, html: await res.text() };
};

/**
 * Shop pages are cached and refresh a moment after an admin saves: the first
 * request right after a save can still see the old page and triggers the
 * refresh. So wait (up to 10 s) until the page matches instead of checking once.
 */
async function eventually(path: string, matches: (html: string, status: number) => boolean) {
  const end = Date.now() + 10000;
  let last = { status: 0, html: "" };
  while (Date.now() < end) {
    last = await page(path);
    if (matches(last.html, last.status)) return { ok: true, ...last };
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return { ok: false, ...last };
}

const IMG = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80";
const SLUG = "zz-test-barfi";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL / ADMIN_PASSWORD (run pnpm create-admin)");
  const login = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
  cookie = login.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "sweets" } });
  const savedSettings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: "global" } });
  const productIds: string[] = [];

  try {
    console.log("== Validation (Rule F6): bad input is refused, errors point at the field ==");
    const bad = await api("POST", "/api/admin/products", {
      name: "", description: "short", categoryId: category.id, image: "http://evil.example.com/x.png",
      isFeatured: false, isBestForGifting: false, isActive: true,
      variants: [{ name: "250g", price: -5, stock: -1 }],
    });
    const paths = ((bad.data.issues ?? []) as { path: string }[]).map((i) => i.path);
    check("bad product -> 422", bad.status === 422, `got ${bad.status}`);
    check("errors name the exact fields (name, description, image, variants.0.price, variants.0.stock)",
      ["name", "description", "image", "variants.0.price", "variants.0.stock"].every((p) => paths.includes(p)), paths.join(", "));
    const noSizes = await api("POST", "/api/admin/products", { name: "No Sizes", description: "A product with no sizes at all", categoryId: category.id, image: IMG, isFeatured: false, isBestForGifting: false, isActive: true, variants: [] });
    check("a product with no sizes -> 422", noSizes.status === 422, `got ${noSizes.status}`);

    console.log("\n== Add a product ==");
    const payload = {
      name: "ZZ Test Barfi", slug: SLUG, description: "A test sweet created by the admin test script.",
      categoryId: category.id, image: IMG, isFeatured: false, isBestForGifting: true, isActive: true,
      variants: [
        { name: "250g", weight: "250g", price: 250, stock: 10 },
        { name: "500g", weight: "500g", price: 480, stock: 0 },
      ],
    };
    const created = await api("POST", "/api/admin/products", payload);
    check("valid product -> 201", created.status === 201, `got ${created.status}`);
    const productId = created.data.id as string;
    productIds.push(productId);

    let p = await eventually(`/sweets/${SLUG}`, (h, st) => st === 200 && h.includes("ZZ Test Barfi") && h.includes("250"));
    check("new product page is live with its name and price", p.ok, `status ${p.status}`);
    const list = await eventually("/sweets", (h) => h.includes("ZZ Test Barfi"));
    check("new product appears in the Sweets list", list.ok);
    const dup = await api("POST", "/api/admin/products", payload);
    check("same web address again -> 409", dup.status === 409, `got ${dup.status}`);

    console.log("\n== Edit price, sizes and stock ==");
    const sizes = await prisma.productVariant.findMany({ where: { productId }, orderBy: { price: "asc" } });
    const edit = (v250: { price: number; stock: number }, extra: object[] = []) => ({
      ...payload,
      variants: [
        { id: sizes[0].id, name: "250g", weight: "250g", ...v250 },
        { id: sizes[1].id, name: "500g", weight: "500g", price: 480, stock: 0 },
        ...extra,
      ],
    });
    const e1 = await api("PUT", `/api/admin/products/${productId}`, edit({ price: 299, stock: 7 }, [{ name: "1kg", weight: "1kg", price: 900, stock: 5 }]));
    check("edit price + add a size -> 200", e1.status === 200, `got ${e1.status}`);
    p = await eventually(`/sweets/${SLUG}`, (h) => h.includes("299") && h.includes("1kg"));
    check("product page shows the NEW price (299) and the new size (1kg)", p.ok);
    const listNew = await eventually("/sweets", (h) => h.includes("299"));
    check("the Sweets list shows the new price too", listNew.ok);

    console.log("\n== Stock 0 means it can't be ordered (Rule F7) ==");
    const e2 = await api("PUT", `/api/admin/products/${productId}`, {
      ...payload,
      variants: (await prisma.productVariant.findMany({ where: { productId }, orderBy: { price: "asc" } })).map((v) => ({ id: v.id, name: v.name, weight: v.weight ?? "", price: v.price, stock: 0 })),
    });
    check("set all stock to 0 -> 200", e2.status === 200);
    p = await eventually(`/sweets/${SLUG}`, (h) => /out of stock|sold out/i.test(h));
    check("product page shows out of stock", p.ok);
    const v0 = await prisma.productVariant.findFirstOrThrow({ where: { productId }, orderBy: { price: "asc" } });
    const tomorrow = new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const orderBody = (qty: number) => ({
      customerName: "Crud Test", customerPhone: "9876543210", customerEmail: "crud@example.com",
      fulfillmentType: "PICKUP", pickupDate: tomorrow, pickupTimeSlot: "11:00 AM - 1:00 PM",
      items: [{ productId, variantId: v0.id, quantity: qty }],
    });
    const blocked = await fetch(BASE_URL + "/api/checkout", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": TEST_IP }, body: JSON.stringify(orderBody(1)) });
    check("ordering a stock-0 size is refused (409)", blocked.status === 409, `got ${blocked.status}`);

    console.log("\n== Order history is protected ==");
    await api("PUT", `/api/admin/products/${productId}`, { ...payload, variants: [{ id: v0.id, name: v0.name, weight: v0.weight ?? "", price: v0.price, stock: 5 }] });
    const ok = await fetch(BASE_URL + "/api/checkout", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": TEST_IP }, body: JSON.stringify(orderBody(1)) });
    check("with stock restored, an order is accepted (201)", ok.status === 201, `got ${ok.status}`);
    const del1 = await api("PUT", `/api/admin/products/${productId}`, { ...payload, variants: [{ name: "New only", price: 100, stock: 1 }] });
    check("deleting a size that has orders -> 409", del1.status === 409, `${del1.status} ${del1.data.error}`);
    const foreign = await api("PUT", `/api/admin/products/${productId}`, { ...payload, variants: [{ id: "someone-elses-size", name: "x", price: 10, stock: 1 }] });
    check("a size id from another product -> 422", foreign.status === 422, `got ${foreign.status}`);
    const arch = await api("DELETE", `/api/admin/products/${productId}`);
    check("deleting a product that has orders HIDES it instead", arch.status === 200 && arch.data.archived === true, JSON.stringify(arch.data));
    check("hidden product row still exists (isActive false)", (await prisma.product.findUnique({ where: { id: productId } }))?.isActive === false);
    p = await eventually(`/sweets/${SLUG}`, (h) => !h.includes("ZZ Test Barfi</h1>") && /not found/i.test(h));
    check("hidden product is gone from the shop", p.ok);

    console.log("\n== Remove a product with no orders ==");
    const c2 = await api("POST", "/api/admin/products", { ...payload, name: "ZZ Remove Me", slug: "zz-remove-me" });
    productIds.push(c2.data.id as string);
    const del2 = await api("DELETE", `/api/admin/products/${c2.data.id}`);
    check("delete -> 200, really removed", del2.status === 200 && del2.data.archived === false && !(await prisma.product.findUnique({ where: { id: String(c2.data.id) } })));
    check("unknown product id -> 404", (await api("DELETE", "/api/admin/products/does-not-exist")).status === 404);

    console.log("\n== Festival highlight on the home page (Rule A5) ==");
    const settings = (over: object) => ({
      festivalHighlightActive: true, festivalHighlightTitle: "ZZ Festival Title", festivalHighlightSubtitle: "ZZ subtitle line",
      festivalHighlightText: "ZZ festival text for the home page.", festivalHighlightImage: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
      festivalHighlightDiscount: "ZZ offer line", ...over,
    });
    const on = await api("PUT", "/api/admin/settings", settings({}));
    check("save settings -> 200", on.status === 200, `got ${on.status}`);
    const homeOn = await eventually("/", (h) => ["ZZ Festival Title", "ZZ subtitle line", "ZZ festival text", "ZZ offer line"].every((t) => h.includes(t)));
    check("home shows the edited title, subtitle, text and offer", homeOn.ok);
    check("home shows the edited festival image", homeOn.html.includes(encodeURIComponent("photo-1599488615731-7e5c2823ff28")));
    const off = await api("PUT", "/api/admin/settings", settings({ festivalHighlightActive: false }));
    const homeOff = await eventually("/", (h) => !h.includes('id="festival-heading"') && !h.includes("ZZ Festival Title"));
    check("switch OFF -> festival section is gone from the home page", off.status === 200 && homeOff.ok);
    await api("PUT", "/api/admin/settings", settings({ festivalHighlightActive: true }));
    const homeBack = await eventually("/", (h) => h.includes('id="festival-heading"'));
    check("switch back ON -> it returns", homeBack.ok);
    const badImg = await api("PUT", "/api/admin/settings", settings({ festivalHighlightImage: "javascript:alert(1)" }));
    check("a javascript: image link is refused (422)", badImg.status === 422, `got ${badImg.status}`);
    const emptyTitle = await api("PUT", "/api/admin/settings", settings({ festivalHighlightTitle: "" }));
    check("empty title is refused (422)", emptyTitle.status === 422, `got ${emptyTitle.status}`);
  } finally {
    // Clean up everything this script created and put the festival settings back.
    await prisma.order.deleteMany({ where: { items: { some: { productId: { in: productIds } } } } });
    await prisma.product.deleteMany({ where: { id: { in: productIds } } });
    await prisma.siteSettings.update({
      where: { id: "global" },
      data: {
        festivalHighlightActive: savedSettings.festivalHighlightActive,
        festivalHighlightTitle: savedSettings.festivalHighlightTitle,
        festivalHighlightSubtitle: savedSettings.festivalHighlightSubtitle,
        festivalHighlightText: savedSettings.festivalHighlightText,
        festivalHighlightImage: savedSettings.festivalHighlightImage,
        festivalHighlightDiscount: savedSettings.festivalHighlightDiscount,
      },
    });
    await fetch(BASE_URL + "/api/admin/settings", {
      method: "PUT", headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({
        festivalHighlightActive: savedSettings.festivalHighlightActive, festivalHighlightTitle: savedSettings.festivalHighlightTitle,
        festivalHighlightSubtitle: savedSettings.festivalHighlightSubtitle, festivalHighlightText: savedSettings.festivalHighlightText,
        festivalHighlightImage: savedSettings.festivalHighlightImage, festivalHighlightDiscount: savedSettings.festivalHighlightDiscount ?? "",
      }),
    }).catch(() => undefined); // also refreshes the cached home page
    await prisma.$disconnect();
  }

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Test script crashed:", (error as Error).message);
  process.exit(1);
});
