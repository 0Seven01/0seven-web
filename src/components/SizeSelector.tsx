"use client";

import type { Variant } from "@/types/catalog";
import Link from "next/link";

interface SizeSelectorProps {
  variants: Variant[];
  selectedColour: string;
  selectedSize: string;
  onChange: (size: string) => void;
}

export function SizeSelector({
  variants,
  selectedColour,
  selectedSize,
  onChange,
}: SizeSelectorProps) {
  const seen = new Map<string, { size: string; active: boolean }>();
  for (const v of variants) {
    if (v.colour.name !== selectedColour) continue;
    const entry = seen.get(v.size);
    if (!entry) {
      seen.set(v.size, { size: v.size, active: Boolean(v.active) });
    } else if (v.active) {
      entry.active = true;
    }
  }
  const sizes = Array.from(seen.values());

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-[0.8rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] m-0">
          Size
        </p>
        <Link
          href="/size-guide"
          className="text-[0.75rem] text-[var(--color-accent)] underline hover:opacity-80 transition-opacity"
        >
          Size guide
        </Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map(({ size, active }) => {
          const isSelected = size === selectedSize;
          return (
            <button
              key={size}
              onClick={() => active && onChange(size)}
              disabled={!active}
              aria-pressed={isSelected}
              aria-label={active ? size.replace("_", " ") : `${size.replace("_", " ")} (not available)`}
              title={active ? undefined : "Not available"}
              className={`px-3.5 py-1.5 rounded-[4px] text-[0.85rem] transition-all duration-150 ${
                !active
                  ? "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] line-through opacity-40 cursor-not-allowed"
                  : isSelected
                  ? "border-2 border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-bold cursor-pointer"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] cursor-pointer"
              }`}
            >
              {size.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
