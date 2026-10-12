"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/ProductGallery";
import { ColourSelector } from "@/components/ColourSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/format";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import { isProductPreorderOpen, formatPreorderEventDate } from "@/config/preorder";
import type { Product, Variant } from "@/types/catalog";

interface ProductInteractiveProps {
  product: Product;
}

export function ProductInteractive({ product }: ProductInteractiveProps) {
  const firstColour = product.variants[0]?.colour.name ?? "";
  const [selectedColour, setSelectedColour] = useState(firstColour);
  const [selectedSize, setSelectedSize] = useState("");

  const handleColourChange = (colour: string) => {
    setSelectedColour(colour);
    setSelectedSize(""); // reset size when colour changes
  };

  const selectedVariant: Variant | null =
    product.variants.find(
      (v) => v.colour.name === selectedColour && v.size === selectedSize
    ) ?? null;

  const lowestPrice = Math.min(...product.variants.map((v) => v.priceKobo));
  const activeSwatchHex = product.variants.find(
    (v) => v.colour.name === selectedColour
  )?.colour.hex;

  const { isOpen: campaignOpen } = usePreorderStatus();
  const isProductOpen = isProductPreorderOpen(product, campaignOpen);
  const eventDateFormatted = formatPreorderEventDate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Product photo gallery filtered by selected colour */}
      <ProductGallery
        images={product.images}
        selectedColour={selectedColour}
        productName={product.name}
        swatchHex={activeSwatchHex}
      />

      {/* Product details & interactive selections */}
      <div className="flex flex-col gap-5 sticky top-[100px]">
        {/* Badges row: Pre-order status + Scripture reference */}
        <div className="flex items-center gap-2 flex-wrap">
          {isProductOpen ? (
            <Badge variant="accent">Pre-order</Badge>
          ) : campaignOpen && product.preorderClosed ? (
            <Badge variant="muted">Sold Out</Badge>
          ) : null}
          {product.scriptureRef && (
            <Badge variant="muted">{product.scriptureRef}</Badge>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-[1.75rem] md:text-3xl font-bold text-[var(--color-text-primary)] m-0 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 flex-wrap">
            <p className="text-2xl font-bold text-[var(--color-accent)] m-0">
              {formatNaira(lowestPrice)}
            </p>
            {isProductOpen && eventDateFormatted && (
              <span className="text-xs text-[var(--color-text-muted)] font-medium">
                • Ships for the {eventDateFormatted} event
              </span>
            )}
          </div>
        </div>
        <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-relaxed m-0">
          {product.description}
        </p>

        <hr className="border-[var(--color-border)] w-full my-2" />

        <div className="flex flex-col gap-5">
          <ColourSelector
            variants={product.variants}
            selectedColour={selectedColour}
            onChange={handleColourChange}
          />
          <SizeSelector
            variants={product.variants}
            selectedColour={selectedColour}
            selectedSize={selectedSize}
            onChange={setSelectedSize}
          />
          <AddToCartButton product={product} selectedVariant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}
