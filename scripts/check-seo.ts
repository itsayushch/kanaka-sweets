/**
 * Checks the SEO rules E1 to E8 on every page in the sitemap.
 *
 *   pnpm check:seo        (a server must be running; BASE_URL defaults to :3000)
 *
 * It reads the HTML exactly as a search engine or WhatsApp would receive it
 * (no JavaScript), so it also proves the content is rendered on the server (E7).
 * It does NOT replace Google's Rich Results Test (E6) or pasting a link into
 * WhatsApp (E8): do those two by hand too.
 */
export {};

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
let failures = 0;
function check(name: string, problems: string[]) {
  const ok = problems.length === 0;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const p of problems.slice(0, 12)) console.log("        " + p);
  if (problems.length > 12) console.log(`        ...and ${problems.length - 12} more`);
  if (!ok) failures++;
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const stripTags = (s: string) => decode(s.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

interface Page {
  path: string;
  html: string;
  title: string;
  description: string;
  headings: { level: number; text: string }[];
  images: { alt: string | null; src: string }[];
  og: Record<string, string>;
  jsonLd: unknown[];
}

function parse(path: string, html: string): Page {
  const title = decode(/<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "").trim();
  const description = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "").trim();
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ level: Number(m[1]), text: stripTags(m[2]) }));
  const images = [...html.matchAll(/<img\b([^>]*)>/g)].map((m) => ({
    alt: /\balt="([^"]*)"/.exec(m[1])?.[1] ?? null,
    src: /\bsrc="([^"]*)"/.exec(m[1])?.[1] ?? "",
  }));
  const og: Record<string, string> = {};
  for (const m of html.matchAll(/<meta property="(og:[a-z:_]+)" content="([^"]*)"/g)) og[m[1]] = decode(m[2]);
  const jsonLd: unknown[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { jsonLd.push(JSON.parse(m[1])); } catch { jsonLd.push({ parseError: true }); }
  }
  return { path, html, title, description, headings, images, og, jsonLd };
}

