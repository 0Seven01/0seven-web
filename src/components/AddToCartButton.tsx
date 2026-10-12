"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product, Variant } from "@/types/catalog";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: Variant | null;
}

export function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedVariant) return;
    const matchingImage = product.images.find(
      (img) => img.colourName?.toLowerCase() === selectedVariant.colour.name.toLowerCase()
    );
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      categorySlug: product.categorySlug,
      size: selectedVariant.size,
      colourName: selectedVariant.colour.name,
      colourHex: selectedVariant.colour.hex,
      priceKobo: selectedVariant.priceKobo,
      quantity,
      imageUrl: matchingImage?.url ?? product.images[0]?.url ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const disabled = !selectedVariant;

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <p className="text-[0.8rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.06em] m-0">
          Qty
        </p>
        <div className="flex items-center border border-[var(--color-border)] rounded-[4px] overflow-hidden bg-[var(--color-surface)]">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 bg-transparent border-none cursor-pointer text-base text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-[0.9rem] font-semibold text-[var(--color-text-primary)]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 bg-transparent border-none cursor-pointer text-base text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`w-full p-3.5 rounded-md border-none font-bold text-[0.95rem] tracking-[0.04em] transition-colors duration-200 ${
          disabled
            ? "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
            : added
            ? "bg-[var(--color-success)] text-white cursor-pointer"
            : "bg-[var(--color-accent)] text-[var(--color-accent-fg)] cursor-pointer hover:opacity-90"
        }`}
      >
        {added
          ? "✓ Added to Cart"
          : disabled
          ? "Select size"
          : "Add to Cart — Pre-order"}
      </button>

      {/* Pre-order notice */}
      <p className="text-[0.75rem] text-[var(--color-text-muted)] text-center m-0">
        Pre-order. Payment & delivery confirmed over WhatsApp.
      </p>
    </div>
  );
}
