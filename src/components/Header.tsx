"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/shop",              label: "Shop" },
  { href: "/footwear",          label: "Footwear" },
  { href: "/about",             label: "About" },
  { href: "/size-guide",        label: "Size Guide" },
  { href: "/faqs",              label: "FAQs" },
  { href: "/shipping-returns",  label: "Shipping & Returns" },
  { href: "/contact",           label: "Contact" },
];

export function Header() {
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent hydration mismatch on theme icon
  useEffect(() => setMounted(true), []);

  const closeMenu = () => setMenuOpen(false);

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const themeIcon = !mounted ? "○" : theme === "light" ? "☀︎" : theme === "dark" ? "☽" : "⊙";

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="absolute left-[-9999px] top-auto z-[100] focus:left-4 focus:top-4 bg-[var(--color-accent)] text-[var(--color-accent-fg)] px-4 py-2 rounded-md font-medium"
      >
        Skip to content
      </a>

      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl tracking-[0.08em] text-[var(--color-text-primary)]"
        >
          0SEVEN
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden-mobile flex gap-6 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-text-secondary)] text-sm font-medium hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(nextTheme)}
            aria-label="Toggle theme"
            className="text-[1.1rem] text-[var(--color-text-secondary)] p-1 hover:text-[var(--color-accent)] transition-colors focus:outline-none"
          >
            {themeIcon}
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative text-[var(--color-text-primary)] text-[1.1rem] hover:text-[var(--color-accent)] transition-colors p-1"
          >
            ⌂
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-accent)] text-[var(--color-accent-fg)] rounded-full text-[0.65rem] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="show-mobile text-[1.25rem] text-[var(--color-text-primary)] p-1 hover:text-[var(--color-accent)] transition-colors focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 flex flex-col gap-4 absolute w-full"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-[var(--color-text-primary)] text-base font-medium py-2 border-b border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
