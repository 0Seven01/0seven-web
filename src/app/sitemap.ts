import type { MetadataRoute } from "next";
import { listCategories, listProducts } from "@/lib/catalog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://0seven.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await listCategories();
  const products = await listProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          priority: 1.0,  changeFrequency: "weekly" },
    { url: `${BASE}/shop`,                priority: 0.9,  changeFrequency: "daily"  },
    { url: `${BASE}/footwear`,            priority: 0.8,  changeFrequency: "monthly" },
    { url: `${BASE}/about`,              priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE}/size-guide`,         priority: 0.5,  changeFrequency: "monthly" },
    { url: `${BASE}/faqs`,               priority: 0.5,  changeFrequency: "monthly" },
    { url: `${BASE}/shipping-returns`,   priority: 0.5,  changeFrequency: "monthly" },
    { url: `${BASE}/contact`,            priority: 0.4,  changeFrequency: "monthly" },
    { url: `${BASE}/cart`,               priority: 0.3,  changeFrequency: "never"   },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/shop/${cat.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/shop/${p.categorySlug}/${p.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
