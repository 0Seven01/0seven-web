"use client";

import { useCart } from "@/context/CartContext";

export function RecoveryBanner() {
  const { checkoutInitiated, items, clearCart, dismissRecovery } = useCart();

  if (!checkoutInitiated || items.length === 0) return null;

  return (
    <div className="w-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
      <p className="font-medium">
        Your previous order hasn't been sent yet. Your cart is saved.
      </p>
      <div className="flex gap-3 shrink-0">
        <a
          href="/cart"
          className="underline font-semibold"
        >
          Continue order
        </a>
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
