"use client";

import { useState } from "react";
import { ColourSelector } from "@/components/ColourSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { AddToCartButton } from "@/components/AddToCartButton";
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

  return (
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
  );
}
