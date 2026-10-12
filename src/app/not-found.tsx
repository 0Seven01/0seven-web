import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page or category you are looking for does not exist or is currently unavailable.",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)] px-3 py-1 bg-[var(--color-surface)] rounded-full">
          404 Error
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed">
          The piece or category you are looking for is currently unavailable or does not exist.
        </p>
        <Link href="/shop" className="mt-2">
          <Button variant="accent" size="lg">
            Back to Shop
          </Button>
        </Link>
      </div>
    </main>
  );
}
