import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary-purple/10 text-secondary-purple",
    success: "bg-secondary-emerald/10 text-secondary-emerald",
    warning: "bg-secondary-orange/10 text-secondary-orange",
    destructive: "bg-secondary-rose/10 text-secondary-rose",
    outline: "border border-border bg-transparent text-foreground",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
