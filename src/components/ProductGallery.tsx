"use client";

import { useState } from "react";
import type { ProductImage } from "@/types/catalog";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";

interface ProductGalleryProps {
  images: ProductImage[];
  selectedColour: string;
  productName: string;
  swatchHex?: string;
}

export function ProductGallery({
  images,
  selectedColour,
  productName,
  swatchHex,
}: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [prevColour, setPrevColour] = useState(selectedColour);

  if (selectedColour !== prevColour) {
    setPrevColour(selectedColour);
    setActiveImageIndex(0);
  }

  const matchingImages = images.filter(
    (img) => img.colourName?.toLowerCase() === selectedColour.toLowerCase()
  );
  const displayImages = matchingImages.length > 0 ? matchingImages : images;
  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main product photo display */}
      <div className="relative aspect-[3/4] w-full bg-[var(--color-surface-raised)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        {currentImage ? (
          <CloudinaryImage
            src={currentImage.url}
            alt={currentImage.alt}
            swatchHex={swatchHex}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
            {productName}
          </div>
        )}
      </div>

      {/* Accessible thumbnail strip if colour has multiple photos */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pt-1 pb-1 no-scrollbar">
          {displayImages.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View photo ${idx + 1} for ${img.colourName || productName}`}
                aria-pressed={isSelected}
                className="relative w-16 h-20 shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-150"
                style={{
                  border: isSelected
                    ? "2px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                  opacity: isSelected ? 1 : 0.75,
                }}
              >
                <CloudinaryImage
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
