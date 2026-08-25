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
  const available = variants.filter((v) => v.colour.name === selectedColour);

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
        {available.map((v) => {
          const isSelected = v.size === selectedSize;
          return (
            <button
              key={v.size}
              onClick={() => onChange(v.size)}
              aria-pressed={isSelected}
              className={`px-3.5 py-1.5 rounded-[4px] text-[0.85rem] cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "border-2 border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-bold"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)]"
              }`}
            >
              {v.size.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
