"use client";

import { useState } from "react";
import { Sparkles, Download, Eye, Crown, Palette, Layout, Type, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TemplateStyle = "minimal" | "creative" | "professional" | "bold";

const templates: { id: TemplateStyle; label: string; description: string; gradient: string }[] = [
  { id: "minimal", label: "Minimal", description: "Clean, whitespace-focused", gradient: "from-gray-100 to-gray-200" },
  { id: "creative", label: "Creative", description: "Vibrant colors, dynamic layout", gradient: "from-purple-400 to-pink-400" },
  { id: "professional", label: "Professional", description: "Corporate-ready, structured", gradient: "from-blue-500 to-indigo-500" },
  { id: "bold", label: "Bold", description: "High contrast, statement design", gradient: "from-orange-500 to-red-500" },
];

interface GeneratedPortfolio {
  title: string;
  tagline: string;
  sections: { heading: string; content: string }[];
  style: TemplateStyle;
}

interface AiPortfolioGeneratorProps {
  className?: string;
}

export function AiPortfolioGenerator({ className }: AiPortfolioGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>("creative");
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    // TODO: Connect to AI backend API for real portfolio generation
    await new Promise((r) => setTimeout(r, 2500));
    setPortfolio({
      title: "Maya Chen — Sound & Vision",
      tagline: "Electronic music producer crafting immersive audio-visual experiences",
      sections: [
        {
          heading: "About",
          content: "Los Angeles-based electronic music producer specializing in ambient textures and dynamic beats. With 12+ successful collaborations and a growing community, I transform creative visions into sonic reality.",
        },
        {
          heading: "Featured Work",
          content: "Urban Frequencies EP (2026) — A 6-track exploration of city sounds and electronic production. Dance Film Series (2025) — Original soundtrack for contemporary dance. Summer Festival Promo (2025) — Audio branding for festival campaign.",
        },
        {
          heading: "Skills & Tools",
          content: "Production · Mixing · Mastering · Sound Design · Ableton Live · Logic Pro · Synthesis · Field Recording · Audio-Visual Performance",
        },
        {
          heading: "Collaboration Style",
          content: "I thrive in cross-disciplinary projects — pairing music with visual art, film, and interactive media. Open to remote and in-person sessions. Quick turnaround, clear communication, deadline-driven.",
        },
      ],
      style: selectedTemplate,
    });
    setIsGenerating(false);
  }

  function handleExport() {
    if (!portfolio) return;
    const blob = new Blob(
      [JSON.stringify(portfolio, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">AI Portfolio Generator</h2>
              <Badge variant="primary" size="sm" className="gap-1">
                <Crown className="h-3 w-3" /> Premium
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Generate a professional portfolio from your profile data</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Choose a Template</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                selectedTemplate === t.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn("h-16 w-full rounded-lg bg-gradient-to-br", t.gradient)} />
              <span className="text-xs font-medium text-card-foreground">{t.label}</span>
              <span className="text-[10px] text-muted-foreground">{t.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate */}
      <div className="flex gap-3">
        <Button variant="gradient" onClick={handleGenerate} isLoading={isGenerating} className="flex-1">
          <Sparkles className="h-4 w-4" />
          {portfolio ? "Regenerate Portfolio" : "Generate Portfolio"}
        </Button>
        {portfolio && (
          <>
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide" : "Preview"}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        )}
      </div>

      {/* Preview */}
      {portfolio && showPreview && (
        <div className={cn(
          "rounded-2xl border border-border overflow-hidden shadow-lg",
          selectedTemplate === "minimal" ? "bg-white" :
          selectedTemplate === "creative" ? "bg-gradient-to-br from-purple-50 to-pink-50" :
          selectedTemplate === "professional" ? "bg-gradient-to-br from-blue-50 to-indigo-50" :
          "bg-gradient-to-br from-orange-50 to-red-50"
        )}>
          {/* Portfolio Header */}
          <div className={cn(
            "p-8 text-white",
            selectedTemplate === "minimal" ? "bg-gray-900" :
            selectedTemplate === "creative" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
            selectedTemplate === "professional" ? "bg-gradient-to-r from-blue-600 to-indigo-600" :
            "bg-gradient-to-r from-orange-500 to-red-500"
          )}>
            <h1 className="text-2xl font-bold">{portfolio.title}</h1>
            <p className="mt-1 text-sm text-white/80">{portfolio.tagline}</p>
          </div>

          {/* Sections */}
          <div className="p-8 space-y-6">
            {portfolio.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">{section.heading}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-8 py-4">
            <p className="text-[10px] text-gray-400 text-center">Generated by Colab AI Portfolio Generator</p>
          </div>
        </div>
      )}
    </div>
  );
}
