import type { CartItem } from "../context/CartContext.tsx";
import type { CustomerDetails } from "../types/customer.ts";
import { formatNaira } from "./format.ts";
import { PREORDER_CONFIG, formatPreorderEventDate } from "../config/preorder.ts";

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
  paymentWording?: string;
  eventDate?: string;
}

export function buildPreorderMessage({
  cart,
  customer,
  reference,
  paymentWording = PREORDER_CONFIG.paymentWording.value,
  eventDate = formatPreorderEventDate() || "26 Oct",
}: BuildPreorderMessageParams): string {
  const lines = cart.map(
    (item, i) =>
      `${i + 1}. ${item.productName} — ${item.colourName}, ${item.size} ×${item.quantity} — ${formatNaira(item.priceKobo * item.quantity)}`
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

  const paymentLine = paymentWording ? `Payment: ${paymentWording}` : "";

  const parts = [
    `PRE-ORDER — Ref: ${reference}`,
    "",
    ...lines,
    "",
    `Total: ${formatNaira(total)}`,
    ...customerLines,
  ];

  if (paymentLine) {
    if (!customer?.fullName) {
      parts.push("");
    }
    parts.push(paymentLine);
  }

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

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) throw new Error("WhatsApp number not configured.");

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

