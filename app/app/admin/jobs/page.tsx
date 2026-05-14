import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";
import { tradeLabel } from "@/lib/constants/trades";

export const metadata = { title: "Jobs · Admin" };

interface Row {
  id: string;
  title: string;
  trade_category: string;
  status: string;
  urgency: string;
  created_at: string;
  customers: { profiles: { first_name: string | null; city: string | null } | null } | null;
}

export default async function AdminJobsPage() {
  const { user, supabase } = await requireRole("admin");
  const res = await supabase
    .from("jobs")
    .select(
      "id, title, trade_category, status, urgency, created_at, customers ( profiles ( first_name, city ) )",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (res.data ?? []) as unknown as Row[];

  return (
    <AdminShell email={user.email} activePath="/app/admin/jobs">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Jobs
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            {rows.length} recent jobs
          </h1>
        </div>

        <div className="rounded-2xl bg-white border border-navy/8 shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-navy/[0.03]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-navy/55">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Trade</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-navy/[0.02]">
                  <td className="px-4 py-3 font-bold text-navy line-clamp-1 max-w-[260px]">
                    {r.title}
                  </td>
                  <td className="px-4 py-3 text-navy/75">
                    {r.customers?.profiles?.first_name ?? "—"}
                    {r.customers?.profiles?.city ? ` · ${r.customers.profiles.city}` : ""}
                  </td>
                  <td className="px-4 py-3 text-navy/75">
                    {tradeLabel(r.trade_category)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy/[0.06] text-navy/75">
                      {r.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.status === "open"
                          ? "bg-orange/10 text-orange"
                          : r.status === "matched"
                          ? "bg-success/10 text-success"
                          : "bg-navy/[0.06] text-navy/55"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-navy/55 text-[11px]">
                    {new Date(r.created_at).toLocaleDateString("en-AU")}
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
