import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const tradieRes = await supabase
    .from("tradies")
    .select("stripe_customer_id")
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as { stripe_customer_id: string | null } | null;

  if (!tradie?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer — subscribe first" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portal = await stripe.billingPortal.sessions.create({
    customer: tradie.stripe_customer_id,
    return_url: `${appUrl}/app/tradie/dashboard`,
  });

  return NextResponse.json({ url: portal.url });
}
