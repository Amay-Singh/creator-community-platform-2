"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ad {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  category: "course" | "equipment" | "tool" | "service";
  sponsor: string;
  imageGradient: string;
}

const mockAds: Ad[] = [
  {
    id: "ad1",
    title: "Master Music Production",
    description: "Learn Ableton Live from industry professionals. 50+ hours of content.",
    ctaText: "Start Free Trial",
    ctaUrl: "#",
    category: "course",
    sponsor: "ProducerAcademy",
    imageGradient: "from-blue-500 to-purple-500",
  },
  {
    id: "ad2",
    title: "Studio Monitors — 20% Off",
    description: "Professional-grade monitors for your home studio setup.",
    ctaText: "Shop Now",
    ctaUrl: "#",
    category: "equipment",
    sponsor: "AudioGear",
    imageGradient: "from-orange-500 to-red-500",
  },
  {
    id: "ad3",
    title: "AI Mastering Tool",
    description: "Get radio-ready masters in seconds with AI-powered processing.",
    ctaText: "Try Free",
    ctaUrl: "#",
    category: "tool",
    sponsor: "MasterAI",
    imageGradient: "from-emerald-500 to-teal-500",
  },
];

interface AdBannerProps {
  variant?: "sidebar" | "inline" | "banner";
  className?: string;
}

export function AdBanner({ variant = "sidebar", className }: AdBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleAds = mockAds.filter((ad) => !dismissed.has(ad.id));
  if (visibleAds.length === 0) return null;

  const ad = visibleAds[0];

  if (variant === "banner") {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden", className)}>
        <div className={cn("bg-gradient-to-r p-4 flex items-center justify-between gap-4", ad.imageGradient)}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/60 uppercase tracking-wider">Sponsored by {ad.sponsor}</span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">{ad.title}</p>
            <p className="text-xs text-white/80 mt-0.5">{ad.description}</p>
          </div>
          <a
            href={ad.ctaUrl}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
          >
            {ad.ctaText}
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(ad.id))}
            className="absolute top-2 right-2 rounded-full p-1 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("relative rounded-xl border border-border bg-card p-4", className)}>
        <div className="flex items-start gap-3">
          <div className={cn("h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center", ad.imageGradient)}>
            <span className="text-lg text-white">✦</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-card-foreground">{ad.title}</p>
              <span className="text-[9px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">Ad</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{ad.description}</p>
            <a href={ad.ctaUrl} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {ad.ctaText} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(ad.id))}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-2 text-[9px] text-muted-foreground">Sponsored by {ad.sponsor}</p>
      </div>
    );
  }

  // sidebar (default)
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden", className)}>
      <div className={cn("h-24 bg-gradient-to-br flex items-center justify-center", ad.imageGradient)}>
        <span className="text-3xl text-white">✦</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">Sponsored</span>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(ad.id))}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="mt-2 text-sm font-semibold text-card-foreground">{ad.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{ad.description}</p>
        <a
          href={ad.ctaUrl}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          {ad.ctaText} <ExternalLink className="h-3 w-3" />
        </a>
        <p className="mt-2 text-center text-[9px] text-muted-foreground">by {ad.sponsor}</p>
      </div>
    </div>
  );
}
