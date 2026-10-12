import Link from "next/link";
import type { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ProductCard } from "@/components/ProductCard";
import { PreorderBanner } from "@/components/PreorderBanner";

export const metadata: Metadata = {
  title: "0Seven — Faith-Inspired Apparel",
  description:
    "Nigerian DTC faith-inspired apparel. T-Shirts. Order on WhatsApp.",
};

export default async function HomePage() {
  const categories = await listCategories();
  const featured = (await listProducts()).filter((p) => p.featured);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <PreorderBanner />

      {/* Hero */}
      <section data-section="hero" className="py-24 px-4 text-center flex flex-col items-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-text-primary)]">Wear Your Faith.</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl">
          Faith-inspired apparel made for the streets of Lagos and beyond.
        </p>
        <Link href="/shop">
          <Button variant="accent" size="lg">Shop Now</Button>
        </Link>
      </section>

      {/* Categories */}
      <section data-section="categories" className="py-16 px-4 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div
            className={
              categories.length === 1
                ? "flex justify-center max-w-xs mx-auto"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            }
          >
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`} className="block w-full">
                <Card variant="elevated" padding="md" className="text-center hover:border-[var(--color-accent)] transition-colors cursor-pointer h-full flex items-center justify-center min-h-[56px]">
                  <span className="font-semibold">{cat.name}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section data-section="featured" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Community Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section data-section="brand-story" className="py-20 px-4 bg-[var(--color-surface)] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">More Than Clothing</h2>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            0Seven was born out of faith and community. Every piece carries a
            scripture — a reminder of who you are and whose you are.
          </p>
        </div>
      </section>

      {/* Footwear teaser */}
      <section data-section="footwear-teaser" className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Handmade Footwear — Coming Soon</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Crafted by hand. Rooted in faith. Join the waitlist.</p>
          <a href="/footwear">
            <Button variant="secondary">Join Waitlist</Button>
          </a>
        </div>
      </section>

      {/* Email capture */}
      <section data-section="email-capture" className="py-20 px-4 bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Get 10% Off Your First Order</h2>
          <p className="mb-8 opacity-90">Join the community. We&apos;ll send your discount straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <Input type="email" placeholder="your@email.com" required className="flex-1 bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border-transparent" />
            <Button type="submit" variant="primary" className="bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]">Claim 10% Off</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
