"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md";
  
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  const variants = {
    primary: "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)]",
    secondary: "bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border)]",
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)]",
    danger: "bg-[var(--color-error)] text-white hover:opacity-90",
    ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]",
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`;

  return (
    <button className={classes} disabled={loading || disabled} {...props}>
      {loading ? (
        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
