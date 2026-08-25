import type { CartItem } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";

export interface CheckoutProvider {
  readonly id: "whatsapp" | "paystack";
  readonly label: string;
  checkout(cart: CartItem[]): Promise<void>;
}

export class WhatsAppCheckout implements CheckoutProvider {
  readonly id = "whatsapp" as const;
  readonly label = "Order on WhatsApp";

  async checkout(cart: CartItem[]): Promise<void> {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) throw new Error("WhatsApp number not configured.");

    const lines = cart.map(
      (item, i) =>
        `${i + 1}. ${item.productName} — ${item.colourName}, ${item.size} ×${item.quantity} — ${formatNaira(item.priceKobo * item.quantity)}`
    );

    const total = cart.reduce(
      (sum, item) => sum + item.priceKobo * item.quantity,
      0
    );

    const message = [
      "Hi 0Seven! I'd like to order:",
      "",
      ...lines,
      "",
      `Total: ${formatNaira(total)}`,
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encoded}`;

    // Set recovery flag before opening WhatsApp
    localStorage.setItem("0s_checkout_initiated", "true");

    window.open(url, "_blank");
  }
}
