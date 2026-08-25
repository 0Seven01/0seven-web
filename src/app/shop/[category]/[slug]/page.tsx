import { listCategories, listProducts, getProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/format";
import { ProductInteractive } from "@/components/ProductInteractive";
import type { Metadata } from "next";
import Link from "next/link";

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

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) return {};
  return { title: `${product.name} — 0Seven`, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();

  const lowestPrice = Math.min(...product.variants.map((v) => v.priceKobo));

  return (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-[var(--color-surface-raised)] rounded-lg border border-[var(--color-border)] flex items-center justify-center relative overflow-hidden group">
          <span className="text-5xl opacity-10 select-none font-bold tracking-widest group-hover:scale-105 transition-transform duration-500">0VII</span>
        </div>

        {/* Product info + interactive */}
        <div className="flex flex-col gap-5 sticky top-[100px]">
          {product.scriptureRef && (
            <div><Badge variant="muted">{product.scriptureRef}</Badge></div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-[1.75rem] md:text-3xl font-bold text-[var(--color-text-primary)] m-0 leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-[var(--color-accent)] m-0">
              {formatNaira(lowestPrice)}
            </p>
          </div>
          <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-relaxed m-0">
            {product.description}
          </p>

          <hr className="border-[var(--color-border)] w-full my-2" />

          {/* Colour + Size + AddToCart — client component */}
          <ProductInteractive product={product} />
        </div>
      </div>
    </div>
  );
}