async function main() {
  const sitemapXml = await (await fetch(BASE_URL + "/sitemap.xml")).text();
  const paths = [...sitemapXml.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)?<\/loc>/g)].map((m) => m[1] || "/");
  console.log(`Checking ${paths.length} pages from /sitemap.xml\n`);

  const pages: Page[] = [];
  for (const path of paths) pages.push(parse(path, await (await fetch(BASE_URL + path)).text()));

  // E1 + E2: own URLs, clean and readable.
  console.log("== E1 / E2: separate, clean URLs ==");
  const products = pages.filter((p) => p.path.split("/").length === 3);
  const categories = pages.filter((p) => ["/sweets", "/cakes", "/snacks", "/festival-boxes"].includes(p.path));
  check("home, all 4 categories and at least 20 product pages each have their own URL",
    [pages.some((p) => p.path === "/") ? "" : "no home", categories.length >= 4 ? "" : `only ${categories.length} category pages`, products.length >= 20 ? "" : `only ${products.length} product pages`].filter(Boolean));
  check("every URL is lowercase words and dashes, like /sweets/kaju-katli", pages.filter((p) => !/^\/([a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)?)?$/.test(p.path)).map((p) => p.path));
  check("every page answers with real content (not a Not Found page)", pages.filter((p) => /Not Found/.test(p.title) || p.headings.length === 0).map((p) => p.path));

  // E3
  console.log("\n== E3: unique title and description ==");
  const dup = (key: "title" | "description") => {
    const seen = new Map<string, string[]>();
    for (const p of pages) seen.set(p[key], [...(seen.get(p[key]) ?? []), p.path]);
    return [...seen].filter(([text, list]) => list.length > 1 || !text).map(([text, list]) => `${text ? "shared by" : "missing on"} ${list.join(", ")}${text ? `: "${text.slice(0, 60)}"` : ""}`);
  };
  check("every page has its own <title>", dup("title"));
  check("every page has its own meta description", dup("description"));
  check("titles are not too long (60 characters or fewer is safest)", pages.filter((p) => p.title.length > 70).map((p) => `${p.path}: ${p.title.length} characters`));
  check("descriptions are a sensible length (50 to 170 characters)", pages.filter((p) => p.description.length < 50 || p.description.length > 170).map((p) => `${p.path}: ${p.description.length} characters`));

  // E4
  console.log("\n== E4: one H1 per page, headings in order ==");
  check("exactly one H1 on every page", pages.filter((p) => p.headings.filter((h) => h.level === 1).length !== 1).map((p) => `${p.path}: ${p.headings.filter((h) => h.level === 1).length} h1`));
  const skips: string[] = [];
  for (const p of pages) {
    let prev = 0;
    for (const h of p.headings) {
      if (h.level > prev + 1) { skips.push(`${p.path}: h${prev || "(none)"} then h${h.level} ("${h.text.slice(0, 40)}")`); break; }
      prev = h.level;
    }
  }
  check("no skipped heading levels (an h2 is never followed straight by an h4)", skips);

  // E5
  console.log("\n== E5: sitemap and robots ==");
  const robots = await (await fetch(BASE_URL + "/robots.txt")).text();
  check("robots.txt exists and points to the sitemap", [/User-Agent: \*/i.test(robots) ? "" : "no User-Agent rule", /Sitemap: https?:\/\/\S+\/sitemap\.xml/i.test(robots) ? "" : "no Sitemap line"].filter(Boolean));
  check("sitemap lists the home page, categories and products", [paths.includes("/") ? "" : "home missing", categories.length >= 4 ? "" : "categories missing", products.length >= 20 ? "" : "products missing"].filter(Boolean));
  check("sitemap does not list pages that are noindex or private (cart, checkout, admin, order)", paths.filter((p) => /^\/(cart|checkout|admin|order|api)/.test(p)));

  // E6 + E7
  console.log("\n== E6: product structured data / E7: content rendered on the server ==");
  const e6: string[] = [];
  const e7: string[] = [];
  for (const p of products) {
    const product = p.jsonLd.flat().find((j) => (j as { "@type"?: string })["@type"] === "Product") as
      | { name?: string; image?: unknown; offers?: { price?: unknown; lowPrice?: unknown; priceCurrency?: string; availability?: string } | { price?: unknown; lowPrice?: unknown; priceCurrency?: string; availability?: string }[] }
      | undefined;
    if (!product) { e6.push(`${p.path}: no Product JSON-LD`); continue; }
    const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    const missing = [!product.name && "name", !product.image && "image", !(offer?.price ?? offer?.lowPrice) && "price", !offer?.priceCurrency && "priceCurrency", !offer?.availability && "availability"].filter(Boolean);
    if (missing.length) e6.push(`${p.path}: missing ${missing.join(", ")}`);
    const visible = stripTags(p.html);
    if (product.name && !visible.includes(product.name)) e7.push(`${p.path}: product name not in the HTML text`);
    if (!/₹\s?\d/.test(visible)) e7.push(`${p.path}: no price in the HTML text`);
  }
  check("every product page has Product JSON-LD with name, image, price, currency and availability", e6);
  check("product names and prices are in the HTML a server sends (no JavaScript needed)", e7);
  check("category pages list their products in the HTML", categories.filter((c) => !/₹\s?\d/.test(stripTags(c.html))).map((c) => c.path));

  // E8
  console.log("\n== E8: image alt text and link previews ==");
  const noAlt: string[] = [];
  for (const p of pages) {
    const bad = p.images.filter((i) => i.alt === null || (i.alt.trim() === "" && !/aria-hidden/.test(i.src)));
    if (bad.length) noAlt.push(`${p.path}: ${bad.length} image(s) with missing or empty alt`);
  }
  check("every image has alt text", noAlt);
  const weak: string[] = [];
  for (const p of pages) for (const i of p.images) if (i.alt && /^(image|photo|picture|img|banner)\s*\d*$/i.test(i.alt.trim())) weak.push(`${p.path}: alt "${i.alt}"`);
  check("alt text is meaningful (not just 'image' or 'photo')", weak);
  check("every page has an Open Graph title, description and image for link previews", pages.filter((p) => !p.og["og:title"] || !p.og["og:description"] || !p.og["og:image"]).map((p) => `${p.path}: missing ${["og:title", "og:description", "og:image"].filter((k) => !p.og[k]).join(", ")}`));
  check("Open Graph image addresses are full https URLs", pages.filter((p) => p.og["og:image"] && !/^https:\/\//.test(p.og["og:image"])).map((p) => `${p.path}: ${p.og["og:image"]}`));

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("check-seo crashed:", (error as Error).message);
  process.exit(1);
});
