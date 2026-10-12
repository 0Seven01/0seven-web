"use client";

import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { CustomerDetails } from "@/types/customer";

interface CartCustomerFormProps {
  errors?: Record<string, string>;
  onClearError?: (field: keyof CustomerDetails) => void;
}

export function CartCustomerForm({
  errors = {},
  onClearError,
}: CartCustomerFormProps) {
  const { customer, updateCustomer } = useCart();

  const handleFieldChange = (field: keyof CustomerDetails, value: string) => {
    updateCustomer({ [field]: value });
    if (onClearError) onClearError(field);
  };

  return (
    <Card variant="default" padding="md" className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Customer & Delivery Details
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Provide your details for this pre-order. We will message you on WhatsApp to confirm payment.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="cart-fullname"
          label="Full Name *"
          type="text"
          autoComplete="name"
          placeholder="e.g. Tobi Continental"
          value={customer.fullName}
          onChange={(e) => handleFieldChange("fullName", e.target.value)}
          error={errors.fullName}
        />

        <Input
          id="cart-phone"
          label="Phone Number (WhatsApp) *"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08012345678"
          helperText="Enter an 11-digit number (080...) or +234..."
          value={customer.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          error={errors.phone}
        />

        <div className="flex flex-col gap-1.5">
          <label
            id="cart-fulfilment-label"
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            Collection Preference *
          </label>
          <div
            role="radiogroup"
            aria-labelledby="cart-fulfilment-label"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <button
              type="button"
              role="radio"
              aria-checked={customer.deliveryMethod === "pickup"}
              onClick={() => handleFieldChange("deliveryMethod", "pickup")}
              className={`min-h-[44px] p-3.5 rounded-md border text-left flex flex-col justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                customer.deliveryMethod === "pickup"
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs"
                  : "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  Pickup at Event
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium border border-[var(--color-border)]">
                  Free
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] mt-1">
                Collect in person at our 26 October event
              </span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={customer.deliveryMethod === "delivery"}
              onClick={() => handleFieldChange("deliveryMethod", "delivery")}
              className={`min-h-[44px] p-3.5 rounded-md border text-left flex flex-col justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                customer.deliveryMethod === "delivery"
                  ? "border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs"
                  : "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  Lagos Delivery
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium border border-[var(--color-border)]">
                  Fee TBC
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] mt-1">
                Delivery fee confirmed on WhatsApp
              </span>
            </button>
          </div>
        </div>

        {customer.deliveryMethod === "delivery" && (
          <Input
            id="cart-address"
            label="Delivery Area / Address *"
            type="text"
            autoComplete="street-address"
            placeholder="e.g. Lekki Phase 1, Lagos"
            value={customer.deliveryAddress ?? ""}
            onChange={(e) => handleFieldChange("deliveryAddress", e.target.value)}
            error={errors.deliveryAddress}
          />
        )}
      </div>

      <p className="text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
        Your contact details are stored only on your device and sent directly to WhatsApp.
      </p>
    </Card>
  );
}
