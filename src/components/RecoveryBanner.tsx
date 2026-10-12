"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";

export function RecoveryBanner() {
  const { checkoutInitiated, items, clearCart, dismissRecovery } = useCart();
  const { isOpen } = usePreorderStatus();

  if (!isOpen || !checkoutInitiated || items.length === 0) return null;

  return (
    <aside
      aria-label="Checkout recovery notice"
      className="w-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] px-4 py-3 border-b border-[var(--color-border)]"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
        <p className="font-medium">
          Your previous order hasn&apos;t been sent yet. Your cart is saved.
        </p>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/cart"
            className="underline font-semibold hover:opacity-90 transition-opacity"
          >
            Continue order
          </Link>
          <button
            onClick={clearCart}
            className="underline opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Clear cart
          </button>
          <button
            onClick={dismissRecovery}
            aria-label="Dismiss"
            className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer px-1 font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
