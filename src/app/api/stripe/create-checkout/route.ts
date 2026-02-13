import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PLANS, type StripePlan } from "@/lib/stripe/client";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as StripePlan;

  if (!plan || plan === "free" || !STRIPE_PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = STRIPE_PLANS[plan].priceId;
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured for this plan" }, { status: 400 });
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin") || "http://localhost:3000"}/settings?tab=billing&success=true`,
      cancel_url: `${request.headers.get("origin") || "http://localhost:3000"}/settings?tab=billing&canceled=true`,
      metadata: { supabase_user_id: user.id, plan },
    });

    return NextResponse.json({ data: { url: session.url } });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create checkout session", details: String(err) },
      { status: 500 }
    );
  }
}
