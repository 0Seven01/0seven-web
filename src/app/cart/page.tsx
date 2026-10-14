"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatNaira, formatWhatsAppNumber } from "@/lib/format";
import {
  WhatsAppCheckout,
  buildPreorderMessage,
  getWhatsAppNumber,
  QUALITY_LABELS,
} from "@/lib/checkout";
import { SOCIALS } from "@/config/socials";
import { copyToClipboard } from "@/lib/clipboard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { CartCustomerForm } from "@/components/CartCustomerForm";
import { customerDetailsSchema } from "@/lib/validation/customer";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { usePreorderStatus } from "@/hooks/usePreorderStatus";
import { formatPreorderClosedMessage } from "@/config/preorder";
import type { CustomerDetails } from "@/types/customer";

const checkout = new WhatsAppCheckout();

export default function CartPage() {
  const {
    items,
    totalKobo,
    itemCount,
    customer,
    orderReference,
    removeItem,
    updateQuantity,
    clearCart,
    getOrCreateOrderReference,
  } = useCart();
  const { isOnline } = useNetworkStatus();
  const { isOpen } = usePreorderStatus();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isFallbackOpen, setIsFallbackOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual-copy">("idle");
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (items.length > 0 && !orderReference) {
      getOrCreateOrderReference();
    }
  }, [items.length, orderReference, getOrCreateOrderReference]);

  let whatsappNumber = "";
  try {
    whatsappNumber = getWhatsAppNumber();
  } catch {
    whatsappNumber = "";
  }
  const formattedWhatsAppNumber = formatWhatsAppNumber(whatsappNumber);

  const activeOrderReference = orderReference || "";
  const orderMessage =
    items.length > 0 && activeOrderReference
      ? buildPreorderMessage({
          cart: items,
          customer,
          reference: activeOrderReference,
        })
      : "";

  const handleCopy = async () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    const ref = orderReference || getOrCreateOrderReference();
    const messageToCopy =
      orderMessage ||
      buildPreorderMessage({
        cart: items,
        customer,
        reference: ref,
      });
    const result = await copyToClipboard(messageToCopy, textareaRef.current);
    if (result.success) {
      setCopyStatus("copied");
      setLiveAnnouncement("Order text copied to clipboard.");
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus("idle");
      }, 2500);
    } else {
      setCopyStatus("manual-copy");
      setLiveAnnouncement(
        "Automatic copy failed. Order text is selected above — press Ctrl+C or tap to copy."
      );
      copyTimeoutRef.current = setTimeout(() => {
        setCopyStatus("idle");
      }, 5000);
    }
  };

  const handleMobileFallbackClick = () => {
    if (!orderReference) {
      getOrCreateOrderReference();
    }
    setIsFallbackOpen(true);
    const el = document.getElementById("whatsapp-fallback-panel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearFieldError = (field: keyof CustomerDetails) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (!isOpen) {
      setCheckoutError(formatPreorderClosedMessage());
      return;
    }
    const result = customerDetailsSchema.safeParse(customer);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFormErrors(errors);
      const firstErrorField = result.error.issues[0]?.path[0];
      const targetId =
        firstErrorField === "fullName"
          ? "cart-fullname"
          : firstErrorField === "phone"
          ? "cart-phone"
          : firstErrorField === "deliveryAddress"
          ? "cart-address"
          : "cart-fullname";
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.focus();
      }
      return;
    }

    setFormErrors({});
    try {
      const reference = getOrCreateOrderReference();
      await checkout.checkout(items, customer, { reference });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to initiate WhatsApp checkout.";
      setCheckoutError(msg);
      const summaryEl = document.getElementById("order-summary");
      if (summaryEl) {
        summaryEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Your cart is empty.</p>
          <Link href="/shop">
            <Button variant="accent" size="lg" className="w-full">Browse products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-4 pb-28 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart ({itemCount} items)</h1>

        <div className="flex flex-col md:flex-row gap-6 xl:gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              {items.map((item) => {
                const productHref = `/shop/${item.categorySlug}/${item.slug}`;
                return (
                  <Card key={item.variantId} variant="default" padding="sm" className="flex flex-row items-center gap-3 md:gap-4 p-3 md:p-4">
                    <Link
                      href={productHref}
                      aria-label={`View ${item.productName} in ${item.colourName}`}
                      className="relative w-24 h-28 md:w-28 md:h-32 bg-[var(--color-surface-raised)] rounded-md shrink-0 overflow-hidden border border-[var(--color-border)] block group hover:opacity-95 transition-opacity"
                    >
                      {item.imageUrl ? (
                        <CloudinaryImage
                          src={item.imageUrl}
                          alt={`${item.productName} — ${item.colourName}`}
                          swatchHex={item.colourHex}
                          fill
                          sizes="(max-width: 768px) 96px, 112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-text-muted)] font-medium p-2 text-center">
                          {item.productName}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="min-w-0 text-left">
                        <Link href={productHref} className="hover:underline">
                          <h3 className="font-semibold text-base md:text-lg truncate text-[var(--color-text-primary)]">{item.productName}</h3>
                        </Link>
                        <p className="text-[var(--color-text-secondary)] text-sm">{QUALITY_LABELS[item.quality]} · {item.colourName}, {item.size}</p>
                        <p className="font-bold text-[var(--color-text-primary)] mt-1">{formatNaira(item.priceKobo)}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 shrink-0">
                        <div className="flex items-center gap-1 md:gap-2 bg-[var(--color-surface-raised)] rounded-md p-1 border border-[var(--color-border)]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.productName}, ${item.colourName}, ${item.size}`}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] cursor-pointer touch-manipulation select-none rounded focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-inherit"
                          >−</button>
                          <span className="min-w-[28px] px-1 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.productName}, ${item.colourName}, ${item.size}`}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] cursor-pointer touch-manipulation select-none rounded focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none focus:outline-none"
                          >+</button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Remove ${item.productName}, ${item.colourName}, ${item.size} from cart`}
                          className="text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white min-w-[44px] min-h-[44px] px-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-error)] focus-visible:outline-none"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <CartCustomerForm
              errors={formErrors}
              onClearError={clearFieldError}
            />
          </div>

          <div className="w-full md:w-72 xl:w-80">
            <Card variant="elevated" padding="md" className="sticky top-8" id="order-summary">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between font-bold text-lg mb-6 border-t border-[var(--color-border)] pt-4">
                <span>Total</span>
                <span>{formatNaira(totalKobo)}</span>
              </div>

              {checkoutError && (
                <div
                  role="alert"
                  className="p-3.5 mb-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-error)] text-[var(--color-error)] text-xs font-medium space-y-1"
                >
                  <p className="m-0">{checkoutError}</p>
                  {checkoutError.includes("Instagram") && (
                    <a
                      href={SOCIALS.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block underline font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] pt-0.5"
                    >
                      Contact @{SOCIALS.instagram.handle} on Instagram →
                    </a>
                  )}
                </div>
              )}

              {!isOpen ? (
                <div className="mb-4">
                  <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-center mb-3">
                    <p className="font-semibold text-[var(--color-text-primary)] m-0 mb-1">
                      Pre-orders Closed
                    </p>
                    <p className="text-[var(--color-text-secondary)] text-[0.85rem] m-0">
                      {formatPreorderClosedMessage()}
                    </p>
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Pre-orders Closed
                  </Button>
                </div>
              ) : isOnline ? (
                <div className="mb-4">
                  <Button variant="accent" size="lg" className="w-full mb-3" onClick={handleCheckout}>
                    Order on WhatsApp
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!orderReference) getOrCreateOrderReference();
                      setIsFallbackOpen(!isFallbackOpen);
                    }}
                    aria-expanded={isFallbackOpen}
                    aria-controls="whatsapp-fallback-panel"
                    className="w-full text-center text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] underline min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {isFallbackOpen ? "Hide order text" : "WhatsApp didn't open?"}
                  </button>

                  {isFallbackOpen && (
                    <div
                      id="whatsapp-fallback-panel"
                      role="region"
                      aria-label="WhatsApp order text fallback"
                      className="mt-3 p-3.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 text-left"
                    >
                      <p className="text-xs text-[var(--color-text-secondary)] m-0">
                        If WhatsApp didn&apos;t launch, copy your order text and send it directly to our WhatsApp number:
                      </p>

                      {formattedWhatsAppNumber ? (
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            WhatsApp:{" "}
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-mono"
                            >
                              {formattedWhatsAppNumber}
                            </a>
                          </span>
                          <a
                            href={`tel:+${whatsappNumber}`}
                            className="text-[0.75rem] text-[var(--color-text-muted)] hover:underline"
                          >
                            Tap to dial: +{whatsappNumber}
                          </a>
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--color-error)] m-0 space-y-1">
                          <p className="m-0 font-medium">
                            Ordering is temporarily unavailable — please contact us on Instagram.
                          </p>
                          <a
                            href={SOCIALS.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block underline text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold"
                          >
                            @{SOCIALS.instagram.handle} on Instagram →
                          </a>
                        </div>
                      )}

                      <textarea
                        ref={textareaRef}
                        readOnly
                        rows={6}
                        value={orderMessage}
                        aria-label="Order summary message"
                        className="w-full p-2.5 text-xs font-mono bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                      />

                      <Button
                        variant={copyStatus === "copied" ? "accent" : "secondary"}
                        size="sm"
                        onClick={handleCopy}
                        className="w-full min-h-[44px] text-xs font-semibold"
                      >
                        {copyStatus === "copied" ? "✓ Order text copied!" : "Copy Order Text"}
                      </Button>

                      {copyStatus === "manual-copy" && (
                        <p className="text-xs text-[var(--color-warning)] font-medium m-0">
                          Automatic copy failed. The text is selected above — press Ctrl+C or tap to copy.
                        </p>
                      )}

                      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                        {liveAnnouncement}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-center mb-4">
                  <p className="font-semibold text-[var(--color-text-primary)] m-0 mb-1">
                    You&apos;re offline.
                  </p>
                  <p className="text-[var(--color-text-muted)] text-[0.85rem] m-0">
                    Connect to place your order — your cart is saved.
                  </p>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full min-h-[44px] text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                onClick={() => {
                  if (confirm("Order sent? This will clear your cart.")) clearCart();
                }}
              >
                Order sent — clear my cart
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[var(--color-text-secondary)] block">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-bold text-lg text-[var(--color-text-primary)]">
            {formatNaira(totalKobo)}
          </span>
        </div>
        {!isOpen ? (
          <Button
            variant="accent"
            size="md"
            disabled
            className="font-bold shrink-0 min-h-[44px] opacity-50 cursor-not-allowed"
          >
            Pre-orders Closed
          </Button>
        ) : isOnline ? (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Button
              variant="accent"
              size="md"
              onClick={handleCheckout}
              className="font-bold min-h-[44px]"
            >
              Order on WhatsApp
            </Button>
            <button
              type="button"
              onClick={handleMobileFallbackClick}
              className="text-[0.75rem] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] underline cursor-pointer p-0.5"
            >
              WhatsApp didn&apos;t open?
            </button>
          </div>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)] text-right">
            Go online to order
          </span>
        )}
      </div>
    </main>
  );
}
