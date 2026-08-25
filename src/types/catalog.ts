export type Size = "S" | "M" | "L" | "XL" | "XXL" | "ONE_SIZE";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  blurDataURL: string;
  sortOrder: number;
}

export interface Colour {
  name: string;
  hex: string;
}

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  size: Size;
  colour: Colour;
  priceKobo: number;
  stock: null; // always null in Phase 0
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
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  comingSoon: boolean;
}
