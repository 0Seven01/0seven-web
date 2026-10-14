"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/format";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { Badge } from "@/components/ui/Badge";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import { isProductPreorderOpen } from "@/config/preorder";
import type { Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const href = `/shop/${product.categorySlug}/${product.slug}`;
  const lowestVariant = product.variants.reduce(
    (lo, v) => (v.priceKobo < lo.priceKobo ? v : lo),
    product.variants[0]
  );
  const lowestPaid = lowestVariant?.priceKobo ?? 0;
  const lowestRegular = lowestVariant?.compareAtKobo ?? 0;
  const { isOpen: campaignOpen } = usePreorderStatus();
  const isOpen = isProductPreorderOpen(product, campaignOpen);

  return (
    <Link
      href={href}
      className={`flex flex-col no-underline text-inherit rounded-md overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md transition-shadow duration-150 group ${className || "w-full"}`}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] w-full bg-[var(--color-surface-raised)] overflow-hidden">
        {/* Pre-order status badge — top left */}
        {isOpen ? (
          <Badge
            variant="accent"
            className="absolute top-2 left-2 z-10 text-[0.625rem] px-1.5 py-0.5 max-w-[85px] truncate"
          >
            Pre-order
          </Badge>
        ) : campaignOpen && product.preorderClosed ? (
          <Badge
            variant="muted"
            className="absolute top-2 left-2 z-10 text-[0.625rem] px-1.5 py-0.5 max-w-[85px] truncate"
          >
            Sold Out
          </Badge>
        ) : null}

        {product.images[0] ? (
          <CloudinaryImage
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            swatchHex={product.variants[0]?.colour.hex}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 250px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs font-semibold">
            {product.name}
          </div>
        )}

        {/* Scripture ref badge — top right like discount badge */}
        {product.scriptureRef && (
          <span className="absolute top-2 right-2 z-10 bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-[0.6rem] font-bold px-1.5 py-0.5 rounded uppercase tracking-[0.04em]">
            {product.scriptureRef}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="py-2.5 px-3 flex flex-col gap-1">
        <p className="text-[0.78rem] text-[var(--color-text-primary)] m-0 font-medium leading-snug line-clamp-2">
          {product.name}
        </p>
        <p className="text-[var(--color-text-primary)] font-bold text-[0.88rem] m-0">
          <span className="text-[0.7rem] font-medium text-[var(--color-text-muted)]">From </span>
          {formatNaira(lowestPaid)}
          {lowestRegular > lowestPaid && (
            <span className="ml-1.5 text-[0.72rem] font-medium text-[var(--color-text-muted)] line-through">
              {formatNaira(lowestRegular)}
            </span>
          )}
        </p>
        <p className="text-[var(--color-text-muted)] text-[0.68rem] m-0 font-medium">
          {isOpen
            ? "Pre-order"
            : product.preorderClosed && campaignOpen
              ? "Sold Out"
              : "Pre-order Closed"}
        </p>
      </div>
    </Link>
  );
}
