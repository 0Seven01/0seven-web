import { listCategories, listProducts, getCategory } from "@/lib/catalog";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
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
    <main>
      <h1>{cat.name}</h1>
      <p>{cat.description}</p>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
}
