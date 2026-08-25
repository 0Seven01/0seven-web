import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // ── App shell: HTML navigation — Cache-first ──────────────
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
        networkTimeoutSeconds: 10,
      },
    },
    // ── Product pages — Stale-while-revalidate ────────────────
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/shop"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "product-pages",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 3 },
      },
    },
    // ── Cart page — always cached ─────────────────────────────
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname === "/cart",
      handler: "CacheFirst",
      options: {
        cacheName: "cart-page",
        expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
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
    // ── Next.js static assets — Cache-first ──────────────────
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    // ── Next.js image optimisation ────────────────────────────
    {
      urlPattern: /\/_next\/image\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

module.exports = withPWA(nextConfig);
