import type { Category, Product, ProductImage, Variant, Size, Colour, Quality } from "../types/catalog.ts";
import { PREORDER_CONFIG } from "../config/preorder.ts";
import { buildCloudinaryLqipUrl } from "../lib/cloudinary.ts";

const PRICING = PREORDER_CONFIG.pricing.value;
for (const [tier, p] of Object.entries(PRICING)) {
  if (
    !Number.isFinite(p.paidKobo) ||
    p.paidKobo <= 0 ||
    !Number.isFinite(p.regularKobo) ||
    p.regularKobo <= 0
  ) {
    throw new Error(`[catalog] Invariant violated: pricing.${tier} needs positive finite paidKobo and regularKobo`);
  }
}
const QUALITIES = Object.keys(PRICING) as Quality[];

export const CATEGORIES: Category[] = [
  { id: "cat-1", slug: "t-shirts",    name: "T-Shirts",    description: "Faith-inspired everyday tees.", sortOrder: 1, comingSoon: false, active: true },
  { id: "cat-2", slug: "roundnecks",  name: "Roundnecks",  description: "Clean roundneck essentials.",   sortOrder: 2, comingSoon: false, active: false },
  { id: "cat-3", slug: "sweatshirts", name: "Sweatshirts", description: "Heavyweight street sweatshirts.", sortOrder: 3, comingSoon: false, active: false },
  { id: "cat-4", slug: "hoodies",     name: "Hoodies",     description: "Statement hoodies, oversized.",  sortOrder: 4, comingSoon: false, active: false },
  { id: "cat-5", slug: "caps",        name: "Caps",        description: "Structured faith caps.",         sortOrder: 5, comingSoon: false, active: false },
];

const COLOUR_PALETTE: Record<string, Colour> = {
  black: { name: "Black", hex: "#111110" },
  white: { name: "White", hex: "#FAFAF8" },
  blue: { name: "Blue", hex: "#1E3A8A" },
  burgundy: { name: "Burgundy", hex: "#5B1424" },
  "neon-green": { name: "Neon green", hex: "#70F250" },
  green: { name: "Green", hex: "#013920" },
  lime: { name: "Lime", hex: "#70F250" },
  navy: { name: "Navy", hex: "#0F1D38" },
};

function createVariants(
  productId: string,
  prefix: string,
  availableColourKeys: readonly string[],
  productSlug: string
): Variant[] {
  const variants: Variant[] = [];
  const activeColours = PREORDER_CONFIG.coloursByDesign.value[
    productSlug as keyof typeof PREORDER_CONFIG.coloursByDesign.value
  ] as readonly string[] | undefined;
  const activeColourSlugs = new Set(activeColours ?? []);
  const sizes = PREORDER_CONFIG.sizes.value;
  const sizeAvailability = PREORDER_CONFIG.sizeAvailability.value;

  for (const colourKey of availableColourKeys) {
    const colour = COLOUR_PALETTE[colourKey];
    if (!colour) continue;
    const isColourActive = activeColourSlugs.has(colourKey);
    const colourCode = colourKey.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);

    for (const size of sizes) {
      const isSizeActive = sizeAvailability[size] === true;
      for (const quality of QUALITIES) {
        const price = PRICING[quality];
        variants.push({
          id: `${productId}-${colourKey}-${size.toLowerCase()}-${quality}`,
          productId,
          sku: `${prefix}-${colourCode}-${size}-${quality.toUpperCase().slice(0, 3)}`,
          size: size as Size,
          colour,
          quality,
          priceKobo: price.paidKobo,
          compareAtKobo: price.regularKobo,
          stock: null,
          active: isColourActive && isSizeActive,
        });
      }
    }
  }
  return variants;
}

