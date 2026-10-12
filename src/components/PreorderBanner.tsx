"use client";

import Link from "next/link";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import { PREORDER_CONFIG, formatPreorderCutoff } from "@/config/preorder";

export function PreorderBanner() {
  const { isOpen } = usePreorderStatus();
  const eventName = PREORDER_CONFIG.eventName.value;
  const formattedCutoff = formatPreorderCutoff();

  return (
    <section
      aria-label="Pre-order campaign announcement"
      suppressHydrationWarning
      className="w-full min-w-0 max-w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3 px-4 md:px-6 transition-colors"
    >
      <div
        suppressHydrationWarning
        className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center ${
          isOpen ? "justify-between text-center md:text-left" : "justify-center text-center"
        } gap-3 md:gap-6`}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 min-w-0" suppressHydrationWarning>
          <span
            suppressHydrationWarning
            className={`inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded ${
              isOpen
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            {isOpen ? "Pre-order" : "Pre-orders Closed"}
          </span>
          <p className="text-sm md:text-base font-medium text-[var(--color-text-primary)]" suppressHydrationWarning>
            {isOpen ? (
              <>
                Ready for {eventName}. Pre-orders close{" "}
                <span className="font-semibold text-[var(--color-text-secondary)]">
                  {formattedCutoff}
                </span>
                .
              </>
            ) : (
              <>
                Pre-orders for {eventName} closed on{" "}
                <span className="font-semibold text-[var(--color-text-secondary)]">
                  {formattedCutoff}
                </span>
                . Thank you!
              </>
            )}
          </p>
        </div>

        {isOpen && (
          <Link
            href="/shop"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shrink-0 bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)]"
          >
            Shop the collection
          </Link>
        )}
      </div>
    </section>
  );
}
