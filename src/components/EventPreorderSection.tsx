"use client";

import Link from "next/link";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import {
  formatPreorderCutoff,
  formatPreorderClosedMessage,
  formatPreorderStartDate,
} from "@/config/preorder";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function EventPreorderSection() {
  const { stage } = usePreorderStatus();
  const formattedCutoff = formatPreorderCutoff();
  const formattedStart = formatPreorderStartDate();

  const isOpen = stage === "open";
  const isUpcoming = stage === "upcoming";
  const isClosed = stage === "closed";

  return (
    <section
      data-section="event-preorder"
      aria-label="Event pre-order announcement"
      className="py-20 px-4 bg-[var(--color-surface)] text-[var(--color-text-primary)] border-t border-[var(--color-border)] text-center transition-colors"
    >
      <div className="max-w-xl mx-auto space-y-4">
        <div>
          <Badge variant={isOpen ? "accent" : isUpcoming ? "accent" : "muted"}>
            {isOpen
              ? "Event Drop — 30% Off"
              : isUpcoming
              ? `Starts ${formattedStart || "15 Oct"} — 30% Off`
              : "Pre-orders Closed"}
          </Badge>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">
          {isOpen
            ? "The First Drop — Pre-Order With 30% Off"
            : isUpcoming
            ? "The First Drop — Pre-Orders Open 15 Oct"
            : "Pre-Orders Closed"}
        </h2>

        <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
          {isOpen ? (
            <>
              Lock in your shirts with exclusive 30% event discount before pre-orders
              close on{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                {formattedCutoff}
              </span>
              . Free pickup at Kairos Camp Meeting on 26 October or delivery across
              Lagos.
            </>
          ) : isUpcoming ? (
            <>
              Get ready for The First Drop starting {formattedStart || "15 Oct"}. Enjoy
              exclusive 30% pre-order pricing with free pickup at Kairos Camp Meeting
              on 26 October.
            </>
          ) : (
            formatPreorderClosedMessage()
          )}
        </p>

        {/* Action button - hidden completely when closed per C-23 */}
        {!isClosed && (
          <div className="pt-2">
            <Link href="/shop" className="inline-block">
              <Button size="lg" variant="primary" className="min-h-[48px] px-8">
                {isOpen ? "Pre-Order With 30% Off" : "Preview Catalogue"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
