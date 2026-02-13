import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${request.headers.get("origin") || "http://localhost:3000"}/settings?tab=billing`,
    });

    return NextResponse.json({ data: { url: session.url } });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create portal session", details: String(err) },
      { status: 500 }
    );
  }
}
