import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";
import { tradeLabel } from "@/lib/constants/trades";
import { Star } from "lucide-react";

export const metadata = { title: "All tradies · Admin" };

interface Row {
  id: string;
  business_name: string | null;
  abn: string;
  trade_categories: string[];
  admin_verified: boolean;
  subscription_tier: string;
  subscription_status: string | null;
  rating_average: number;
  rating_count: number;
  available: boolean;
  created_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    city: string | null;
    state: string | null;
  } | null;
}

export default async function AllTradiesPage() {
  const { user, supabase } = await requireRole("admin");
  const res = await supabase
    .from("tradies")
    .select(
      `
      id, business_name, abn, trade_categories, admin_verified, subscription_tier,
      subscription_status, rating_average, rating_count, available, created_at,
      profiles ( email, first_name, city, state )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (res.data ?? []) as unknown as Row[];

  return (
    <AdminShell email={user.email} activePath="/app/admin/tradies">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Tradies
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            All tradies ({rows.length})
          </h1>
        </div>

        <div className="rounded-2xl bg-white border border-navy/8 shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-navy/[0.03]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-navy/55">
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">ABN</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Trades</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-navy/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-bold text-navy">
                      {r.business_name ?? r.profiles?.first_name ?? "—"}
                    </div>
                    <div className="text-[11px] text-navy/55 truncate max-w-[200px]">
                      {r.profiles?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy/75 tabular-nums">{r.abn}</td>
                  <td className="px-4 py-3 text-navy/75">
                    {r.profiles?.city ?? "—"}
                    {r.profiles?.state ? `, ${r.profiles.state}` : ""}
                  </td>
                  <td className="px-4 py-3 text-navy/75">
                    {r.trade_categories.slice(0, 2).map(tradeLabel).join(", ")}
                    {r.trade_categories.length > 2 && ` +${r.trade_categories.length - 2}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy/[0.06] text-navy">
                      {r.subscription_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Status verified={r.admin_verified} available={r.available} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-orange text-orange" />
                      <span className="font-bold tabular-nums">
                        {r.rating_average?.toFixed(1) ?? "—"}
                      </span>
                      <span className="text-[10px] text-navy/45 ml-0.5">
                        ({r.rating_count ?? 0})
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Status({ verified, available }: { verified: boolean; available: boolean }) {
  if (!verified)
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
        Pending
      </span>
    );
  if (!available)
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-navy/[0.06] text-navy/55">
        Paused
      </span>
    );
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success">
      Live
    </span>
  );
}
