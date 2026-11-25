/**
 * Small SEO helpers.
 */

/**
 * Trim text for a meta description. Search results and WhatsApp previews cut
 * long text, so keep it to about 155 characters, ending at a whole word.
 */
export function clip(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\-–—\s]+$/, "") + "…";
}
