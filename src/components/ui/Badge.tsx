interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "muted" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "muted", className = "" }: BadgeProps) {
  const baseClasses = "inline-block px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold tracking-[0.08em] uppercase";
  
  const variantClasses = {
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
    muted: "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
    primary: "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border)]",
    success: "bg-[var(--color-success)] text-white",
    warning: "bg-[var(--color-warning)] text-white",
    danger: "bg-[var(--color-error)] text-white",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
