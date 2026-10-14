export type Size = "S" | "M" | "L" | "XL" | "XXL" | "ONE_SIZE";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  blurDataURL: string;
  sortOrder: number;
  colourName?: string;
}

export interface Colour {
  name: string;
  hex: string;
}

export type Quality = "gold" | "standard";

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  size: Size;
  colour: Colour;
  quality: Quality;
  priceKobo: number;
  compareAtKobo: number; // struck-through regular price; display-only, never charged
  stock: null; // always null in Phase 0
  active?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  scriptureRef?: string;
  images: ProductImage[];
  variants: Variant[];
  featured: boolean;
  active: boolean;
  preorderClosed?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  comingSoon: boolean;
  active: boolean;
}
