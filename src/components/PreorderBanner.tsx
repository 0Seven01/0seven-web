"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import {
  PREORDER_CONFIG,
  parseCutoffTimestamp,
  parseEventTimestamp,
  formatPreorderCutoff,
  formatPreorderClosedMessage,
  formatPreorderStartDate,
} from "@/config/preorder";
import { Button } from "@/components/ui/Button";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetEpoch: number | null, nowMs: number): TimeLeft | null {
  if (targetEpoch === null) return null;
  const totalMs = targetEpoch - nowMs;
  if (totalMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

function CountdownDisplay({ timeLeft }: { timeLeft: TimeLeft }) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span
      aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      className="inline-flex items-center gap-1 font-mono font-bold tracking-wider text-xs md:text-sm bg-[var(--color-bg)] text-[var(--color-text-primary)] px-2 py-0.5 rounded border border-[var(--color-border)] select-none shrink-0 whitespace-nowrap"
    >
      <span>{pad(timeLeft.days)}d</span>
      <span className="opacity-40">:</span>
      <span>{pad(timeLeft.hours)}h</span>
      <span className="opacity-40">:</span>
      <span>{pad(timeLeft.minutes)}m</span>
      <span className="opacity-40">:</span>
      <span className="text-[var(--color-accent)] shrink-0">{pad(timeLeft.seconds)}s</span>
    </span>
  );
}

export function PreorderBanner() {
  const { stage, isMounted } = usePreorderStatus();
  const [nowMs, setNowMs] = useState<number | null>(null);

  const eventName = PREORDER_CONFIG.eventName.value;
  const formattedCutoff = formatPreorderCutoff();
  const formattedStart = formatPreorderStartDate();

  const startEpoch = parseCutoffTimestamp(PREORDER_CONFIG.startDate.value);
  const cutoffEpoch = parseCutoffTimestamp(PREORDER_CONFIG.cutoff.value);
  const eventEpoch = parseEventTimestamp(PREORDER_CONFIG.eventDate.value);

  // Live 1-second ticking timer mounted strictly on client (C-23 hydration safe)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate two-pass mounting for live timer
    setNowMs(Date.now());
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isUpcoming = stage === "upcoming";
  const isOpen = stage === "open";
  const isClosed = stage === "closed";

  // Determine active countdown target based on current stage
  const currentNow = nowMs ?? (isMounted ? Date.now() : 0);
  const targetEpoch = isUpcoming ? startEpoch : isOpen ? cutoffEpoch : eventEpoch;
  const timeLeft = nowMs !== null ? calculateTimeLeft(targetEpoch, currentNow) : null;
  const isPostEvent = isClosed && eventEpoch !== null && currentNow >= eventEpoch;

  return (
    <section
      aria-label="Pre-order campaign announcement and live countdown"
      suppressHydrationWarning
      className="w-full min-w-0 max-w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3 px-4 md:px-6 transition-colors"
    >
      <div
        suppressHydrationWarning
        className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center ${
          !isClosed ? "justify-between text-center md:text-left" : "justify-center text-center"
        } gap-3 md:gap-6`}
      >
        <div
          className="flex flex-col md:flex-row items-center gap-2 md:gap-3 min-w-0"
          suppressHydrationWarning
        >
          {/* Badge */}
          <span
            suppressHydrationWarning
            className={`inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded shrink-0 ${
              isOpen || isUpcoming
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                : "bg-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            {isUpcoming
              ? "Pre-order Drop"
              : isOpen
              ? "30% Off Event"
              : isPostEvent
              ? "Event Complete"
              : "Pre-orders Closed"}
          </span>

          {/* Copy + Live Countdown */}
          <div
            className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-2 text-sm md:text-base font-medium text-[var(--color-text-primary)]"
            suppressHydrationWarning
          >
            {isUpcoming ? (
              <>
                <span>The First Drop opens in</span>
                {timeLeft ? (
                  <CountdownDisplay timeLeft={timeLeft} />
                ) : (
                  <span className="font-semibold text-[var(--color-text-secondary)]">
                    {formattedStart || "15 Oct"}
                  </span>
                )}
                <span className="text-xs text-[var(--color-text-secondary)] hidden md:inline">
                  (Kairos Camp Meeting 2026)
                </span>
              </>
            ) : isOpen ? (
              <>
                <span>Pre-orders close in</span>
                {timeLeft ? (
                  <CountdownDisplay timeLeft={timeLeft} />
                ) : (
                  <span className="font-semibold text-[var(--color-text-secondary)]">
                    {formattedCutoff}
                  </span>
                )}
                <span className="text-xs text-[var(--color-text-secondary)] hidden md:inline">
                  with 30% off
                </span>
              </>
            ) : isPostEvent ? (
              <span>Thank you for being part of {eventName}!</span>
            ) : (
              <>
                <span>Pre-orders closed. {eventName} starts in</span>
                {timeLeft ? (
                  <CountdownDisplay timeLeft={timeLeft} />
                ) : (
                  formatPreorderClosedMessage()
                )}
              </>
            )}
          </div>
        </div>

        {/* Action CTAs (Hidden when closed per C-23) */}
        {!isClosed && (
          <div className="shrink-0 pt-1 md:pt-0">
            <Link href="/shop">
              <Button
                size="sm"
                variant={isOpen ? "primary" : "secondary"}
                className="min-h-[44px] px-5 py-2 text-xs md:text-sm font-semibold"
              >
                {isOpen ? "Shop Collection" : "Preview Catalogue"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
