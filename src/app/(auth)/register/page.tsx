"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, ArrowLeft, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { CreatorCategory } from "@/types";

const categories: { value: CreatorCategory; label: string }[] = [
  { value: "musician", label: "Musician" },
  { value: "visual-artist", label: "Visual Artist" },
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "writer", label: "Writer" },
  { value: "dancer", label: "Dancer" },
  { value: "influencer", label: "Influencer" },
  { value: "designer", label: "Designer" },
  { value: "other", label: "Other" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CreatorCategory | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("name") as string;
    const username = formData.get("username") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
          category: selectedCategory,
        },
      },
    });

    if (authError) {
      setError(authError.message);
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
          <h1 className="text-2xl font-bold text-card-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1 && "Start with your basic info"}
            {step === 2 && "Tell us about your craft"}
            {step === 3 && "Add links to your work"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-secondary-rose/10 px-4 py-3 text-sm text-secondary-rose">
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  s === step
                    ? "gradient-primary text-white shadow-md"
                    : s < step
                      ? "bg-secondary-emerald text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-8 rounded-full transition-colors ${
                    s < step ? "bg-secondary-emerald" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <Input
                label="Full Name"
                type="text"
                name="name"
                required
                autoComplete="name"
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Username"
                type="text"
                name="username"
                required
                autoComplete="username"
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                required
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
              />
            </>
          )}

          {/* Step 2: Creator Category */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-card-foreground">
                  What type of creator are you?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                        selectedCategory === cat.value
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-muted"
                      }`}
                    >
                      <Palette className="h-4 w-4" aria-hidden="true" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Bio (optional)"
                type="text"
                name="bio"
                autoComplete="off"
              />
              <Input
                label="Location (optional)"
                type="text"
                name="location"
                autoComplete="address-level2"
              />
            </>
          )}

          {/* Step 3: External Links */}
          {step === 3 && (
            <>
              <p className="text-sm text-muted-foreground">
                Add links to your existing profiles so others can see your work.
              </p>
              <Input
                label="Instagram URL"
                type="url"
                name="instagram"
                placeholder="https://instagram.com/..."
                autoComplete="off"
              />
              <Input
                label="YouTube URL"
                type="url"
                name="youtube"
                placeholder="https://youtube.com/..."
                autoComplete="off"
              />
              <Input
                label="Portfolio / Website URL"
                type="url"
                name="website"
                placeholder="https://..."
                autoComplete="off"
              />
            </>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              isLoading={isLoading}
            >
              {step < 3 ? "Continue" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
