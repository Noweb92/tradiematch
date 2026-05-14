import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { haversineKm } from "@/lib/geo/nominatim";
import type { TradieCard } from "@/lib/matching/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TradieRow {
  id: string;
  profile_id: string;
  business_name: string | null;
  bio: string | null;
  trade_categories: string[];
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  rating_average: number;
  rating_count: number;
  response_rate: number;
  service_radius_km: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    city: string | null;
    state: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  tradie_portfolio: { image_url: string; display_order: number }[];
}

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } },
) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Load the job (RLS will block if not the owner)
  const jobRes = await supabase
    .from("jobs")
    .select("id, trade_category, status, latitude, longitude")
    .eq("id", params.jobId)
    .maybeSingle();
  const job = jobRes.data as
    | {
        id: string;
        trade_category: string;
        status: string;
        latitude: number | null;
        longitude: number | null;
      }
    | null;

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.status !== "open") {
    return NextResponse.json({ tradies: [], jobStatus: job.status });
  }

  // Already-swiped tradie IDs (to exclude)
  const swipedRes = await supabase
    .from("swipes")
    .select("tradie_id")
    .eq("job_id", params.jobId)
    .eq("swiper_role", "customer");
  const swipedIds = (swipedRes.data ?? []).map(
    (r) => (r as { tradie_id: string }).tradie_id,
  );

  // Tradies matching trade + verified + available + on a paid plan
  let query = supabase
    .from("tradies")
    .select(
      `
      id, profile_id, business_name, bio, trade_categories,
      hourly_rate_min, hourly_rate_max, years_experience,
      rating_average, rating_count, response_rate, service_radius_km,
      profiles!inner ( first_name, last_name, avatar_url, city, state, latitude, longitude ),
      tradie_portfolio ( image_url, display_order )
    `,
    )
    .eq("admin_verified", true)
    .eq("available", true)
    .in("subscription_status", ["active", "trialing"])
    .contains("trade_categories", [job.trade_category])
    .order("rating_average", { ascending: false })
    .order("response_rate", { ascending: false })
    .limit(60);

  if (swipedIds.length > 0) {
    query = query.not(
      "id",
      "in",
      `(${swipedIds.map((i) => `"${i}"`).join(",")})`,
    );
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as TradieRow[];

  const cards: TradieCard[] = rows.map((t) => {
    const tradieLat = t.profiles?.latitude ?? null;
    const tradieLon = t.profiles?.longitude ?? null;
    let distance: number | null = null;
    if (
      job.latitude != null &&
      job.longitude != null &&
      tradieLat != null &&
      tradieLon != null
    ) {
      distance = haversineKm(job.latitude, job.longitude, tradieLat, tradieLon);
    }
    const portfolio = (t.tradie_portfolio ?? [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => p.image_url)
      .slice(0, 4);

    return {
      id: t.id,
      profile_id: t.profile_id,
      business_name: t.business_name,
      first_name: t.profiles?.first_name ?? null,
      last_name: t.profiles?.last_name ?? null,
      avatar_url: t.profiles?.avatar_url ?? null,
      bio: t.bio,
      trade_categories: t.trade_categories,
      hourly_rate_min: t.hourly_rate_min,
      hourly_rate_max: t.hourly_rate_max,
      years_experience: t.years_experience,
      rating_average: t.rating_average,
      rating_count: t.rating_count,
      response_rate: t.response_rate,
      service_radius_km: t.service_radius_km,
      city: t.profiles?.city ?? null,
      state: t.profiles?.state ?? null,
      latitude: tradieLat,
      longitude: tradieLon,
      portfolio,
      distance_km: distance,
    };
  });

  // Filter by tradie's service radius (distance must be <= service_radius)
  const filtered = cards
    .filter((c) => c.distance_km === null || c.distance_km <= c.service_radius_km)
    .slice(0, 20);

  return NextResponse.json({ tradies: filtered, jobStatus: job.status });
}
