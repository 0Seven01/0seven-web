/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";

const defaultRuntimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // ── Cloudinary product images — Cache-first ───────────────
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // ── Fall back to next-pwa's bulletproof defaults for App Router ──
    ...defaultRuntimeCaching,
  ],
});

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

module.exports = withPWA(nextConfig);
