"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { buildCloudinaryLqipUrl, sanitizePublicId } from "@/lib/cloudinary";

export interface CloudinaryImageProps
  extends Omit<ImageProps, "src" | "placeholder" | "blurDataURL"> {
  src: string;
  swatchHex?: string;
}

// Next.js Image wrapper with Cloudinary LQIP blur and swatch-colored fallback on error.
export function CloudinaryImage({
  src,
  alt,
  swatchHex,
  className = "",
  onError,
  ...rest
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false);
  const cleanId = sanitizePublicId(src);

  if (hasError || !cleanId) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full min-h-0 flex items-center justify-center p-2 rounded-md border border-[var(--color-border)] select-none text-center ${className}`}
        style={{
          backgroundColor: swatchHex || "var(--color-surface-raised)",
        }}
      >
        <span className="text-xs font-semibold text-[var(--color-text-muted)] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  const blurUrl = buildCloudinaryLqipUrl(cleanId);

  return (
    <Image
      src={cleanId}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurUrl}
      className={className}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
