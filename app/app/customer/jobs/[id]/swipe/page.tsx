import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { CustomerSwipeRunner } from "@/components/customer/SwipeRunner";

export const metadata = { title: "Swipe · TradieMatch" };

export default async function CustomerSwipePage({
  params,
}: {
  params: { id: string };
}) {
  const { user, supabase } = await requireRole("customer");

  const jobRes = await supabase
    .from("jobs")
    .select("id, title, trade_category, status, matched_tradie_id")
    .eq("id", params.id)
    .maybeSingle();
  const job = jobRes.data as
    | {
        id: string;
        title: string;
        trade_category: string;
        status: string;
        matched_tradie_id: string | null;
      }
    | null;

  if (!job) redirect("/app/customer/dashboard");
  if (job.status === "matched") {
    // Forward to the match thread
    const matchRes = await supabase
      .from("matches")
      .select("id")
      .eq("job_id", job.id)
      .maybeSingle();
    const m = matchRes.data as { id: string } | null;
    redirect(m?.id ? `/app/customer/matches/${m.id}` : "/app/customer/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />
      <CustomerSwipeRunner jobId={job.id} jobTitle={job.title} />
    </div>
  );
}
