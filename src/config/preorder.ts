export interface PlaceholderValue<T> {
  readonly value: T;
  readonly isPlaceholder: boolean;
  readonly label: string;
}

export function placeholder<T>(value: T, label: string): PlaceholderValue<T> {
  return { value, isPlaceholder: true, label };
}

export function confirmed<T>(value: T, label: string): PlaceholderValue<T> {
  return { value, isPlaceholder: false, label };
}

export const PREORDER_CONFIG = {
  pricePerDesignKobo: placeholder(1500000, "Price per shirt (kobo)"),
  sizes: placeholder(
    ["S", "M", "L", "XL", "XXL"] as const,
    "Available shirt sizes"
  ),
  coloursByDesign: placeholder(
    {
      forgiven: ["black", "white", "blue", "burgundy", "neon-green"],
      "god-is-always-in-control": ["black", "navy", "green", "lime"],
      "im-righteous": ["black", "burgundy"],
      justified: ["black", "green", "white"],
    },
    "Colours for sale per design"
  ),
  cutoff: placeholder(
    "2026-10-18T23:59:59+01:00",
    "Pre-order cutoff timestamp (Africa/Lagos)"
  ),
  eventDate: confirmed("2026-10-26", "Event date (YYYY-MM-DD)"),
  eventName: placeholder("our 26 October event", "Public event name"),
  paymentWording: placeholder(
    "Full payment by bank transfer after confirmation",
    "Payment instructions copy"
  ),
  pickupDelivery: placeholder(
    {
      options: ["pickup", "delivery"] as const,
      feeKobo: 0,
      description: "Pickup at event + Lagos delivery, fee TBC",
    },
    "Fulfilment and delivery options"
  ),
  limitPerDesign: placeholder(null as number | null, "Order cap per design"),
} as const;

export type PreorderConfig = typeof PREORDER_CONFIG;

export function isPreorderOpen(now: Date = new Date()): boolean {
  const close = Date.parse(PREORDER_CONFIG.cutoff.value);
  return Number.isFinite(close) && now.getTime() < close;
}

export function hasActivePlaceholders(): boolean {
  return Object.values(PREORDER_CONFIG).some((item) => item.isPlaceholder);
}

export function getPlaceholderAudit(): Array<{
  key: string;
  label: string;
  value: unknown;
}> {
  return Object.entries(PREORDER_CONFIG)
    .filter(([, item]) => item.isPlaceholder)
    .map(([key, item]) => ({
      key,
      label: item.label,
      value: item.value,
    }));
}
