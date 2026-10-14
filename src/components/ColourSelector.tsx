"use client";

import type { Variant, Colour } from "@/types/catalog";

interface ColourSelectorProps {
  variants: Variant[];
  selectedColour: string;
  onChange: (colourName: string) => void;
}

export function ColourSelector({
  variants,
  selectedColour,
  onChange,
}: ColourSelectorProps) {
  const seen = new Map<string, { colour: Colour; active: boolean }>();
  for (const v of variants) {
    const entry = seen.get(v.colour.name);
    if (!entry) {
      seen.set(v.colour.name, { colour: v.colour, active: Boolean(v.active) });
    } else if (v.active) {
      entry.active = true;
    }
  }
  const colours = Array.from(seen.values());

  return (
    <div>
      <p className="text-[0.8rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] mb-2">
        Colour — {selectedColour}
      </p>
      <div className="flex gap-2 flex-wrap">
        {colours.map(({ colour, active }) => {
          const isSelected = colour.name === selectedColour;
          return (
            <button
              key={colour.name}
              onClick={() => active && onChange(colour.name)}
              disabled={!active}
              aria-label={active ? colour.name : `${colour.name} (not available yet)`}
              aria-pressed={isSelected}
              title={active ? colour.name : `${colour.name} — not available yet`}
              className={`w-7 h-7 rounded-full transition-all duration-150 ${
                active ? "cursor-pointer" : "cursor-not-allowed opacity-30"
              }`}
              style={{
                backgroundColor: colour.hex,
                border: isSelected ? "3px solid var(--color-accent)" : "2px solid var(--color-border)",
                outline: isSelected ? "2px solid var(--color-accent)" : "none",
                outlineOffset: "2px",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
