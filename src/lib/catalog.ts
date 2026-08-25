import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import type { Category, Product } from "@/types/catalog";

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES.filter((c) => !c.comingSoon);
}

export async function getCategory(slug: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function listProducts(categorySlug?: string): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) => p.active && (!categorySlug || p.categorySlug === categorySlug)
  );
}

export async function getProduct(
  categorySlug: string,
  productSlug: string
): Promise<Product | null> {
  return (
    PRODUCTS.find(
      (p) => p.categorySlug === categorySlug && p.slug === productSlug && p.active
    ) ?? null
  );
}
