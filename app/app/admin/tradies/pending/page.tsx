import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";
import { PendingTradieCard } from "@/components/admin/PendingTradieCard";

export const metadata = { title: "Pending tradies · Admin" };

interface Row {
  id: string;
  profile_id: string;
  abn: string;
  abn_verified: boolean;
  abn_entity_name: string | null;
  business_name: string | null;
  trade_categories: string[];
  service_radius_km: number;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  bio: string | null;
  white_card_url: string | null;
  insurance_url: string | null;
  insurance_expiry: string | null;
  admin_rejection_reason: string | null;
  created_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
  } | null;
}

export default async function PendingTradiesPage() {
  const { user, supabase } = await requireRole("admin");

  const res = await supabase
    .from("tradies")
    .select(
      `
      id, profile_id, abn, abn_verified, abn_entity_name, business_name,
      trade_categories, service_radius_km, hourly_rate_min, hourly_rate_max,
      years_experience, bio, white_card_url, insurance_url, insurance_expiry,
      admin_rejection_reason, created_at,
      profiles ( email, first_name, last_name, avatar_url, city, state, postcode )
    `,
    )
    .eq("admin_verified", false)
    .order("created_at", { ascending: true });

  const rows = (res.data ?? []) as unknown as Row[];

  return (
    <AdminShell email={user.email} activePath="/app/admin/tradies/pending">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Approval queue
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            {rows.length} tradie{rows.length === 1 ? "" : "s"} waiting
          </h1>
          <p className="text-sm text-navy/55 mt-1">
            Check ABN status, white card, insurance, and trade specialties.
            Approve to make them live in the swipe deck.
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl bg-white border-2 border-dashed border-navy/10 p-8 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-black text-navy">Queue empty</div>
            <p className="text-sm text-navy/55 mt-1.5">
              All caught up. New tradies will appear here when they submit.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <PendingTradieCard key={r.id} row={r} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
