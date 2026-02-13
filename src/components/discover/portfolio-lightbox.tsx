"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

interface PortfolioLightboxProps {
  items: PortfolioItem[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function PortfolioLightbox({ items, initialIndex = 0, open, onClose }: PortfolioLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  const current = items[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % items.length);
    setZoomed(false);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + items.length) % items.length);
    setZoomed(false);
  }, [items.length]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, goNext, goPrev]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomed(false);
  }, [initialIndex, open]);

  if (!open || items.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio lightbox"
    >
      <div
        className="relative flex h-full w-full max-h-[90vh] max-w-5xl flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Next item"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Media display */}
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          {current.mediaType === "image" && (
            <img
              src={current.url}
              alt={current.title}
              className={cn(
                "max-h-[70vh] rounded-lg object-contain transition-transform duration-300",
                zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              )}
              onClick={() => setZoomed(!zoomed)}
            />
          )}
          {current.mediaType === "video" && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-64 w-96 items-center justify-center rounded-xl bg-black/40">
                <Play className="h-16 w-16 text-white/70" />
                <p className="absolute bottom-4 text-sm text-white/60">Video preview — connect backend to stream</p>
              </div>
            </div>
          )}
          {current.mediaType === "audio" && (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                <Music className="h-10 w-10 text-white" />
              </div>
              <p className="text-lg font-semibold text-white">{current.title}</p>
              <p className="text-sm text-white/60">Audio playback — connect backend to stream</p>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/5 px-6 py-3 backdrop-blur-sm">
          <div>
            <p className="text-sm font-semibold text-white">{current.title}</p>
            {current.description && (
              <p className="mt-0.5 text-xs text-white/60">{current.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {current.mediaType === "image" && (
              <button
                onClick={() => setZoomed(!zoomed)}
                className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </button>
            )}
            <span className="text-xs text-white/40">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setCurrentIndex(idx); setZoomed(false); }}
                className={cn(
                  "h-12 w-12 shrink-0 rounded-lg border-2 transition-all",
                  idx === currentIndex
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
                aria-label={`View ${item.title}`}
              >
                {item.mediaType === "image" ? (
                  <img src={item.thumbnailUrl || item.url} alt="" className="h-full w-full rounded-md object-cover" />
                ) : item.mediaType === "video" ? (
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-white/10">
                    <Play className="h-4 w-4 text-white/70" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-white/10">
                    <Music className="h-4 w-4 text-white/70" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
