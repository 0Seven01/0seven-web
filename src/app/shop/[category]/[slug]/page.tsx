import { listCategories, listProducts, getProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { ProductInteractive } from "@/components/ProductInteractive";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductJsonLd } from "@/components/ProductJsonLd";

type Props = { params: Promise<{ category: string; slug: string }> };

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
    title: product.name,
    description: `${product.description}${product.scriptureRef ? ` — ${product.scriptureRef}` : ""}`,
    openGraph: {
      title: `${product.name} — 0Seven`,
      description: product.description,
      url: `/shop/${category}/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — 0Seven`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://0seven.vercel.app";

  return (
    <>
      <ProductJsonLd product={product} baseUrl={baseUrl} />
      <div className="max-w-[1200px] mx-auto py-8 px-6 min-h-screen">
        {/* Breadcrumb */}
        <nav className="mb-6 text-[0.85rem] text-[var(--color-text-muted)] flex gap-2 items-center">
          <Link href="/shop" className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-text-primary)] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${category}`} className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-text-primary)] transition-colors">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)] font-medium truncate">{product.name}</span>
        </nav>

        {/* Gallery and interactive selectors */}
        <ProductInteractive product={product} />
      </div>
    </>
  );
}
