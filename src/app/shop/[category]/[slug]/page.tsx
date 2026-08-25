import { listCategories, listProducts, getProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams() {
  const categories = await listCategories();
  const params: { category: string; slug: string }[] = [];

  for (const cat of categories) {
    const products = await listProducts(cat.slug);
    for (const product of products) {
      params.push({ category: cat.slug, slug: product.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return {};
  return {
    title: `${product.name} — 0Seven`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
        {product.scriptureRef && (
          <p className="text-[var(--color-text-secondary)] font-semibold mb-8 uppercase tracking-widest text-sm">
            {product.scriptureRef}
          </p>
        )}
        <pre className="bg-[var(--color-surface)] p-6 rounded-lg overflow-x-auto border border-[var(--color-border)] text-sm shadow-sm">
          {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </main>
  );
}
