import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About — 0Seven",
  description:
    "The story behind 0Seven — faith, community, and Nigerian apparel.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-8">About 0Seven</h1>
        
        <Card variant="elevated" padding="lg" className="text-left space-y-6">
          <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
            0Seven is a Nigerian faith-inspired DTC apparel brand. Every piece
            carries a scripture reference — a wearable reminder of identity and
            purpose.
          </p>
          <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Born out of a desire to bring faith into everyday streetwear, 0Seven
            exists at the intersection of community, culture, and conviction.
          </p>
          {/* Final copy from Continental in Sprint 2 */}
        </Card>
      </div>
    </main>
  );
}
