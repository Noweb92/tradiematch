import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { haversineKm } from "@/lib/geo/nominatim";
import type { JobCard } from "@/lib/matching/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface JobRow {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  trade_category: string;
  photos: string[];
  urgency: "flexible" | "within_week" | "asap";
  budget_min: number | null;
  budget_max: number | null;
  location_address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  customers: {
    profiles: {
      first_name: string | null;
      city: string | null;
    } | null;
  } | null;
}

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Fetch tradie + their categories + service area
  const tradieRes = await supabase
    .from("tradies")
    .select(
      "id, trade_categories, service_radius_km, admin_verified, subscription_status, matches_quota_monthly, matches_used_this_period",
    )
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | {
        id: string;
        trade_categories: string[];
        service_radius_km: number;
        admin_verified: boolean;
        subscription_status: string | null;
        matches_quota_monthly: number;
        matches_used_this_period: number;
      }
    | null;

  if (!tradie) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (!tradie.admin_verified) {
    return NextResponse.json(
      { error: "Awaiting admin verification", code: "NOT_VERIFIED" },
      { status: 403 },
    );
  }

  // Fetch tradie's location from profile
  const profileRes = await supabase
    .from("profiles")
    .select("latitude, longitude, postcode")
    .eq("id", user.id)
    .single();
  const profile = profileRes.data as
    | { latitude: number | null; longitude: number | null }
    | null;

  // Already-swiped job IDs to exclude
  const swipedRes = await supabase
    .from("swipes")
    .select("job_id")
    .eq("tradie_id", tradie.id)
    .eq("swiper_role", "tradie");
  const swipedIds = (swipedRes.data ?? []).map(
    (r) => (r as { job_id: string }).job_id,
  );

  let query = supabase
    .from("jobs")
    .select(
      `
      id, customer_id, title, description, trade_category, photos,
      urgency, budget_min, budget_max,
      location_address, latitude, longitude, created_at,
      customers!inner ( profiles!inner ( first_name, city ) )
    `,
    )
    .eq("status", "open")
    .in("trade_category", tradie.trade_categories)
    .order("created_at", { ascending: false })
    .limit(60);

  if (swipedIds.length > 0) {
    query = query.not("id", "in", `(${swipedIds.map((i) => `"${i}"`).join(",")})`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as JobRow[];

  const urgencyRank: Record<JobRow["urgency"], number> = {
    asap: 1,
    within_week: 2,
    flexible: 3,
  };

  const cards: JobCard[] = rows
    .map((j) => {
      let distance: number | null = null;
      if (
        profile?.latitude != null &&
        profile.longitude != null &&
        j.latitude != null &&
        j.longitude != null
      ) {
        distance = haversineKm(
          profile.latitude,
          profile.longitude,
          j.latitude,
          j.longitude,
        );
      }
      return {
        id: j.id,
        customer_id: j.customer_id,
        title: j.title,
        description: j.description,
        trade_category: j.trade_category,
        photos: j.photos ?? [],
        urgency: j.urgency,
        budget_min: j.budget_min,
        budget_max: j.budget_max,
        location_address: j.location_address,
        latitude: j.latitude,
        longitude: j.longitude,
        created_at: j.created_at,
        customer_first_name: j.customers?.profiles?.first_name ?? null,
        customer_city: j.customers?.profiles?.city ?? null,
        distance_km: distance,
      };
    })
    .filter(
      (c) => c.distance_km === null || c.distance_km <= tradie.service_radius_km,
    )
    .sort((a, b) => {
      const u = urgencyRank[a.urgency] - urgencyRank[b.urgency];
      if (u !== 0) return u;
      return (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity);
    })
    .slice(0, 20);

  return NextResponse.json({
    jobs: cards,
    quotaRemaining: tradie.matches_quota_monthly - tradie.matches_used_this_period,
  });
}
