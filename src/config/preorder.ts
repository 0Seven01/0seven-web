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
  pricing: confirmed(
    {
      gold: { paidKobo: 1800000, regularKobo: 2300000 },
      standard: { paidKobo: 1000000, regularKobo: 1200000 },
    },
    "Per-quality pre-order pricing (paid + struck regular), kobo"
  ),
  sizes: confirmed(
    ["S", "M", "L", "XL", "XXL"] as const,
    "Shirt sizes shown (unavailable ones greyed, not removed)"
  ),
  sizeAvailability: confirmed(
    { S: false, M: true, L: true, XL: true, XXL: false } as Record<string, boolean>,
    "Which sizes are available to pre-order (D-16: M/L/XL)"
  ),
  coloursByDesign: placeholder(
    {
      forgiven: ["black", "white", "blue", "burgundy", "neon-green"],
      "god-is-always-in-control": ["black", "navy", "green", "lime"],
      "im-righteous": ["black", "burgundy"],
      justified: ["black", "green", "white"],
      anegkletos: ["white"],
    },
    "Colours for sale per design"
  ),
  startDate: confirmed(
    "2026-10-15T00:00:00+01:00",
    "Pre-order campaign start timestamp (Africa/Lagos)"
  ),
  cutoff: confirmed(
    "2026-10-22T23:59:59+01:00",
    "Pre-order cutoff timestamp (Africa/Lagos)"
  ),
  eventDate: confirmed("2026-10-26", "Event date (YYYY-MM-DD)"),
  eventName: confirmed("Kairos Camp Meeting 2026", "Public event name"),
  flyerPublicId: confirmed("events/preorder-drop-1-flyer", "Cloudinary flyer public ID"),
  flyerFallbackUrl: confirmed("/images/preorder-drop-1-flyer.webp", "Local fallback flyer asset"),
  payment: confirmed(
    {
      bank: "Kuda MFB",
      accountNumber: "3002770131",
      accountName: "OLUWATOBILOBA FAGOYINBO",
      receiptNote: "Please send your payment receipt here on WhatsApp.",
    },
    "Bank transfer details + receipt instruction (D-15)"
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

export interface PreorderCheckOptions {
  override?: "open" | "closed" | null;
  isProduction?: boolean;
  cutoff?: string | null;
}

export function parseCutoffTimestamp(
  cutoff: string | null | undefined
): number | null {
  if (!cutoff || typeof cutoff !== "string" || !cutoff.trim()) return null;

  // Enforce ISO 8601 with explicit timezone offset (+01:00, +0100, or Z)
  const isoPattern =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?([+-]\d{2}:?\d{2}|Z)$/;
  const match = cutoff.trim().match(isoPattern);
  if (!match) return null;

  const [, yStr, mStr, dStr, hStr, minStr, sStr] = match;
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);
  const hour = parseInt(hStr, 10);
  const minute = parseInt(minStr, 10);
  const sec = parseInt(sStr, 10);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    sec > 59
  ) {
    return null;
  }

  // Validate calendar validity (e.g. leap years, 30-day months)
  const testDate = new Date(Date.UTC(year, month - 1, day));
  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day
  ) {
    return null;
  }

  const epoch = Date.parse(cutoff.trim());
  return Number.isFinite(epoch) ? epoch : null;
}

export function isProductionEnvironment(
  options?: PreorderCheckOptions
): boolean {
  if (options?.isProduction !== undefined) {
    return options.isProduction;
  }
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return true;
  }
  if (typeof window !== "undefined" && window.location) {
    if (window.location.hostname === "0seven.vercel.app") {
      return true;
    }
  }
  return false;
}

function getDevOverride(): "open" | "closed" | null {
  if (typeof window === "undefined" || !window.location) return null;
  try {
    const search = window.location.search;
    if (!search) return null;
    const params = new URLSearchParams(search);
    const val = params.get("preorder");
    if (val === "closed") return "closed";
    if (val === "open") return "open";
    return null;
  } catch {
    return null;
  }
}

let lastLoggedInvalidCutoff: unknown = undefined;

