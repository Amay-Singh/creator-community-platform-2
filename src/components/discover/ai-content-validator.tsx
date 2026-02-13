"use client";

import { useState } from "react";
import { ShieldCheck, AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ValidationResult {
  score: number;
  isOriginal: boolean;
  flags: { type: "duplicate" | "ai_generated" | "low_quality" | "spam"; message: string; severity: "warning" | "error" }[];
}

interface AiContentValidatorProps {
  contentId: string;
  contentType: "portfolio" | "bio" | "post";
  onValidationComplete?: (result: ValidationResult) => void;
  className?: string;
}

export function AiContentValidator({ contentId, contentType, onValidationComplete, className }: AiContentValidatorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  async function handleValidate() {
    setIsValidating(true);
    // TODO: Connect to AI backend API for real content validation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: ValidationResult = {
      score: 87,
      isOriginal: true,
      flags: contentId === "flagged"
        ? [
            { type: "duplicate", message: "Similar content found in 2 other profiles", severity: "warning" },
            { type: "low_quality", message: "Image resolution below recommended 1080p", severity: "warning" },
          ]
        : [],
    };

    setResult(mockResult);
    setIsValidating(false);
    onValidationComplete?.(mockResult);
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-card-foreground">Content Validation</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleValidate}
          isLoading={isValidating}
          disabled={isValidating}
        >
          {result ? "Re-validate" : "Validate"}
        </Button>
      </div>

      {isValidating && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Scanning {contentType} for originality and quality...
        </div>
      )}

      {result && !isValidating && (
        <div className="mt-3 space-y-3">
          {/* Score */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {result.isOriginal ? (
                <CheckCircle2 className="h-4 w-4 text-secondary-emerald" />
              ) : (
                <XCircle className="h-4 w-4 text-secondary-rose" />
              )}
              <span className="text-sm font-medium text-card-foreground">
                {result.isOriginal ? "Original Content" : "Potential Issues Detected"}
              </span>
            </div>
            <Badge
              variant={result.score >= 80 ? "success" : result.score >= 50 ? "warning" : "destructive"}
              size="sm"
            >
              Score: {result.score}/100
            </Badge>
          </div>

          {/* Flags */}
          {result.flags.length > 0 && (
            <div className="space-y-2">
              {result.flags.map((flag, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 rounded-lg px-3 py-2 text-xs",
                    flag.severity === "error"
                      ? "bg-secondary-rose/10 text-secondary-rose"
                      : "bg-secondary-orange/10 text-secondary-orange"
                  )}
                >
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{flag.message}</span>
                </div>
              ))}
            </div>
          )}

          {result.flags.length === 0 && (
            <p className="text-xs text-muted-foreground">No issues found. Content appears authentic and high quality.</p>
          )}
        </div>
      )}
    </div>
  );
}
