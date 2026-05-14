import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Users · Admin" };

interface Row {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export default async function AdminUsersPage() {
  const { user, supabase } = await requireRole("admin");
  const res = await supabase
    .from("profiles")
    .select("id, email, role, first_name, last_name, city, onboarding_completed, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (res.data ?? []) as unknown as Row[];

  return (
    <AdminShell email={user.email} activePath="/app/admin/users">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Users
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            {rows.length} users
          </h1>
        </div>

        <div className="rounded-2xl bg-white border border-navy/8 shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-navy/[0.03]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-navy/55">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Onboarded</th>
                <th className="px-4 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-navy/[0.02]">
                  <td className="px-4 py-3 font-bold text-navy">
                    {[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-navy/75 truncate max-w-[220px]">
                    {r.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.role === "admin"
                          ? "bg-navy text-orange-300"
                          : r.role === "tradie"
                          ? "bg-orange/10 text-orange"
                          : "bg-navy/[0.06] text-navy/70"
                      }`}
                    >
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy/75">{r.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.onboarding_completed ? "✅" : "—"}
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
