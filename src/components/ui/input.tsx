"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="relative w-full">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "peer w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-card-foreground transition-all duration-200",
            "placeholder-transparent",
            "hover:border-primary/50",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            icon && "pl-10",
            error && "border-secondary-rose focus:border-secondary-rose focus:ring-secondary-rose/20",
            className
          )}
          placeholder={label || " "}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-3 origin-top-left text-muted-foreground transition-all duration-200",
              "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
              "peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary",
              "peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:scale-75",
              icon && "left-10",
              focused && "text-primary",
              error && "text-secondary-rose"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-secondary-rose" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
