"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-xl border border-[var(--color-border)] overflow-hidden";
  
  const variants = {
    default: "bg-[var(--color-surface)]",
    elevated: "bg-[var(--color-surface-raised)] shadow-sm",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const classes = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
