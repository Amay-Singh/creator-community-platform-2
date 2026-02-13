"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-secondary-rose">500</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
