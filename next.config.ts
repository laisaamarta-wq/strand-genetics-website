import type { NextConfig } from "next";

/**
 * Default: a normal Next.js app (`npm run dev` / `npm run build && npm start`).
 * PREVIEW=1 produces a static export used only to make the single-file preview
 * (scripts/build-preview.mjs). Nothing here deploys anywhere.
 */
const preview = process.env.PREVIEW === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    unoptimized: preview,
  },
  ...(preview ? { output: "export" as const, distDir: "out-preview" } : {}),
};

export default nextConfig;