function createImage(
  id: string,
  publicId: string,
  productName: string,
  colourName: string,
  sortOrder: number
): ProductImage {
  return {
    id,
    url: publicId,
    alt: `${productName} — ${colourName}`,
    blurDataURL: buildCloudinaryLqipUrl(publicId),
    sortOrder,
    colourName,
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-forgiven",
    slug: "forgiven",
    name: "Forgiven",
    categorySlug: "t-shirts",
    featured: true,
    active: true,
    description: "Faith-inspired heavyweight graphic tee. 'FOR GIV EN' print on the front with cross motif: 'The Cross = Forgiveness'.",
    images: [
      createImage("img-fg-1", "forgiven--black-hanger", "Forgiven", "Black", 1),
      createImage("img-fg-2", "forgiven--white-model", "Forgiven", "White", 2),
      createImage("img-fg-3", "forgiven--white-lookbook", "Forgiven", "White", 3),
      createImage("img-fg-4", "forgiven--blue-lookbook", "Forgiven", "Blue", 4),
      createImage("img-fg-5", "forgiven--burgundy-back", "Forgiven", "Burgundy", 5),
      createImage("img-fg-6", "forgiven--neon-green-flatlay", "Forgiven", "Neon green", 6),
    ],
    variants: createVariants("prod-forgiven", "FGV", ["black", "white", "blue", "burgundy", "neon-green"], "forgiven"),
  },
  {
    id: "prod-god-is-always-in-control",
    slug: "god-is-always-in-control",
    name: "God is always in Control",
    categorySlug: "t-shirts",
    featured: true,
    active: true,
    description: "Heavyweight streetwear tee featuring bold 'GOD IS ALWAYS IN [Ctrl]' typography print.",
    images: [
      createImage("img-ctrl-1", "god-is-always-in-control--black-studio", "God is always in Control", "Black", 1),
      createImage("img-ctrl-2", "god-is-always-in-control--black-hanger", "God is always in Control", "Black", 2),
      createImage("img-ctrl-3", "god-is-always-in-control--black-flatlay", "God is always in Control", "Black", 3),
      createImage("img-ctrl-4", "god-is-always-in-control--black-back", "God is always in Control", "Black", 4),
      createImage("img-ctrl-5", "god-is-always-in-control--navy-model", "God is always in Control", "Navy", 5),
      createImage("img-ctrl-6", "god-is-always-in-control--navy-back", "God is always in Control", "Navy", 6),
      createImage("img-ctrl-7", "god-is-always-in-control--green-lookbook", "God is always in Control", "Green", 7),
      createImage("img-ctrl-8", "god-is-always-in-control--green-back", "God is always in Control", "Green", 8),
      createImage("img-ctrl-9", "god-is-always-in-control--lime-studio", "God is always in Control", "Lime", 9),
    ],
    variants: createVariants("prod-god-is-always-in-control", "GIC", ["black", "navy", "green", "lime"], "god-is-always-in-control"),
  },
  {
    id: "prod-im-righteous",
    slug: "im-righteous",
    name: "I'm Righteous",
    categorySlug: "t-shirts",
    featured: true,
    active: true,
    description: "Statement oversized tee with 'I\\'M RIGHTEOUS AND THAT\\'S IT' typography print.",
    images: [
      createImage("img-rt-1", "im-righteous--black-model", "I'm Righteous", "Black", 1),
      createImage("img-rt-2", "im-righteous--black-hanger", "I'm Righteous", "Black", 2),
      createImage("img-rt-3", "im-righteous--burgundy-lookbook", "I'm Righteous", "Burgundy", 3),
    ],
    variants: createVariants("prod-im-righteous", "IMR", ["black", "burgundy"], "im-righteous"),
  },
  {
    id: "prod-justified",
    slug: "justified",
    name: "Justified",
    categorySlug: "t-shirts",
    featured: true,
    active: true,
    description: "Signature street tee featuring 'JUST AS IF I\\'D NEVER SINNED' graphic cross design.",
    images: [
      createImage("img-just-1", "justified--black-hanger", "Justified", "Black", 1),
      createImage("img-just-2", "justified--black-back", "Justified", "Black", 2),
      createImage("img-just-3", "justified--green-model-street", "Justified", "Green", 3),
      createImage("img-just-4", "justified--green-model-wall", "Justified", "Green", 4),
      createImage("img-just-5", "justified--green-hanger", "Justified", "Green", 5),
      createImage("img-just-6", "justified--green-back", "Justified", "Green", 6),
      createImage("img-just-7", "justified--white-lookbook", "Justified", "White", 7),
    ],
    variants: createVariants("prod-justified", "JST", ["black", "green", "white"], "justified"),
  },
];
