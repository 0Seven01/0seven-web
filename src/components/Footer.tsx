import Link from "next/link";

const LINKS = [
  { href: "/about",             label: "About" },
  { href: "/faqs",              label: "FAQs" },
  { href: "/size-guide",        label: "Size Guide" },
  { href: "/shipping-returns",  label: "Shipping & Returns" },
  { href: "/contact",           label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 px-6 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        {/* Brand */}
        <div>
          <p className="font-bold text-[1.1rem] tracking-[0.08em] text-[var(--color-text-primary)]">
            0SEVEN
          </p>
          <p className="text-[var(--color-text-muted)] text-[0.85rem] mt-1">
            Faith-inspired apparel from Lagos, Nigeria.
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-between items-center border-t border-[var(--color-border)] pt-6">
          <p className="text-[var(--color-text-muted)] text-xs">
            © {year} 0Seven. All rights reserved.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347034306187"}`}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-accent)] text-sm font-semibold hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Order on WhatsApp →
          </a>
        </div>
      </div>
    </footer>
  );
}
