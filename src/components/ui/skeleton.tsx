import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const variants: Record<string, string> = {
    default: "h-4 w-full rounded-lg",
    circular: "h-12 w-12 rounded-full",
    text: "h-4 w-3/4 rounded-md",
  };

  return (
    <div
      className={cn("animate-pulse bg-muted", variants[variant], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
