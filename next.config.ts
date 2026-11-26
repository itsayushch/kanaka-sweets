import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Make sure Vercel ships Prisma's query engine files with every route (including /api/* and /admin/*).
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
    "/api/**/*": ["./src/generated/prisma/**/*"],
    "/admin/**/*": ["./src/generated/prisma/**/*"],
  },
  poweredByHeader: false, // don't advertise the framework
  // Basic hardening headers on every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" }, // browsers must trust our content types
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // other sites can't frame ours (clickjacking)
        ],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Keep Supabase pooler connections low during static build prerendering.
    staticGenerationMaxConcurrency: 2,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
