import { listProducts, listCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop — 0Seven",
  description: "Browse all 0Seven faith-inspired apparel.",
};

export default async function ShopPage() {
  const categories = await listCategories();
  const allProducts = await listProducts();

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-6 min-h-screen">
      <h1 className="text-[var(--color-text-primary)] text-2xl font-bold mb-8">
        Shop
      </h1>

      {categories.map((cat) => {
        const products = allProducts.filter(
          (p) => p.categorySlug === cat.slug
        );
        if (products.length === 0) return null;

        return (
          <section key={cat.slug} className="mb-10">
            {/* Section header */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--color-accent)] rounded-t-md mb-[1px]">
              <h2 className="text-[0.95rem] font-bold text-[var(--color-accent-fg)] m-0">
                {cat.name}
              </h2>
              <Link
                href={`/shop/${cat.slug}`}
                className="text-[0.78rem] text-[var(--color-accent-fg)] no-underline font-semibold opacity-90 hover:opacity-100 transition-opacity"
              >
                See All →
              </Link>
            </div>

            {/* Horizontal scroll row */}
            <div className="flex gap-3 overflow-x-auto p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-b-md no-scrollbar">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
