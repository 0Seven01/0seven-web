"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import { RecoveryBanner } from "@/components/RecoveryBanner";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/shop",              label: "Shop" },
  { href: "/footwear",          label: "Footwear" },
  { href: "/about",             label: "About" },
  { href: "/size-guide",        label: "Size Guide" },
  { href: "/faqs",              label: "FAQs" },
  { href: "/shipping-returns",  label: "Shipping & Returns" },
  { href: "/contact",           label: "Contact" },
];

const emptySubscribe = () => () => {};

export function Header() {
  const { itemCount, checkoutInitiated, items } = useCart();
  const { isOpen } = usePreorderStatus();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOnline } = useNetworkStatus();

  const hasRecoveryBanner = Boolean(isOpen && checkoutInitiated && items.length > 0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const lastScrollY = useRef(0);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!hasRecoveryBanner) return;

    const el = bannerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.getBoundingClientRect().height;
        if (height > 0) {
          setBannerHeight(height);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasRecoveryBanner]);

  useEffect(() => {
    if (!hasRecoveryBanner) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

          if (currentScrollY >= maxScroll - 20) {
            ticking = false;
            return;
          }

          if (currentScrollY <= 10) {
            setIsBannerVisible(true);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          const delta = currentScrollY - lastScrollY.current;

          if (Math.abs(delta) >= 15) {
            if (delta > 0 && currentScrollY > 60) {
              setIsBannerVisible(false);
            } else if (delta < 0) {
              setIsBannerVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasRecoveryBanner]);

  const translateY = hasRecoveryBanner && !isBannerVisible ? -bannerHeight : 0;
  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const themeIcon = !mounted ? "○" : theme === "light" ? "☀︎" : theme === "dark" ? "☽" : "⊙";

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--color-bg)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      {hasRecoveryBanner && (
        <div ref={bannerRef}>
          <RecoveryBanner />
        </div>
      )}

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-[var(--color-accent)] text-[var(--color-accent-fg)] px-4 py-2 rounded-md font-medium"
      >
        Skip to content
      </a>

      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="0Seven"
          className="flex items-center text-[var(--color-accent)] hover:opacity-90 transition-opacity"
        >
          <Logo className="h-7 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex gap-3 xl:gap-6 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-text-secondary)] text-xs xl:text-sm font-medium hover:text-[var(--color-accent)] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Offline indicator */}
          {!isOnline && (
            <span
              title="You're offline — your cart is saved"
              className="inline-flex items-center gap-1 bg-[var(--color-error)] text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full tracking-[0.04em] uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
              Offline
            </span>
          )}

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

          {/* Hamburger — mobile and tablet */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-[1.25rem] text-[var(--color-text-primary)] p-1 hover:text-[var(--color-accent)] transition-colors focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
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
