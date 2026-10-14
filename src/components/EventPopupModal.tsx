"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import {
  PREORDER_CONFIG,
  parseCutoffTimestamp,
  formatPreorderCutoff,
  formatPreorderStartDate,
} from "@/config/preorder";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "0s_event_popup_dismissed_v1";

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
      className="inline-flex items-center gap-1 font-mono font-bold tracking-wider text-xs md:text-sm bg-[var(--color-bg)] text-[var(--color-text-primary)] px-2.5 py-1 rounded border border-[var(--color-border)] select-none shadow-xs"
    >
      <span>{pad(timeLeft.days)}d</span>
      <span className="opacity-40">:</span>
      <span>{pad(timeLeft.hours)}h</span>
      <span className="opacity-40">:</span>
      <span>{pad(timeLeft.minutes)}m</span>
      <span className="opacity-40">:</span>
      <span className="text-[var(--color-accent)]">{pad(timeLeft.seconds)}s</span>
    </span>
  );
}

export function EventPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const pathname = usePathname();
  const { stage, isMounted } = usePreorderStatus();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Live 1-second ticking timer mounted strictly on client (C-23 hydration safe)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate two-pass mounting for live timer
    setNowMs(Date.now());
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Gracefully handle storage restrictions
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (stage === "closed") return;
    if (pathname === "/cart") return;

    try {
      const isDismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!isDismissed) {
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Gracefully handle storage restrictions
    }
  }, [isMounted, stage, pathname]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismiss]);

  if (!isOpen || stage === "closed" || pathname === "/cart") {
    return null;
  }

  const isUpcoming = stage === "upcoming";
  const flyerSrc = PREORDER_CONFIG.flyerFallbackUrl.value;

  const startEpoch = parseCutoffTimestamp(PREORDER_CONFIG.startDate.value);
  const cutoffEpoch = parseCutoffTimestamp(PREORDER_CONFIG.cutoff.value);
  const targetEpoch = isUpcoming ? startEpoch : cutoffEpoch;
  const currentNow = nowMs ?? (isMounted ? Date.now() : 0);
  const timeLeft = nowMs !== null ? calculateTimeLeft(targetEpoch, currentNow) : null;
  const formattedStart = formatPreorderStartDate();
  const formattedCutoff = formatPreorderCutoff();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      aria-describedby="event-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-[calc(100vw-2rem)] max-w-sm md:max-w-md max-h-[92vh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center"
      >
        {/* Flyer Graphic — edge-to-edge format matching banner asset */}
        <div className="relative w-full overflow-hidden bg-black/5">
          <Image
            src={flyerSrc}
            alt="0Seven First Drop Pre-Order Flyer - Starts 15th Oct - 22nd Oct - With 30% Off. Official_0seven on TikTok and Instagram."
            width={724}
            height={901}
            unoptimized
            priority
            className="w-full h-auto object-cover block"
          />

          {/* Floating Close Button — 44px tap target */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close event announcement"
            className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Semantic screen-reader metadata */}
        <div className="sr-only">
          <h2 id="event-modal-title">The First Drop — Pre-Order With 30% Off</h2>
          <p id="event-modal-desc">
            0Seven First Drop Pre-Order begins 15th Oct through 22nd Oct with 30% off.
            Features Justified, Anegkletos, and God Always T-shirts. Free pickup at Kairos
            Camp Meeting on 26 October.
          </p>
        </div>

        {/* Live Countdown Urgency */}
        <div className="w-full pt-3 pb-1 px-4 flex flex-col items-center justify-center text-center gap-1.5 bg-[var(--color-surface)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {isUpcoming ? "The First Drop Opens In" : "Pre-Orders Close In"}
          </span>
          {timeLeft ? (
            <CountdownDisplay timeLeft={timeLeft} />
          ) : (
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              {isUpcoming ? (formattedStart || "15 Oct") : formattedCutoff}
            </span>
          )}
        </div>

        {/* Action CTAs */}
        <div className="w-full p-4 md:p-5 pt-2 flex flex-col items-center space-y-2 bg-[var(--color-surface)]">
          <Link href="/shop" onClick={dismiss} className="w-full">
            <Button size="lg" variant="primary" className="w-full min-h-[48px]">
              {isUpcoming ? "Preview Catalogue" : "Claim 30% Off — Pre-Order Now"}
            </Button>
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] py-1 min-h-[44px] transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
