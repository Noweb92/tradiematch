import Link from "next/link";
import {
  Users,
  Hammer,
  Briefcase,
  Sparkles,
  Wallet,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin · TradieMatch" };

async function count(supabase: ReturnType<typeof import("@/lib/supabase/server").createSupabaseServerClient>, table: string, filter?: (q: any) => any) {
  let q: any = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const { user, supabase } = await requireRole("admin");

  const [
    customers,
    tradiesAll,
    tradiesPending,
    tradiesActive,
    jobsOpen,
    matchesTotal,
  ] = await Promise.all([
    count(supabase, "customers"),
    count(supabase, "tradies"),
    count(supabase, "tradies", (q) => q.eq("admin_verified", false)),
    count(supabase, "tradies", (q) =>
      q.eq("admin_verified", true).in("subscription_status", ["active", "trialing"]),
    ),
    count(supabase, "jobs", (q) => q.eq("status", "open")),
    count(supabase, "matches"),
  ]);

  return (
    <AdminShell email={user.email} activePath="/app/admin/dashboard">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Operations
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            Admin dashboard
          </h1>
          <p className="text-sm text-navy/55 mt-1">
            Snapshot of users, tradies, jobs, matches and MRR.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Kpi icon={<Users className="w-4 h-4" />} value={customers} label="Customers" tone="navy" />
          <Kpi icon={<Hammer className="w-4 h-4" />} value={tradiesAll} label="Tradies (all)" tone="orange" />
          <Kpi
            icon={<UserCheck className="w-4 h-4" />}
            value={tradiesPending}
            label="Pending review"
            tone="amber"
            href={tradiesPending > 0 ? "/app/admin/tradies/pending" : undefined}
            highlight={tradiesPending > 0}
          />
          <Kpi icon={<Wallet className="w-4 h-4" />} value={tradiesActive} label="Paying tradies" tone="success" />
          <Kpi icon={<Briefcase className="w-4 h-4" />} value={jobsOpen} label="Open jobs" tone="navy" />
          <Kpi icon={<Sparkles className="w-4 h-4" />} value={matchesTotal} label="Matches (all-time)" tone="orange" />
        </div>

        {tradiesPending > 0 && (
          <Link
            href="/app/admin/tradies/pending"
            className="mt-6 group flex items-center justify-between gap-3 rounded-2xl bg-orange/8 border-2 border-orange/30 p-4 hover:border-orange transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange text-white grid place-items-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-navy">
                  {tradiesPending} tradie{tradiesPending === 1 ? "" : "s"} waiting for approval
                </div>
                <div className="text-xs text-navy/55 mt-0.5">
                  Review docs, ABN status, and approve — usually under 5 min each.
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-orange group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </AdminShell>
  );
}

function Kpi({
  icon,
  value,
  label,
  tone,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "navy" | "orange" | "amber" | "success";
  href?: string;
  highlight?: boolean;
}) {
  const map = {
    navy: "bg-navy/[0.06] text-navy",
    orange: "bg-orange/10 text-orange",
    amber: "bg-amber-100 text-amber-700",
    success: "bg-success/10 text-success",
  };
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <Link href={href} className="contents">
        {children}
      </Link>
    ) : (
      <>{children}</>
    );
  return (
    <Wrapper>
      <div
        className={`rounded-2xl border p-4 transition-all ${
          highlight
            ? "bg-orange/5 border-orange/40 hover:shadow-card"
            : "bg-white border-navy/8 shadow-soft hover:shadow-card"
        }`}
      >
        <div className={`w-8 h-8 rounded-lg grid place-items-center ${map[tone]}`}>
          {icon}
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
          {value.toLocaleString("en-US")}
        </div>
        <div className="text-[11px] text-navy/55 font-medium mt-0.5">{label}</div>
      </div>
    </Wrapper>
  );
}
