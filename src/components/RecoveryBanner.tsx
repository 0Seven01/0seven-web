"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";

export function RecoveryBanner() {
  const { checkoutInitiated, items, clearCart, dismissRecovery } = useCart();
  const { isOpen } = usePreorderStatus();

  if (!isOpen || !checkoutInitiated || items.length === 0) return null;

  return (
    <div className="w-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
      <p className="font-medium">
        Your previous order hasn&apos;t been sent yet. Your cart is saved.
      </p>
      <div className="flex gap-3 shrink-0">
        <Link
          href="/cart"
          className="underline font-semibold"
        >
          Continue order
        </Link>
        <button
          onClick={clearCart}
          className="underline opacity-80"
        >
          Clear cart
        </button>
        <button onClick={dismissRecovery} aria-label="Dismiss" className="opacity-60">
          ✕
        </button>
      </div>
    </div>
  );
}
