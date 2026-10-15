import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About — Faith-Inspired Apparel",
  description:
    "To give every believer who wears 0Seven a tangible reminder of their God-given confidence and authority, one scripture-inspired design at a time.",
  openGraph: {
    title: "About 0Seven — Faith-Inspired Apparel",
    description:
      "To give every believer who wears 0Seven a tangible reminder of their God-given confidence and authority, one scripture-inspired design at a time.",
    url: "/about",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://0seven.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "0Seven",
      url: siteUrl,
      description:
        "Faith-inspired apparel. Every design, a revelation. Every wear, a reminder of His promises.",
      sameAs: [
        "https://instagram.com/official__0seven",
        "https://www.tiktok.com/@official__0seven",
      ],
    },
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about/#webpage`,
      url: `${siteUrl}/about`,
      name: "About 0Seven — Faith-Inspired Apparel",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      description:
        "To give every believer who wears 0Seven a tangible reminder of their God-given confidence and authority, one scripture-inspired design at a time.",
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header & One-Liner */}
          <header className="text-center mb-10 md:mb-14">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-text-primary)]">
              About 0Seven
            </h1>
            <p className="text-base md:text-xl text-[var(--color-text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
              Faith-inspired apparel. Every design, a revelation. Every wear, a
              reminder of His promises.
            </p>
          </header>

          {/* Mission Statement Feature Callout */}
          <section
            aria-labelledby="mission-heading"
            className="bg-[var(--color-surface)] border-l-4 border-[var(--color-accent)] p-6 md:p-8 rounded-r-xl my-8 md:my-12"
          >
            <h2
              id="mission-heading"
              className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2"
            >
              Our Mission
            </h2>
            <p className="text-lg md:text-2xl font-bold leading-snug text-[var(--color-text-primary)]">
              &ldquo;To give every believer who wears 0Seven a tangible reminder
              of their God-given confidence and authority, one scripture-inspired
              design at a time.&rdquo;
            </p>
          </section>

          {/* Brand Story Narrative */}
          <section
            aria-labelledby="story-heading"
            className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed text-[var(--color-text-secondary)]"
          >
            <h2
              id="story-heading"
              className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-6"
            >
              Our Story
            </h2>

            <p>
              0Seven is a faith-inspired apparel brand built to remind every
              believer of who they are and what they carry.
            </p>

            <p>
              We believe clothing can do more than cover our body, it can speak.
              Every 0Seven piece is designed around a revelation drawn from
              scriptures (The Bible), turning garments into daily declarations of
              identity, confidence, and authority. When you wear 0Seven,
              you&apos;re not just wearing a shirt, you&apos;re wearing a reminder
              that God has spoken promises over your life, and those promises will
              continue to stand.
            </p>

            <p>
              Our name carries a meaning of completeness and divine order, a nod
              to the belief that in Christ, we are made whole. Every design
              starts from that place: a scripture, a revelation, a truth worth
              carrying with you wherever you go.
            </p>

            <p>
              0Seven exists for the believer who wants their faith to be seen, not
              just felt. For the one stepping into a room needing a quiet
              reminder of who they belong to. For the one who wears their identity
              boldly, because it was never meant to be hidden.
            </p>

            <p className="font-medium text-[var(--color-text-primary)]">
              This is more than apparel. It&apos;s a movement of faith, worn with
              confidence and pride.
            </p>
          </section>

          {/* Action Section */}
          <section className="border-t border-[var(--color-border)] pt-10 mt-12 md:mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button variant="accent" size="lg">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
