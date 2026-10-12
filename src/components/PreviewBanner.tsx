import { hasActivePlaceholders } from "@/config/preorder";

export function PreviewBanner() {
  if (!hasActivePlaceholders()) return null;

  return (
    <div
      role="status"
      aria-label="Preview notice"
      className="w-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)] text-xs text-center py-1.5 px-4 font-medium"
    >
      Preview mode — prices and terms are provisional and subject to confirmation.
    </div>
  );
}
