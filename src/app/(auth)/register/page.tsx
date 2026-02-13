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
  const [formState, setFormState] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    location: "",
    instagram: "",
    youtube: "",
    website: "",
  });
  const router = useRouter();

  function updateField(field: string, value: string) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleOAuthSignUp(provider: "google" | "apple" | "facebook") {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    await doSignUp();
  }

  async function doSignUp() {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
      options: {
        data: {
          full_name: formState.name,
          username: formState.username,
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
                value={formState.name}
                onChange={(e) => updateField("name", e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Username"
                type="text"
                name="username"
                required
                autoComplete="username"
                value={formState.username}
                onChange={(e) => updateField("username", e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formState.email}
                onChange={(e) => updateField("email", e.target.value)}
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                value={formState.password}
                onChange={(e) => updateField("password", e.target.value)}
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
                label="Instagram URL (optional)"
                type="url"
                name="instagram"
                placeholder="https://instagram.com/..."
                autoComplete="off"
                value={formState.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
              />
              <Input
                label="YouTube URL (optional)"
                type="url"
                name="youtube"
                placeholder="https://youtube.com/..."
                autoComplete="off"
                value={formState.youtube}
                onChange={(e) => updateField("youtube", e.target.value)}
              />
              <Input
                label="Portfolio / Website URL (optional)"
                type="url"
                name="website"
                placeholder="https://..."
                autoComplete="off"
                value={formState.website}
                onChange={(e) => updateField("website", e.target.value)}
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
            {step === 3 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                isLoading={isLoading}
                onClick={() => doSignUp()}
              >
                Skip & Create
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

        {step === 1 && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignUp("google")}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-transparent text-sm font-medium hover:bg-muted transition-colors"
                aria-label="Sign up with Google"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignUp("apple")}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-transparent text-sm font-medium hover:bg-muted transition-colors"
                aria-label="Sign up with Apple"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignUp("facebook")}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-transparent text-sm font-medium hover:bg-muted transition-colors"
                aria-label="Sign up with Instagram (via Facebook)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </button>
            </div>
          </div>
        )}
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
