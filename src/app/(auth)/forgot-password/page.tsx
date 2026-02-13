"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
      return;
    }

    setSent(true);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="mb-8 text-3xl font-bold gradient-text">
        Colab
      </Link>

      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-secondary-rose/10 px-4 py-3 text-sm text-secondary-rose">
            {error}
          </div>
        )}

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-secondary-emerald/10 px-4 py-3 text-sm text-secondary-emerald text-center">
              Password reset email sent! Check your inbox.
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSent(false)}
            >
              Send again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              required
              autoComplete="email"
              icon={<Mail className="h-4 w-4" />}
            />
            <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" />
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
