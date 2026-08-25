import type { Category, Product } from "@/types/catalog";

// Mock Image (placeholder until Sprint 2)
const PLACEHOLDER_IMAGE = {
  url: "samples/people/smiling-man.jpg", // Cloudinary sample asset
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAUABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABgUEB//EACYQAAICAQMEAgMBAAAAAAAAAAECAwQREiExBRNBUWEiMoH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmsmpRVoRlRLNJJ2jFdWyucV7PTCWN8lqb6bHcT0cAHH3RNFqcXp7dTjL3wuV+mXKuFweQBk2qlbXkrb1RXHqovf0A8uNPqvaaJpXdJZOqNLt3X0A//Z",
  alt: "",
  sortOrder: 0,
};

export const CATEGORIES: Category[] = [
  { id: "cat-1", slug: "t-shirts",    name: "T-Shirts",    description: "Faith-inspired everyday tees.", sortOrder: 1, comingSoon: false },
  { id: "cat-2", slug: "roundnecks",  name: "Roundnecks",  description: "Clean roundneck essentials.",   sortOrder: 2, comingSoon: false },
  { id: "cat-3", slug: "sweatshirts", name: "Sweatshirts", description: "Heavyweight street sweatshirts.", sortOrder: 3, comingSoon: false },
  { id: "cat-4", slug: "hoodies",     name: "Hoodies",     description: "Statement hoodies, oversized.",  sortOrder: 4, comingSoon: false },
  { id: "cat-5", slug: "caps",        name: "Caps",        description: "Structured faith caps.",         sortOrder: 5, comingSoon: false },
];

export const PRODUCTS: Product[] = [
  // T-Shirts
  {
    id: "prod-1", slug: "set-apart-tee", name: "Set Apart Tee",
    categorySlug: "t-shirts", featured: true, active: true,
    description: "Lightweight 100% cotton tee. Oversized fit.",
    scriptureRef: "Romans 12:2",
    images: [{ ...PLACEHOLDER_IMAGE, id: "img-1", alt: "Set Apart Tee — Black" }],
    variants: [
      { id: "v-1", productId: "prod-1", sku: "SAT-BLK-M", size: "M", colour: { name: "Black", hex: "#111110" }, priceKobo: 1500000, stock: null },
      { id: "v-2", productId: "prod-1", sku: "SAT-BLK-L", size: "L", colour: { name: "Black", hex: "#111110" }, priceKobo: 1500000, stock: null },
      { id: "v-3", productId: "prod-1", sku: "SAT-WHT-M", size: "M", colour: { name: "White", hex: "#FAFAF8" }, priceKobo: 1500000, stock: null },
    ],
  },
  // Roundnecks
  {
    id: "prod-2", slug: "rooted-roundneck", name: "Rooted Roundneck",
    categorySlug: "roundnecks", featured: true, active: true,
    description: "Premium heavyweight roundneck. Drop-shoulder fit.",
    scriptureRef: "Colossians 2:7",
    images: [{ ...PLACEHOLDER_IMAGE, id: "img-2", alt: "Rooted Roundneck — Sand" }],
    variants: [
      { id: "v-4", productId: "prod-2", sku: "RR-SND-M",  size: "M",  colour: { name: "Sand",  hex: "#C8973A" }, priceKobo: 2000000, stock: null },
      { id: "v-5", productId: "prod-2", sku: "RR-SND-L",  size: "L",  colour: { name: "Sand",  hex: "#C8973A" }, priceKobo: 2000000, stock: null },
      { id: "v-6", productId: "prod-2", sku: "RR-BLK-L",  size: "L",  colour: { name: "Black", hex: "#111110" }, priceKobo: 2000000, stock: null },
    ],
  },
  // Sweatshirts
  {
    id: "prod-3", slug: "called-sweatshirt", name: "Called Sweatshirt",
    categorySlug: "sweatshirts", featured: false, active: true,
    description: "Brushed fleece interior. Ribbed cuffs and hem.",
    scriptureRef: "1 Peter 2:9",
    images: [{ ...PLACEHOLDER_IMAGE, id: "img-3", alt: "Called Sweatshirt — Cream" }],
    variants: [
      { id: "v-7", productId: "prod-3", sku: "CS-CRM-L",  size: "L",  colour: { name: "Cream", hex: "#F2F1EE" }, priceKobo: 2500000, stock: null },
      { id: "v-8", productId: "prod-3", sku: "CS-CRM-XL", size: "XL", colour: { name: "Cream", hex: "#F2F1EE" }, priceKobo: 2500000, stock: null },
    ],
  },
  // Hoodies
  {
    id: "prod-4", slug: "anointed-hoodie", name: "Anointed Hoodie",
    categorySlug: "hoodies", featured: true, active: true,
    description: "Double-lined hood. Kangaroo pocket. Oversized silhouette.",
    scriptureRef: "Isaiah 61:1",
    images: [{ ...PLACEHOLDER_IMAGE, id: "img-4", alt: "Anointed Hoodie — Black" }],
    variants: [
      { id: "v-9",  productId: "prod-4", sku: "AH-BLK-L",  size: "L",  colour: { name: "Black", hex: "#111110" }, priceKobo: 3500000, stock: null },
      { id: "v-10", productId: "prod-4", sku: "AH-BLK-XL", size: "XL", colour: { name: "Black", hex: "#111110" }, priceKobo: 3500000, stock: null },
    ],
  },
  // Caps
  {
    id: "prod-5", slug: "chosen-cap", name: "Chosen Cap",
    categorySlug: "caps", featured: false, active: true,
    description: "6-panel structured cap. Embroidered logo.",
    scriptureRef: "John 15:16",
    images: [{ ...PLACEHOLDER_IMAGE, id: "img-5", alt: "Chosen Cap — Cream" }],
    variants: [
      { id: "v-11", productId: "prod-5", sku: "CC-CRM-OS", size: "ONE_SIZE", colour: { name: "Cream", hex: "#F2F1EE" }, priceKobo: 1200000, stock: null },
      { id: "v-12", productId: "prod-5", sku: "CC-BLK-OS", size: "ONE_SIZE", colour: { name: "Black", hex: "#111110" }, priceKobo: 1200000, stock: null },
    ],
  },
];