export function isPreorderOpen(
  now: Date = new Date(),
  options?: PreorderCheckOptions
): boolean {
  const isProd = isProductionEnvironment(options);

  if (!isProd) {
    if (options?.override !== undefined) {
      if (options.override === "closed") return false;
      if (options.override === "open") return true;
    } else {
      const urlOverride = getDevOverride();
      if (urlOverride === "closed") return false;
      if (urlOverride === "open") return true;
    }
  }

  const effectiveCutoff =
    options?.cutoff !== undefined
      ? options.cutoff
      : PREORDER_CONFIG.cutoff.value;

  const closeEpoch = parseCutoffTimestamp(effectiveCutoff);
  if (closeEpoch === null) {
    if (
      process.env.NODE_ENV !== "production" &&
      lastLoggedInvalidCutoff !== effectiveCutoff
    ) {
      lastLoggedInvalidCutoff = effectiveCutoff;
      console.error(
        `[0Seven preorder] Invalid or missing cutoff timestamp: "${effectiveCutoff}". Pre-orders are closed (fail-closed).`
      );
    }
    return false;
  }

  return now.getTime() < closeEpoch;
}

export type CampaignStage = "upcoming" | "open" | "closed";

export function getCampaignStage(
  now: Date = new Date(),
  options?: PreorderCheckOptions
): CampaignStage {
  if (!isPreorderOpen(now, options)) {
    return "closed";
  }

  const startEpoch = parseCutoffTimestamp(PREORDER_CONFIG.startDate.value);
  const currentTime = now.getTime();

  if (startEpoch !== null && currentTime < startEpoch) {
    const isProd = isProductionEnvironment(options);
    if (!isProd) {
      if (options?.override === "open" || getDevOverride() === "open") {
        return "open";
      }
    }
    return "upcoming";
  }

  return "open";
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

export function formatPreorderStartDate(startDate?: string | null): string {
  const rawStart =
    startDate !== undefined ? startDate : PREORDER_CONFIG.startDate.value;
  const epoch = parseCutoffTimestamp(rawStart);
  if (epoch === null) return "";

  const date = new Date(epoch);
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatPreorderCutoff(cutoff?: string | null): string {
  const rawCutoff =
    cutoff !== undefined ? cutoff : PREORDER_CONFIG.cutoff.value;
  const epoch = parseCutoffTimestamp(rawCutoff);
  if (epoch === null) return "";

  const date = new Date(epoch);
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function parseEventTimestamp(eventDate?: string | null): number | null {
  const rawDate =
    eventDate !== undefined ? eventDate : PREORDER_CONFIG.eventDate.value;
  if (!rawDate || typeof rawDate !== "string" || !rawDate.trim()) return null;

  const trimmed = rawDate.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const parseTarget = isoMatch ? `${trimmed}T00:00:00+01:00` : trimmed;
  const epoch = Date.parse(parseTarget);
  if (Number.isNaN(epoch)) return null;
  return epoch;
}

export function formatPreorderEventDate(eventDate?: string | null): string {
  const rawDate =
    eventDate !== undefined ? eventDate : PREORDER_CONFIG.eventDate.value;
  if (!rawDate || typeof rawDate !== "string" || !rawDate.trim()) return "";

  const trimmed = rawDate.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const parseTarget = isoMatch ? `${trimmed}T12:00:00Z` : trimmed;
  const epoch = Date.parse(parseTarget);
  if (Number.isNaN(epoch)) return "";

  const date = new Date(epoch);
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function isProductPreorderOpen(
  product: { preorderClosed?: boolean },
  campaignOpen: boolean
): boolean {
  if (!campaignOpen) return false;
  return !product.preorderClosed;
}

export function formatPreorderClosedMessage(options?: {
  eventName?: string | null;
  cutoff?: string | null;
}): string {
  const eventName =
    options?.eventName !== undefined && options?.eventName !== null
      ? options.eventName
      : PREORDER_CONFIG.eventName.value;
  const cutoffFormatted = formatPreorderCutoff(options?.cutoff);

  if (!cutoffFormatted) {
    return `Pre-orders for ${eventName} are now closed. Thank you!`;
  }
  return `Pre-orders for ${eventName} closed on ${cutoffFormatted}. Thank you!`;
}


