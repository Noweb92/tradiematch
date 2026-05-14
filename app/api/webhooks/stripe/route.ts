import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { quotaForTier, tierFromPriceId, type Tier } from "@/lib/stripe/tiers";
import { sendPaymentFailed } from "@/lib/email/send";

// Stripe needs the raw body to verify the signature. Disable Next.js's body
// parsing and read the stream manually.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RELEVANT_EVENTS = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const supabase = createSupabaseServiceRoleClient();

  // Audit log first — idempotent via unique constraint on stripe_event_id.
  try {
    await supabase.from("subscription_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event.data as unknown as Record<string, unknown>,
      tradie_id: extractTradieId(event),
    });
  } catch {
    // Duplicate event — already processed.
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          stripe,
          supabase,
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(
          supabase,
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          supabase,
          event.data.object as Stripe.Subscription,
        );
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(
          supabase,
          event.data.object as Stripe.Invoice,
        );
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(
          supabase,
          event.data.object as Stripe.Invoice,
        );
        break;
    }
  } catch (err) {
    console.error("[stripe webhook]", event.type, err);
    return NextResponse.json(
      { error: "Handler failed", type: event.type },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true, type: event.type });
}

// --- handlers ------------------------------------------------------------

type AnySupabase = ReturnType<typeof createSupabaseServiceRoleClient>;

async function handleCheckoutCompleted(
  stripe: Stripe,
  supabase: AnySupabase,
  session: Stripe.Checkout.Session,
) {
  if (session.mode !== "subscription" || !session.subscription) return;

  const tradieId = session.metadata?.tradie_id ?? null;
  const tier = session.metadata?.tier as Tier | undefined;

  const sub = await stripe.subscriptions.retrieve(
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id,
  );

  const priceId = sub.items.data[0]?.price.id;
  const resolvedTier = tier ?? tierFromPriceId(priceId);
  if (!resolvedTier) return;

  const periodEnd = (sub.items.data[0] as { current_period_end?: number } | undefined)
    ?.current_period_end;

  const patch: Record<string, unknown> = {
    subscription_tier: resolvedTier,
    subscription_status: sub.status,
    stripe_subscription_id: sub.id,
    matches_quota_monthly: quotaForTier(resolvedTier),
    matches_used_this_period: 0,
    subscription_current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
  };

  if (tradieId) {
    await supabase.from("tradies").update(patch).eq("id", tradieId);
  } else if (typeof session.customer === "string") {
    await supabase
      .from("tradies")
      .update(patch)
      .eq("stripe_customer_id", session.customer);
  }
}

async function handleSubscriptionChange(
  supabase: AnySupabase,
  sub: Stripe.Subscription,
) {
  const priceId = sub.items.data[0]?.price.id;
  const tier = tierFromPriceId(priceId);
  const periodEnd = (sub.items.data[0] as { current_period_end?: number } | undefined)
    ?.current_period_end;
  if (!tier) return;

  const patch: Record<string, unknown> = {
    subscription_tier: tier,
    subscription_status: sub.status,
    matches_quota_monthly: quotaForTier(tier),
    subscription_current_period_end: periodEnd
      ? new Date(periodEnd * 1000).toISOString()
      : null,
  };

  await supabase
    .from("tradies")
    .update(patch)
    .eq("stripe_subscription_id", sub.id);
}

async function handleSubscriptionDeleted(
  supabase: AnySupabase,
  sub: Stripe.Subscription,
) {
  await supabase
    .from("tradies")
    .update({
      subscription_status: "canceled",
      subscription_tier: "none",
      matches_quota_monthly: 0,
      available: false,
    })
    .eq("stripe_subscription_id", sub.id);
}

async function handlePaymentSucceeded(
  supabase: AnySupabase,
  invoice: Stripe.Invoice,
) {
  const subId = (invoice as { subscription?: string | Stripe.Subscription | null })
    .subscription;
  if (!subId) return;

  // On a successful renewal payment, reset the period's match usage.
  const id = typeof subId === "string" ? subId : subId.id;
  await supabase
    .from("tradies")
    .update({
      subscription_status: "active",
      matches_used_this_period: 0,
    })
    .eq("stripe_subscription_id", id);
}

async function handlePaymentFailed(
  supabase: AnySupabase,
  invoice: Stripe.Invoice,
) {
  const subId = (invoice as { subscription?: string | Stripe.Subscription | null })
    .subscription;
  if (!subId) return;
  const id = typeof subId === "string" ? subId : subId.id;
  const upd = await supabase
    .from("tradies")
    .update({ subscription_status: "past_due" })
    .eq("stripe_subscription_id", id)
    .select("profile_id, profiles(email, first_name)")
    .maybeSingle();

  const tradie = upd.data as
    | {
        profile_id: string;
        profiles: { email: string; first_name: string | null } | null;
      }
    | null;
  if (tradie?.profiles?.email) {
    await sendPaymentFailed({
      to: tradie.profiles.email,
      firstName: tradie.profiles.first_name,
    });
  }
}

// --- utils ---------------------------------------------------------------

function extractTradieId(event: Stripe.Event): string | null {
  const obj = event.data.object as unknown as Record<string, unknown>;
  const meta = obj.metadata as Record<string, string> | undefined;
  return meta?.tradie_id ?? null;
}
