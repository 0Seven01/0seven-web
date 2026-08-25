import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with 0Seven.",
  openGraph: {
    title: "Contact — 0Seven",
    description: "Get in touch with 0Seven.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347034306187";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-20 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-10">
          The fastest way to reach us is WhatsApp.
        </p>

        <Card variant="elevated" padding="lg" className="flex flex-col gap-6 items-center">
          <div className="w-full">
            <p className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">WhatsApp</p>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="block w-full">
              <Button variant="accent" className="w-full">+{whatsapp}</Button>
            </a>
          </div>
          
          <div className="w-full border-t border-[var(--color-border)] pt-6">
            <p className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Instagram</p>
            <a href="https://instagram.com/0seven" target="_blank" rel="noreferrer" className="block w-full">
              <Button variant="secondary" className="w-full">@0seven</Button>
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
}
