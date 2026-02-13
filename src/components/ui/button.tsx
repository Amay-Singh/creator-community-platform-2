"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants: Record<string, string> = {
      primary: "bg-primary text-white hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg",
      secondary: "bg-secondary-purple text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md",
      outline: "border-2 border-border bg-transparent text-foreground hover:bg-muted hover:border-primary",
      ghost: "bg-transparent text-foreground hover:bg-muted",
      gradient: "gradient-primary text-white hover:scale-[1.05] active:scale-[0.98] shadow-md hover:shadow-lg",
    };

    const sizes: Record<string, string> = {
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-base gap-2",
      lg: "h-13 px-8 text-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
