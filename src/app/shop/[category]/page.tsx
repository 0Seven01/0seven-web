import { listCategories, listProducts, getCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  return { title: `${cat.name} — 0Seven`, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const products = await listProducts(category);

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--color-accent)] rounded-md mb-5">
        <h1 className="text-base font-bold text-[var(--color-accent-fg)] m-0">
          {cat.name}
        </h1>
        <span className="text-[0.78rem] text-[var(--color-accent-fg)] opacity-85">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Wrap grid — same card size, wraps to new rows */}
      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
