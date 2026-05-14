import { requireRole } from "@/lib/auth/current-user";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Analytics · Admin" };

export default async function AdminAnalyticsPage() {
  const { user } = await requireRole("admin");
  return (
    <AdminShell email={user.email} activePath="/app/admin/analytics">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange">
            Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            Coming next
          </h1>
          <p className="text-sm text-navy/55 mt-1 max-w-prose">
            Cohort retention, signup funnel, MRR over time, swipe → match → quote
            conversion. Wired to PostHog once events are flowing. The dashboard
            KPIs cover the immediate operational view.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
