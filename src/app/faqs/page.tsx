import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about ordering, sizing, and delivery.",
  openGraph: {
    title: "FAQs — 0Seven",
    description: "Frequently asked questions about ordering, sizing, and delivery.",
    url: "/faqs",
  },
};

const FAQS = [
  { q: "How do I place an order?", a: "Add items to your cart, then tap 'Order on WhatsApp'. We'll confirm your order and arrange payment and delivery over WhatsApp." },
  { q: "How do I pay?", a: "Payment is via bank transfer arranged over WhatsApp after you send your order." },
  { q: "How long does delivery take?", a: "Lagos: 2–3 business days. Outside Lagos: 4–7 business days." },
  { q: "Can I return an item?", a: "Yes — unworn items in original condition can be returned within 7 days. Message us on WhatsApp to arrange." },
  { q: "What sizes do you stock?", a: "S, M, L, XL, XXL for most garments. Caps are one-size. See our Size Guide for measurements." },
  { q: "Do you ship outside Nigeria?", a: "Not yet. Nigeria-wide delivery only in Phase 0." },
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          <dl className="grid gap-4">
            {FAQS.map((faq) => (
              <Card key={faq.q} variant="default" padding="md" className="hover:border-[var(--color-accent)] transition-colors">
                <dt className="text-lg font-semibold mb-2">{faq.q}</dt>
                <dd className="text-[var(--color-text-secondary)] leading-relaxed">{faq.a}</dd>
              </Card>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
