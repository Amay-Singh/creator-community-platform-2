"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="mb-8 text-3xl font-bold gradient-text">
        Colab
      </Link>

      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">Set new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-secondary-rose/10 px-4 py-3 text-sm text-secondary-rose">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="New Password"
            type="password"
            name="password"
            required
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirm-password"
            required
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
          />
          <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
