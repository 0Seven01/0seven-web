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
  const seen = new Set<string>();
  const colours: Colour[] = [];
  for (const v of variants) {
    if (!seen.has(v.colour.name)) {
      seen.add(v.colour.name);
      colours.push(v.colour);
    }
  }

  return (
    <div>
      <p className="text-[0.8rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] mb-2">
        Colour — {selectedColour}
      </p>
      <div className="flex gap-2 flex-wrap">
        {colours.map((colour) => {
          const isSelected = colour.name === selectedColour;
          return (
            <button
              key={colour.name}
              onClick={() => onChange(colour.name)}
              aria-label={colour.name}
              aria-pressed={isSelected}
              title={colour.name}
              className="w-7 h-7 rounded-full cursor-pointer transition-all duration-150"
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
