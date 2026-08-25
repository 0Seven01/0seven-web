import { listProducts, listCategories } from "@/lib/catalog";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Shop All — 0Seven",
  description: "Browse all 0Seven faith-inspired apparel.",
};

export default async function ShopPage() {
  const categories = await listCategories();
  const products = await listProducts();

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">All Products</h1>
        
        <nav className="flex flex-wrap gap-2 mb-10">
          <a href="/shop">
            <Badge variant="accent" className="px-4 py-1.5 text-sm cursor-pointer">All</Badge>
          </a>
          {categories.map((cat) => (
            <a key={cat.slug} href={`/shop/${cat.slug}`}>
              <Badge variant="primary" className="px-4 py-1.5 text-sm cursor-pointer bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border)]">{cat.name}</Badge>
            </a>
          ))}
        </nav>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <a key={p.id} href={`/shop/${p.categorySlug}/${p.slug}`} className="block">
              <Card variant="default" padding="md" className="hover:border-[var(--color-accent)] transition-colors h-full flex flex-col justify-between group">
                <div>
                  <div className="bg-[var(--color-surface-raised)] aspect-square w-full rounded-md mb-4 flex items-center justify-center text-[var(--color-text-muted)] group-hover:bg-[var(--color-surface)] transition-colors">
                    Image
                  </div>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                </div>
                <p className="text-[var(--color-text-secondary)] mt-2">₦{p.variants[0]?.priceKobo / 100}</p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
