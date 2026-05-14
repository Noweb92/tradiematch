import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { stripePriceIdForTier, TIERS, type Tier } from "@/lib/stripe/tiers";

export const runtime = "nodejs";

const bodySchema = z.object({
  tier: z.enum(["basic", "pro", "elite"]),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const tier: Tier = parsed.data.tier;
  const priceId = stripePriceIdForTier(tier);
  if (!priceId) {
    return NextResponse.json(
      {
        error: `STRIPE_PRICE_${tier.toUpperCase()} not configured. See docs/DEPLOYMENT.md`,
      },
      { status: 500 },
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Fetch tradie row (must exist + be admin_verified ideally, but allow before approval)
  const tradieRes = await supabase
    .from("tradies")
    .select("id, stripe_customer_id, admin_verified")
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | { id: string; stripe_customer_id: string | null; admin_verified: boolean }
    | null;

  if (!tradie) {
    return NextResponse.json(
      { error: "Complete tradie onboarding first" },
      { status: 403 },
    );
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Create / reuse Stripe customer
  let customerId = tradie.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { tradie_id: tradie.id, profile_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("tradies")
      .update({ stripe_customer_id: customerId })
      .eq("id", tradie.id);
  }

  // Build Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    automatic_tax: { enabled: false }, // enable once Stripe Tax + AU GST set up
    subscription_data: {
      metadata: {
        tradie_id: tradie.id,
        profile_id: user.id,
        tier,
      },
    },
    metadata: {
      tradie_id: tradie.id,
      profile_id: user.id,
      tier,
    },
    success_url: `${appUrl}/app/tradie/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/app/tradie/subscribe/cancelled`,
    locale: "en",
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url, tier: TIERS[tier].name });
}
