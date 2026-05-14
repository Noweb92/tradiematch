import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { tradeLabel } from "@/lib/constants/trades";

interface JobRow {
  id: string;
  title: string;
  trade_category: string;
  status: string;
  created_at: string;
  matched_tradie_id: string | null;
}

export const metadata = { title: "Dashboard · TradieMatch" };

export default async function CustomerDashboard() {
  const { user, supabase } = await requireRole("customer");

  if (!user.onboarding_completed) {
    redirect("/app/customer/onboarding");
  }

  // Fetch customer.id from profile
  const customerRes = await supabase
    .from("customers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  const customer = customerRes.data as { id: string } | null;

  let jobs: JobRow[] = [];
  if (customer?.id) {
    const jobsRes = await supabase
      .from("jobs")
      .select("id, title, trade_category, status, created_at, matched_tradie_id")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(20);
    jobs = (jobsRes.data ?? []) as JobRow[];
  }

  const open = jobs.filter((j) => j.status === "open");
  const matched = jobs.filter((j) => j.status === "matched" || j.status === "in_progress");
  const completed = jobs.filter((j) => j.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
              Customer dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
              G&apos;day{user.first_name ? `, ${user.first_name}` : ""}
            </h1>
          </div>
          <Link
            href="/app/customer/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press"
          >
            <Plus className="w-4 h-4" />
            New job
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard
            icon={<Briefcase className="w-4 h-4" />}
            value={open.length}
            label="Open jobs"
            tone="orange"
          />
          <StatCard
            icon={<Sparkles className="w-4 h-4" />}
            value={matched.length}
            label="Matched"
            tone="success"
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            value={completed.length}
            label="Completed"
            tone="navy"
          />
        </div>

        <section>
          <h2 className="text-lg font-black tracking-tight mb-3">Your jobs</h2>

          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "orange" | "success" | "navy";
}) {
  const map = {
    orange: "bg-orange/10 text-orange",
    success: "bg-success/10 text-success",
    navy: "bg-navy/8 text-navy",
  };
  return (
    <div className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft">
      <div className={`w-8 h-8 rounded-lg grid place-items-center ${map[tone]}`}>
        {icon}
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
        {value}
      </div>
      <div className="text-[11px] text-navy/55 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function JobRow({ job }: { job: JobRow }) {
  return (
    <Link
      href={
        job.status === "open"
          ? `/app/customer/jobs/${job.id}/swipe`
          : `/app/customer/jobs/${job.id}`
      }
      className="group flex items-center gap-3 rounded-2xl bg-white border border-navy/8 px-4 py-3 hover:border-navy/20 hover:shadow-soft transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange grid place-items-center shrink-0">
        <Briefcase className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-navy truncate">{job.title}</div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-navy/55">
          <span>{tradeLabel(job.trade_category)}</span>
          <span>·</span>
          <span className="capitalize">{job.status.replace("_", " ")}</span>
          <span>·</span>
          <span>{new Date(job.created_at).toLocaleDateString("en-AU")}</span>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-navy/30 group-hover:text-orange group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-white border-2 border-dashed border-navy/10 p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-orange/10 text-orange grid place-items-center mx-auto mb-3">
        <Clock className="w-5 h-5" />
      </div>
      <div className="font-black text-navy">No jobs yet</div>
      <p className="text-sm text-navy/55 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Post your first job and we&apos;ll surface verified tradies in your area in seconds.
      </p>
      <Link
        href="/app/customer/jobs/new"
        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold text-sm shadow-glow btn-press"
      >
        <Plus className="w-4 h-4" />
        Post a job
      </Link>
    </div>
  );
}
