import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SOCIALS } from "@/config/socials";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

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
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="accent" icon={<WhatsAppIcon className="w-4 h-4" />} className="w-full">+{whatsapp}</Button>
            </a>
          </div>
          
          <div className="w-full border-t border-[var(--color-border)] pt-6">
            <p className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Instagram</p>
            <a href={SOCIALS.instagram.url} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="secondary" icon={<InstagramIcon className="w-4 h-4" />} className="w-full">@{SOCIALS.instagram.handle}</Button>
            </a>
          </div>

          <div className="w-full border-t border-[var(--color-border)] pt-6">
            <p className="font-semibold text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">TikTok</p>
            <a href={SOCIALS.tiktok.url} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="secondary" icon={<TikTokIcon className="w-4 h-4" />} className="w-full">@{SOCIALS.tiktok.handle}</Button>
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
}
