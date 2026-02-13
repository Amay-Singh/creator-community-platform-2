"use client";

import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
];

interface MessageTranslatorProps {
  text: string;
  className?: string;
}

export function MessageTranslator({ text, className }: MessageTranslatorProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState("es");
  const [showLangMenu, setShowLangMenu] = useState(false);

  async function handleTranslate() {
    setIsTranslating(true);
    // TODO: Connect to translation API (Google Translate / DeepL)
    await new Promise((r) => setTimeout(r, 800));
    const lang = supportedLanguages.find((l) => l.code === targetLang);
    setTranslated(`[${lang?.label} translation] ${text}`);
    setIsTranslating(false);
  }

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="relative">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-0.5 rounded-md px-1 py-0.5 text-[10px] text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Select language"
        >
          <Languages className="h-3 w-3" />
          <ChevronDown className="h-2 w-2" />
        </button>
        {showLangMenu && (
          <div className="absolute bottom-full left-0 z-20 mb-1 w-32 rounded-xl border border-border bg-card py-1 shadow-lg">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setTargetLang(lang.code); setShowLangMenu(false); setTranslated(null); }}
                className={cn(
                  "flex w-full items-center px-3 py-1.5 text-xs transition-colors",
                  targetLang === lang.code ? "bg-primary/10 text-primary" : "text-card-foreground hover:bg-muted"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className="text-[10px] text-primary hover:underline disabled:opacity-50"
      >
        {isTranslating ? "..." : translated ? "Re-translate" : "Translate"}
      </button>
      {translated && (
        <span className="ml-1 text-[10px] italic text-muted-foreground">{translated}</span>
      )}
    </div>
  );
}
