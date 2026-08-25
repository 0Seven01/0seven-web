"use client";

import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { WhatsAppCheckout } from "@/lib/checkout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const checkout = new WhatsAppCheckout();

export default function CartPage() {
  const { items, totalKobo, itemCount, removeItem, updateQuantity, clearCart } =
    useCart();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Your cart is empty.</p>
          <a href="/shop">
            <Button variant="accent" size="lg" className="w-full">Browse products</Button>
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart ({itemCount} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <Card key={item.variantId} variant="default" padding="sm" className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-[var(--color-surface-raised)] rounded-md flex-shrink-0 flex items-center justify-center text-xs text-[var(--color-text-muted)]">Image</div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{item.colourName}, {item.size}</p>
                  <p className="font-medium mt-1">{formatNaira(item.priceKobo)}</p>
                </div>
                <div className="flex items-center gap-3 bg-[var(--color-surface-raised)] rounded-md px-2 py-1">
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center font-bold hover:text-[var(--color-accent)]">−</button>
                  <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center font-bold hover:text-[var(--color-accent)]">+</button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.variantId)} className="text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white">
                  Remove
                </Button>
              </Card>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <Card variant="elevated" padding="md" className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between font-bold text-lg mb-6 border-t border-[var(--color-border)] pt-4">
                <span>Total</span>
                <span>{formatNaira(totalKobo)}</span>
              </div>

              {isOnline ? (
                <Button variant="accent" size="lg" className="w-full mb-4" onClick={() => checkout.checkout(items)}>
                  Order on WhatsApp
                </Button>
              ) : (
                <div className="p-3 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-md text-sm mb-4 border border-[var(--color-error)]/20">
                  You're offline. Connect to place your order — your cart is saved.
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                onClick={() => {
                  if (confirm("Order sent? This will clear your cart.")) clearCart();
                }}
              >
                Order sent — clear my cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
