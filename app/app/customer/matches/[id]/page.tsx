import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Briefcase } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { ChatPanel, type ChatMessage } from "@/components/chat/ChatPanel";
import { tradeLabel } from "@/lib/constants/trades";

export const metadata = { title: "Match · TradieMatch" };

interface MatchRow {
  id: string;
  job_id: string;
  tradie_id: string;
  customer_id: string;
  chat_room_id: string | null;
  matched_at: string;
  exclusive_until: string;
  status: string;
  jobs: {
    title: string;
    description: string;
    trade_category: string;
    photos: string[];
    budget_min: number | null;
    budget_max: number | null;
  } | null;
  tradies: {
    business_name: string | null;
    rating_average: number;
    rating_count: number;
    hourly_rate_min: number | null;
    hourly_rate_max: number | null;
    profile_id: string;
    profiles: {
      first_name: string | null;
      avatar_url: string | null;
      city: string | null;
    } | null;
  } | null;
}

export default async function CustomerMatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, supabase } = await requireRole("customer");

  const matchRes = await supabase
    .from("matches")
    .select(
      `
      id, job_id, tradie_id, customer_id, chat_room_id, matched_at,
      exclusive_until, status,
      jobs ( title, description, trade_category, photos, budget_min, budget_max ),
      tradies ( business_name, rating_average, rating_count, hourly_rate_min, hourly_rate_max, profile_id,
                profiles ( first_name, avatar_url, city ) )
    `,
    )
    .eq("id", params.id)
    .maybeSingle();

  const match = matchRes.data as unknown as MatchRow | null;
  if (!match || !match.chat_room_id) redirect("/app/customer/matches");

  const msgsRes = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_room_id", match.chat_room_id)
    .order("created_at", { ascending: true });
  const messages = (msgsRes.data ?? []) as unknown as ChatMessage[];

  const tradie = match.tradies;
  const job = match.jobs;
  const photo =
    tradie?.profiles?.avatar_url ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tradie?.business_name ?? tradie?.profiles?.first_name ?? "Tradie")}&backgroundColor=0A2540&textColor=FFFFFF`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 grid lg:grid-cols-[300px_1fr] gap-4 min-h-0">
        {/* Job + tradie context (sidebar on desktop, top on mobile) */}
        <aside className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft h-fit">
          <Link
            href="/app/customer/matches"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/55 hover:text-navy mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All matches
          </Link>

          <div className="flex items-center gap-3">
            <img src={photo} alt="" className="w-12 h-12 rounded-2xl object-cover" />
            <div className="min-w-0">
              <div className="font-black text-navy truncate">
                {tradie?.business_name ?? tradie?.profiles?.first_name}
              </div>
              <div className="text-xs text-navy/55 flex items-center gap-1">
                <Star className="w-3 h-3 fill-orange text-orange" />
                {tradie?.rating_average?.toFixed(1) ?? "—"} ({tradie?.rating_count ?? 0})
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-navy/8 space-y-2 text-xs">
            <Row icon={<Briefcase className="w-3.5 h-3.5" />} label="Job">
              {job?.title}
            </Row>
            <Row icon={<MapPin className="w-3.5 h-3.5" />} label="Trade">
              {tradeLabel(job?.trade_category ?? "")}
            </Row>
            <Row label="Rate">
              ${tradie?.hourly_rate_min}–${tradie?.hourly_rate_max} / hr
            </Row>
            <Row label="Budget">
              {job?.budget_min || job?.budget_max
                ? `$${job.budget_min ?? 0}–$${job.budget_max ?? "?"}`
                : "Not specified"}
            </Row>
          </div>

          <div className="mt-4 rounded-xl bg-orange/10 border border-orange/30 px-3 py-2 text-[11px] font-bold text-orange">
            Exclusive match · Replies until{" "}
            {new Date(match.exclusive_until).toLocaleDateString("en-AU")}
          </div>
        </aside>

        {/* Chat */}
        <section className="rounded-2xl bg-white border border-navy/8 shadow-soft flex flex-col min-h-[520px] overflow-hidden">
          <ChatPanel
            roomId={match.chat_room_id}
            selfId={user.id}
            initialMessages={messages}
            otherName={tradie?.business_name ?? tradie?.profiles?.first_name ?? "Tradie"}
            otherAvatar={photo}
          />
        </section>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-14 shrink-0 flex items-center gap-1 text-navy/55 font-bold uppercase tracking-wider text-[10px]">
        {icon}
        {label}
      </div>
      <div className="flex-1 text-navy font-semibold text-xs">{children}</div>
    </div>
  );
}
