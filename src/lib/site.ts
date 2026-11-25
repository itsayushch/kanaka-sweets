/**
 * The public address of the website (no trailing slash).
 * Set NEXT_PUBLIC_APP_URL in .env / Vercel to your real domain. It is used for
 * link previews (Open Graph), the sitemap and robots.txt.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://kanaka-sweets.vercel.app"
).replace(/\/$/, "");
