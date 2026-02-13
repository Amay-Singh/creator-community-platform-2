import { cn } from "@/lib/utils";
import Image from "next/image";
import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  status?: "online" | "offline" | "away" | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ className, src, alt, size = "md", fallback, status, ...props }: AvatarProps) {
  const sizes: Record<string, { container: string; text: string; pixels: number; statusDot: string }> = {
    sm: { container: "h-8 w-8", text: "text-xs", pixels: 32, statusDot: "h-2.5 w-2.5" },
    md: { container: "h-10 w-10", text: "text-sm", pixels: 40, statusDot: "h-3 w-3" },
    lg: { container: "h-14 w-14", text: "text-base", pixels: 56, statusDot: "h-3.5 w-3.5" },
    xl: { container: "h-20 w-20", text: "text-lg", pixels: 80, statusDot: "h-4 w-4" },
  };

  const statusColors: Record<string, string> = {
    online: "bg-secondary-emerald",
    offline: "bg-muted-foreground",
    away: "bg-secondary-orange",
  };

  const sizeConfig = sizes[size];

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-muted",
          sizeConfig.container
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={sizeConfig.pixels}
            height={sizeConfig.pixels}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center gradient-primary text-white font-medium",
              sizeConfig.text
            )}
            aria-label={alt}
          >
            {fallback || getInitials(alt)}
          </div>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-card",
            statusColors[status],
            sizeConfig.statusDot
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export { Avatar };
