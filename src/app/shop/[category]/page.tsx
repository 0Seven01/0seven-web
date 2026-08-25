import { listCategories, listProducts, getCategory } from "@/lib/catalog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.name} — 0Seven`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  const products = await listProducts(category);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{cat.name}</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">{cat.description}</p>
        
        <pre className="bg-[var(--color-surface)] p-6 rounded-lg overflow-x-auto border border-[var(--color-border)] text-sm shadow-sm">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>
    </main>
  );
}
