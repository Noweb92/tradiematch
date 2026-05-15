/**
 * Perth dev seed.
 *
 * Usage:
 *   pnpm tsx scripts/seed-dev.ts          # or `npx tsx scripts/seed-dev.ts`
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent: re-running is safe; existing users are skipped by email.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PERTH_SUBURBS: Array<[string, string, number, number]> = [
  ["Perth CBD", "6000", -31.9523, 115.8613],
  ["Fremantle", "6160", -32.0569, 115.7445],
  ["Subiaco", "6008", -31.9498, 115.8266],
  ["Cottesloe", "6011", -31.9985, 115.7585],
  ["Scarborough", "6019", -31.8919, 115.7572],
  ["Joondalup", "6027", -31.7448, 115.7661],
  ["Cannington", "6107", -32.0144, 115.9358],
  ["Como", "6152", -31.9930, 115.8633],
  ["Mount Lawley", "6050", -31.9285, 115.8753],
  ["Rockingham", "6168", -32.2767, 115.7297],
];

const FIRST_NAMES = [
  "Liam", "Jack", "Oliver", "Noah", "William", "Thomas", "James", "Lucas",
  "Henry", "Ethan", "Cooper", "Mason", "Logan", "Hudson", "Leo", "Charlie",
];
const LAST_NAMES = [
  "O'Sullivan", "Thompson", "Nguyen", "Williams", "Chen", "Bailey", "Patel",
  "Romano", "Mitchell", "Walker", "Bennett", "Riley", "Hughes", "Adams",
];

const TRADES = [
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "roofing",
  "landscaping",
  "handyman",
  "tiling",
  "flooring",
  "glazing",
];

const PORTFOLIO_BANK = [
  "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1632759145351-1d76daabd66f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const between = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo;

async function ensureUser(
  email: string,
  password: string,
  meta: Record<string, unknown>,
): Promise<string | null> {
  // Try to find first
  const existing = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = existing.data.users.find((u) => u.email === email);
  if (found) return found.id;

  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (error) {
    console.error("create user", email, error.message);
    return null;
  }
  return data.user?.id ?? null;
}

async function seedAdmin() {
  console.log("→ admin");
  const id = await ensureUser(
    "marwan@tradiematch.com.au",
    "Tradie!1234",
    { role: "admin", first_name: "Marwan", last_name: "Admin" },
  );
  if (id) {
    await sb
      .from("profiles")
      .update({ role: "admin", onboarding_completed: true })
      .eq("id", id);
  }
}

async function seedTradies(count: number) {
  console.log(`→ ${count} tradies`);
  for (let i = 0; i < count; i++) {
    const first = rand(FIRST_NAMES);
    const last = rand(LAST_NAMES);
    const email = `tradie${i + 1}@seed.tradiematch.example.com`;
    const [suburb, postcode, lat, lon] = rand(PERTH_SUBURBS);
    const id = await ensureUser(email, "Tradie!1234", {
      role: "tradie",
      first_name: first,
      last_name: last,
    });
    if (!id) continue;

    await sb
      .from("profiles")
      .update({
        role: "tradie",
        first_name: first,
        last_name: last,
        city: suburb,
        state: "WA",
        postcode,
        latitude: lat,
        longitude: lon,
        onboarding_completed: true,
      })
      .eq("id", id);

    const tier = i % 3 === 0 ? "elite" : i % 2 === 0 ? "pro" : "basic";
    const quota = tier === "elite" ? 999 : tier === "pro" ? 25 : 5;
    const trades = Array.from(new Set([rand(TRADES), rand(TRADES)]));

    const { data: existingTradie } = await sb
      .from("tradies")
      .select("id")
      .eq("profile_id", id)
      .maybeSingle();

    const payload = {
      profile_id: id,
      abn: `5${(100000000 + i).toString()}`.slice(0, 11),
      abn_verified: true,
      abn_verified_at: new Date().toISOString(),
      abn_entity_name: `${first} ${last} Pty Ltd`,
      abn_gst_registered: true,
      business_name: `${first}'s ${trades[0][0].toUpperCase() + trades[0].slice(1)}`,
      trade_categories: trades,
      service_radius_km: rand([15, 20, 25, 30, 40]),
      hourly_rate_min: between(70, 110),
      hourly_rate_max: between(120, 180),
      years_experience: between(3, 20),
      bio: `Local ${trades[0]} based in ${suburb}. Quality work, fair prices, on time.`,
      admin_verified: i % 5 !== 0, // 80% verified
      subscription_tier: tier,
      subscription_status: i % 5 !== 0 ? "active" : "none",
      matches_quota_monthly: i % 5 !== 0 ? quota : 0,
      rating_average: 4.5 + Math.random() * 0.4,
      rating_count: between(10, 250),
      response_rate: between(70, 100),
      available: true,
    };

    if (existingTradie) {
      await sb.from("tradies").update(payload).eq("id", (existingTradie as { id: string }).id);
    } else {
      const ins = await sb.from("tradies").insert(payload).select("id").single();
      const tradieId = (ins.data as { id: string } | null)?.id;
      if (tradieId) {
        const pieces = [
          { tradie_id: tradieId, image_url: rand(PORTFOLIO_BANK), display_order: 0 },
          { tradie_id: tradieId, image_url: rand(PORTFOLIO_BANK), display_order: 1 },
          { tradie_id: tradieId, image_url: rand(PORTFOLIO_BANK), display_order: 2 },
        ];
        await sb.from("tradie_portfolio").insert(pieces);
      }
    }

    // Avatar on profile
    await sb.from("profiles").update({ avatar_url: rand(AVATARS) }).eq("id", id);
  }
}

async function seedCustomers(count: number) {
  console.log(`→ ${count} customers`);
  for (let i = 0; i < count; i++) {
    const first = rand(FIRST_NAMES);
    const email = `customer${i + 1}@seed.tradiematch.example.com`;
    const [suburb, postcode, lat, lon] = rand(PERTH_SUBURBS);
    const id = await ensureUser(email, "Tradie!1234", {
      role: "customer",
      first_name: first,
      last_name: rand(LAST_NAMES),
    });
    if (!id) continue;
    await sb
      .from("profiles")
      .update({
        role: "customer",
        first_name: first,
        city: suburb,
        state: "WA",
        postcode,
        latitude: lat,
        longitude: lon,
        onboarding_completed: true,
      })
      .eq("id", id);
    await sb
      .from("customers")
      .upsert({ profile_id: id }, { onConflict: "profile_id" });
  }
}

async function seedJobs(count: number) {
  console.log(`→ ${count} jobs`);
  const custs = await sb.from("customers").select("id, profile_id").limit(60);
  const rows = (custs.data ?? []) as Array<{ id: string; profile_id: string }>;
  if (rows.length === 0) return;

  for (let i = 0; i < count; i++) {
    const c = rand(rows);
    const trade = rand(TRADES);
    const [suburb, , lat, lon] = rand(PERTH_SUBURBS);
    await sb.from("jobs").insert({
      customer_id: c.id,
      title: `${trade[0].toUpperCase() + trade.slice(1)} job in ${suburb}`,
      description: `Looking for a quality ${trade} pro for a small home project. Photos available on request.`,
      trade_category: trade,
      photos: [],
      location_address: `${suburb}, WA`,
      latitude: lat,
      longitude: lon,
      urgency: rand(["flexible", "within_week", "asap"]),
      budget_min: between(200, 800),
      budget_max: between(900, 3500),
      status: "open",
    });
  }
}

async function main() {
  await seedAdmin();
  await seedTradies(30);
  await seedCustomers(50);
  await seedJobs(100);
  console.log("✅ seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
