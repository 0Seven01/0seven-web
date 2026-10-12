"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { WhatsAppCheckout } from "@/lib/checkout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { CartCustomerForm } from "@/components/CartCustomerForm";
import { customerDetailsSchema } from "@/lib/validation/customer";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import type { CustomerDetails } from "@/types/customer";

const checkout = new WhatsAppCheckout();

export default function CartPage() {
  const {
    items,
    totalKobo,
    itemCount,
    customer,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { isOnline } = useNetworkStatus();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: keyof CustomerDetails) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCheckout = () => {
    const result = customerDetailsSchema.safeParse(customer);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFormErrors(errors);
      const firstErrorField = result.error.issues[0]?.path[0];
      const targetId =
        firstErrorField === "fullName"
          ? "cart-fullname"
          : firstErrorField === "phone"
          ? "cart-phone"
          : firstErrorField === "deliveryAddress"
          ? "cart-address"
          : "cart-fullname";
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.focus();
      }
      return;
    }

    setFormErrors({});
    checkout.checkout(items, customer);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Your cart is empty.</p>
          <Link href="/shop">
            <Button variant="accent" size="lg" className="w-full">Browse products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-4 pb-28 lg:pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart ({itemCount} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.variantId} variant="default" padding="sm" className="flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="relative w-24 h-28 sm:w-28 sm:h-32 bg-[var(--color-surface-raised)] rounded-md shrink-0 overflow-hidden border border-[var(--color-border)]">
                    {item.imageUrl ? (
                      <CloudinaryImage
                        src={item.imageUrl}
                        alt={item.productName}
                        swatchHex={item.colourHex}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-text-muted)] font-medium">
                        {item.productName}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 text-left">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.productName}</h3>
                      <p className="text-[var(--color-text-secondary)] text-sm">{item.colourName}, {item.size}</p>
                      <p className="font-bold text-[var(--color-text-primary)] mt-1">{formatNaira(item.priceKobo)}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-2 bg-[var(--color-surface-raised)] rounded-md p-1 border border-[var(--color-border)]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.productName}, ${item.colourName}, ${item.size}`}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-lg hover:text-[var(--color-accent)] cursor-pointer focus:outline-none"
                        >−</button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.productName}, ${item.colourName}, ${item.size}`}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-lg hover:text-[var(--color-accent)] cursor-pointer focus:outline-none"
                        >+</button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.variantId)}
                        className="text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white min-h-[44px] px-2 text-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <CartCustomerForm
              errors={formErrors}
              onClearError={clearFieldError}
            />
          </div>

          <div className="w-full lg:w-80">
            <Card variant="elevated" padding="md" className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between font-bold text-lg mb-6 border-t border-[var(--color-border)] pt-4">
                <span>Total</span>
                <span>{formatNaira(totalKobo)}</span>
              </div>

              {isOnline ? (
                <Button variant="accent" size="lg" className="w-full mb-4" onClick={handleCheckout}>
                  Order on WhatsApp
                </Button>
              ) : (
                <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-center mb-4">
                  <p className="font-semibold text-[var(--color-text-primary)] m-0 mb-1">
                    You&apos;re offline.
                  </p>
                  <p className="text-[var(--color-text-muted)] text-[0.85rem] m-0">
                    Connect to place your order — your cart is saved.
                  </p>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full min-h-[44px] text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
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

      {/* Sticky mobile checkout bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[var(--color-text-secondary)] block">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-bold text-lg text-[var(--color-text-primary)]">
            {formatNaira(totalKobo)}
          </span>
        </div>
        {isOnline ? (
          <Button
            variant="accent"
            size="md"
            onClick={handleCheckout}
            className="font-bold shrink-0 min-h-[44px]"
          >
            Order on WhatsApp
          </Button>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)] text-right">
            Go online to order
          </span>
        )}
      </div>
    </main>
  );
}
