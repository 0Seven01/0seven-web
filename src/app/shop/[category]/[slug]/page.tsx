import { listCategories, listProducts, getProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }: Props) {
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
    <main>
      <h1>{product.name}</h1>
      {product.scriptureRef && <p>{product.scriptureRef}</p>}
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </main>
  );
}
