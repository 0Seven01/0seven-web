"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
}

export function Badge({
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-fg)]",
    success: "bg-[var(--color-success)] text-white",
    warning: "bg-[var(--color-warning)] text-white",
    danger: "bg-[var(--color-error)] text-white",
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
