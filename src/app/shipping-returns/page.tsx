import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "0Seven delivery and returns policy.",
  openGraph: {
    title: "Shipping & Returns — 0Seven",
    description: "0Seven delivery and returns policy.",
    url: "/shipping-returns",
  },
};

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Shipping & Returns</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery</h2>
            <Card variant="default" padding="lg">
              <ul className="list-disc pl-5 space-y-3 text-[var(--color-text-secondary)]">
                <li>Lagos: 2–3 business days</li>
                <li>Outside Lagos: 4–7 business days</li>
                <li>Delivery fee agreed over WhatsApp based on location</li>
                <li>Orders dispatched within 1 business day of payment confirmation</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Returns</h2>
            <Card variant="default" padding="lg">
              <ul className="list-disc pl-5 space-y-3 text-[var(--color-text-secondary)]">
                <li>Unworn items in original condition accepted within 7 days of delivery</li>
                <li>Message us on WhatsApp to initiate a return</li>
                <li>Customer covers return shipping cost</li>
                <li>Refunds processed as bank transfer within 3 business days of receiving the item</li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
