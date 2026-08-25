"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, endAdornment, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full rounded-md border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-[var(--color-error)] focus:ring-[var(--color-error)]" : "border-[var(--color-border)]"
            } ${endAdornment ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[var(--color-text-secondary)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
