import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = {
  title: "Handmade Footwear — Coming Soon | 0Seven",
  description:
    "0Seven handmade footwear — crafted by hand, rooted in faith. Join the waitlist.",
};

export default function FootwearPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Handmade Footwear</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-12 leading-relaxed">
          Crafted by hand. Every pair is a one-of-a-kind piece rooted in faith
          and Nigerian craftsmanship. Launching in approximately 6 months.
        </p>
        
        <section className="bg-[var(--color-surface)] rounded-2xl p-8 md:p-12 border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Be the first to know when we drop.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="your@email.com" required className="flex-1" />
            <Button type="submit" variant="accent">Notify Me</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
