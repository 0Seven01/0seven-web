"use client";

import { formatNaira } from "@/lib/format";
import { QUALITY_LABELS } from "@/lib/checkout";
import type { Variant, Quality } from "@/types/catalog";

interface QualitySelectorProps {
  variants: Variant[];
  selectedQuality: Quality;
  onChange: (quality: Quality) => void;
}

export function QualitySelector({
  variants,
  selectedQuality,
  onChange,
}: QualitySelectorProps) {
  const seen = new Map<Quality, Variant>();
  for (const v of variants) {
    if (!seen.has(v.quality)) seen.set(v.quality, v);
  }
  const qualities = Array.from(seen.entries());

  if (qualities.length < 2) return null;

  return (
    <div>
      <p className="text-[0.8rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] mb-2">
        Quality
      </p>
      <div className="flex gap-2 flex-wrap">
        {qualities.map(([quality, v]) => {
          const isSelected = quality === selectedQuality;
          return (
            <button
              key={quality}
              type="button"
              onClick={() => onChange(quality)}
              aria-pressed={isSelected}
              className={`flex flex-col items-start gap-0.5 px-3.5 py-2 rounded-[4px] cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "border-2 border-[var(--color-accent)] bg-[var(--color-surface-raised)]"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]"
              }`}
            >
              <span className="text-[0.85rem] font-bold text-[var(--color-text-primary)]">
                {QUALITY_LABELS[quality]}
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-[0.9rem] font-bold text-[var(--color-accent)]">
                  {formatNaira(v.priceKobo)}
                </span>
                {v.compareAtKobo > v.priceKobo && (
                  <span className="text-[0.72rem] text-[var(--color-text-muted)] line-through">
                    {formatNaira(v.compareAtKobo)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
