"use client";

import { getWhatsAppNumber } from "@/lib/checkout";

interface CustomColourRequestProps {
  productName: string;
}

export function CustomColourRequest({ productName }: CustomColourRequestProps) {
  let href: string | null = null;
  try {
    const number = getWhatsAppNumber();
    const message = `Hi 0Seven! I'd like to request a custom colour for "${productName}" (pre-order).`;
    href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  } catch {
    href = null;
  }

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[0.78rem] text-[var(--color-accent)] underline hover:opacity-80 transition-opacity"
    >
      Need another colour? Request it on WhatsApp &rarr;
    </a>
  );
}
