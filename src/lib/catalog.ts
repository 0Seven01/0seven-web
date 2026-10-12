import { CATEGORIES, PRODUCTS } from "../data/catalog.ts";
import type { Category, Product } from "../types/catalog.ts";

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES.filter((c) => c.active && !c.comingSoon);
}

export async function getCategory(slug: string): Promise<Category | null> {
  return (
    CATEGORIES.find((c) => c.slug === slug && c.active && !c.comingSoon) ?? null
  );
}

export async function listProducts(categorySlug?: string): Promise<Product[]> {
  const activeCategories = new Set(
    CATEGORIES.filter((c) => c.active && !c.comingSoon).map((c) => c.slug)
  );
  if (categorySlug && !activeCategories.has(categorySlug)) {
    return [];
  }
  return PRODUCTS.filter(
    (p) =>
      p.active &&
      activeCategories.has(p.categorySlug) &&
      (!categorySlug || p.categorySlug === categorySlug)
  );
}

export async function getProduct(
  categorySlug: string,
  productSlug: string
): Promise<Product | null> {
  const category = await getCategory(categorySlug);
  if (!category) return null;
  return (
    PRODUCTS.find(
      (p) => p.categorySlug === categorySlug && p.slug === productSlug && p.active
    ) ?? null
  );
}
