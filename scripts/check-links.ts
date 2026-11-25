/**
 * Finds broken links and dead images on the site (helps Rules A6, E1, G1).
 *
 *   pnpm check:links        (a server must be running; BASE_URL defaults to :3000)
 *
 * It reads the sitemap, opens every page, collects every internal link and every
 * image (including the ones next/image serves), and checks each one.
 * Unknown pages here answer HTTP 200 with a "Not Found" page (a framework
 * behaviour with Cache Components), so a page counts as broken if its content
 * says "Not Found" and it carries noindex.
 */
// (makes this file its own module so its names do not clash with other scripts)
export {};

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const isNotFoundPage = (status: number, html: string) =>
  status === 404 || (/<meta name="robots" content="noindex"/.test(html) && /Not Found|404/.test(html.slice(0, 60000).replace(/<script[\s\S]*?<\/script>/g, "")));

async function get(path: string) {
  const res = await fetch(BASE_URL + path, { redirect: "manual" });
  return { status: res.status, html: res.headers.get("content-type")?.includes("html") ? await res.text() : "" };
}

async function main() {
  // 1. Pages to crawl: the sitemap plus a few fixed ones.
  const sitemap = await (await fetch(BASE_URL + "/sitemap.xml")).text();
  const sitemapPaths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  const pages = [...new Set(["/", "/cart", "/checkout", "/admin/login", ...sitemapPaths])];
  console.log(`Crawling ${pages.length} pages...`);

  const internalLinks = new Map<string, string>(); // link -> first page it was seen on
  const images = new Map<string, string>(); // image src -> page
  const brokenPages: string[] = [];

  for (const page of pages) {
    const { status, html } = await get(page);
    if (isNotFoundPage(status, html)) brokenPages.push(`${page} (listed in the sitemap or fixed list but shows Not Found)`);
    for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const href = m[1].replace(/\/$/, "") || "/";
      if (!/^\/(_next|api)\b/.test(href) && !internalLinks.has(href)) internalLinks.set(href, page);
    }
    for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      const src = m[1].replace(/&amp;/g, "&");
      if (!images.has(src)) images.set(src, page);
    }
  }

  // 2. Internal links.
  const brokenLinks: string[] = [];
  for (const [link, from] of internalLinks) {
    const { status, html } = await get(link);
    if (isNotFoundPage(status, html)) brokenLinks.push(`${link}   (linked from ${from})`);
  }

  // 3. Images: the URLs the page actually asks the browser to load.
  const brokenImages: string[] = [];
  for (const [src, from] of images) {
    if (src.startsWith("data:")) continue;
    const url = src.startsWith("http") ? src : BASE_URL + src;
    const res = await fetch(url, { method: "GET" }).catch(() => null);
    if (!res || !res.ok) {
      const shown = decodeURIComponent(src).replace(/^.*url=/, "").slice(0, 90);
      brokenImages.push(`${res?.status ?? "no response"}  ${shown}   (on ${from})`);
    }
  }

  console.log(`\nLinks checked: ${internalLinks.size}   Images checked: ${images.size}`);
  const report = (title: string, rows: string[]) => {
    console.log(`\n${rows.length === 0 ? "PASS" : "FAIL"}  ${title}`);
    rows.forEach((r) => console.log("      " + r));
  };
  report("every page in the sitemap exists", brokenPages);
  report("every internal link goes to a real page", brokenLinks);
  report("every image loads", brokenImages);

  const failed = brokenPages.length + brokenLinks.length + brokenImages.length;
  console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} problem(s) found.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("check-links crashed:", (error as Error).message);
  process.exit(1);
});
