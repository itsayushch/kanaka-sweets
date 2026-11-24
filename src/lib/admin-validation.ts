/**
 * Zod schemas for everything the admin sends (Rule F6).
 * Used on the server in every /api/admin handler.
 */
import { z } from "zod";

/** Image hosts we allow, matching images.remotePatterns in next.config.ts. */
const ALLOWED_IMAGE_HOSTS = ["images.unsplash.com", "res.cloudinary.com"];

/** An image is either a local path ("/images/x.webp") or https from an allowed host. */
export const imageSchema = z
  .string({ error: "Add an image" })
  .trim()
  .min(1, "Add an image")
  .max(500, "Image address is too long")
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(url.hostname);
    } catch {
      return false;
    }
  }, "Upload an image, or use an https link from images.unsplash.com or res.cloudinary.com");

/** Make a URL-friendly slug: "Kaju Katli!" becomes "kaju-katli". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const variantSchema = z.object({
  id: z.string().min(1).max(64).optional(), // present when editing an existing size
  name: z.string().trim().min(1, "Enter a size name").max(60),
  weight: z.string().trim().max(40).optional(),
  price: z
    .number({ error: "Enter a price" })
    .int("Price must be a whole number of rupees")
    .min(1, "Price must be at least ₹1")
    .max(100000, "Price is too high"),
  stock: z
    .number({ error: "Enter stock" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(100000, "Stock is too high"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name").max(100),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().min(10, "Write a short description (10+ characters)").max(1000),
  categoryId: z.string().min(1, "Choose a category").max(64),
  image: imageSchema,
  isFeatured: z.boolean(),
  isBestForGifting: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1, "Add at least one size").max(12),
});

export type ProductInput = z.infer<typeof productSchema>;

export const settingsSchema = z.object({
  festivalHighlightActive: z.boolean(),
  festivalHighlightTitle: z.string().trim().min(1, "Enter a title").max(80),
  festivalHighlightSubtitle: z.string().trim().max(160),
  festivalHighlightText: z.string().trim().min(1, "Enter the text").max(400),
  festivalHighlightImage: imageSchema,
  festivalHighlightDiscount: z.string().trim().max(160),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
