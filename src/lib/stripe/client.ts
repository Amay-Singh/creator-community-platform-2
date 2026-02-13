import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set — Stripe calls will fail at runtime.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    priceId: null,
    features: ["5 AI generations/month", "Basic collaboration", "Community access"],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: ["Unlimited AI generations", "Priority support", "Advanced analytics", "Custom portfolio"],
  },
  team: {
    name: "Team",
    priceId: process.env.STRIPE_TEAM_PRICE_ID || "",
    features: ["Everything in Pro", "Team workspaces", "Admin dashboard", "API access"],
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;
