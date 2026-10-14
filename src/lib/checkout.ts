import type { CartItem } from "../context/CartContext.tsx";
import type { CustomerDetails } from "../types/customer.ts";
import type { Quality } from "../types/catalog.ts";
import { formatNaira } from "./format.ts";
import {
  PREORDER_CONFIG,
  formatPreorderEventDate,
  isPreorderOpen,
} from "../config/preorder.ts";

export const QUALITY_LABELS: Record<Quality, string> = {
  gold: "Premium Gold",
  standard: "Standard Premium",
};

export const UNAMBIGUOUS_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateOrderReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += UNAMBIGUOUS_ALPHABET[bytes[i] & 31];
  }
  return `0S-PO-${code}`;
}

export interface BuildPreorderMessageParams {
  cart: CartItem[];
  customer?: CustomerDetails;
  reference: string;
  payment?: {
    bank: string;
    accountNumber: string;
    accountName: string;
    receiptNote: string;
  };
  eventDate?: string;
}

export function buildPreorderMessage({
  cart,
  customer,
  reference,
  payment = PREORDER_CONFIG.payment.value,
  eventDate = formatPreorderEventDate() || "26 Oct",
}: BuildPreorderMessageParams): string {
  const lines = cart.map(
    (item, i) =>
      `${i + 1}. ${item.productName} (${QUALITY_LABELS[item.quality]}) — ${item.colourName}, ${item.size} ×${item.quantity} — ${formatNaira(item.priceKobo * item.quantity)}`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.priceKobo * item.quantity,
    0
  );

  const customerLines: string[] = [];
  if (customer && customer.fullName) {
    customerLines.push(
      "",
      `Name: ${customer.fullName.trim()}`,
      `Phone: ${customer.phone.trim()}`,
      `Collection: ${
        customer.deliveryMethod === "delivery"
          ? `Lagos Delivery (${customer.deliveryAddress?.trim() || "Address to confirm"})`
          : `Pickup at ${eventDate} event`
      }`
    );
  }

  const paymentLines = payment
    ? [
        "",
        "Payment — bank transfer:",
        `Bank: ${payment.bank}`,
        `Account Number: ${payment.accountNumber}`,
        `Account Name: ${payment.accountName}`,
        payment.receiptNote,
      ]
    : [];

  const parts = [
    `PRE-ORDER — Ref: ${reference}`,
    "",
    ...lines,
    "",
    `Total: ${formatNaira(total)}`,
    ...customerLines,
    ...paymentLines,
  ];

  return parts.join("\n");
}

export interface CheckoutOptions {
  reference?: string;
}

export interface CheckoutProvider {
  readonly id: "whatsapp" | "paystack";
  readonly label: string;
  checkout(
    cart: CartItem[],
    customer?: CustomerDetails,
    options?: CheckoutOptions
  ): Promise<void>;
}

export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw || !raw.trim()) {
    throw new Error("Ordering is temporarily unavailable — please contact us on Instagram.");
  }

  const trimmed = raw.trim();
  if (/X{3,}/i.test(trimmed) || trimmed.toLowerCase().includes("placeholder")) {
    throw new Error("Ordering is temporarily unavailable — please contact us on Instagram.");
  }

  const sanitized = trimmed.replace(/[\s+\-()]/g, "");
  if (!/^\d{10,15}$/.test(sanitized)) {
    throw new Error("Ordering is temporarily unavailable — please contact us on Instagram.");
  }

  return sanitized;
}

export class WhatsAppCheckout implements CheckoutProvider {
  readonly id = "whatsapp" as const;
  readonly label = "Order on WhatsApp";

  async checkout(
    cart: CartItem[],
    customer?: CustomerDetails,
    options?: CheckoutOptions
  ): Promise<void> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("Cannot checkout while offline.");
    }

    if (!isPreorderOpen()) {
      throw new Error("Pre-orders have closed for this campaign.");
    }

    const number = getWhatsAppNumber();

    const reference = options?.reference ?? generateOrderReference();
    const message = buildPreorderMessage({
      cart,
      customer,
      reference,
    });

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encoded}`;

    // Set recovery flag before opening WhatsApp
    localStorage.setItem("0s_checkout_initiated", "true");

    window.open(url, "_blank");
  }
}

