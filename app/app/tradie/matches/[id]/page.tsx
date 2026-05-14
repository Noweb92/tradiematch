import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { ChatPanel, type ChatMessage } from "@/components/chat/ChatPanel";
import { TradieMatchActions } from "@/components/tradie/MatchActions";
import { tradeLabel } from "@/lib/constants/trades";

export const metadata = { title: "Match · TradieMatch" };

interface MatchRow {
  id: string;
  job_id: string;
  tradie_id: string;
  chat_room_id: string | null;
  matched_at: string;
  exclusive_until: string;
  status: string;
  jobs: {
    title: string;
    description: string;
    trade_category: string;
    urgency: string;
    photos: string[];
    budget_min: number | null;
    budget_max: number | null;
    location_address: string | null;
  } | null;
  customers: {
    profiles: {
      first_name: string | null;
      avatar_url: string | null;
      city: string | null;
    } | null;
  } | null;
}

export default async function TradieMatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, supabase } = await requireRole("tradie");

  const matchRes = await supabase
    .from("matches")
    .select(
      `
      id, job_id, tradie_id, chat_room_id, matched_at, exclusive_until, status,
      jobs ( title, description, trade_category, urgency, photos, budget_min, budget_max, location_address ),
      customers ( profiles ( first_name, avatar_url, city ) )
    `,
    )
    .eq("id", params.id)
    .maybeSingle();
  const match = matchRes.data as unknown as MatchRow | null;
  if (!match || !match.chat_room_id) redirect("/app/tradie/matches");

  const msgsRes = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_room_id", match.chat_room_id)
    .order("created_at", { ascending: true });
  const messages = (msgsRes.data ?? []) as unknown as ChatMessage[];

  const cust = match.customers;
  const job = match.jobs;
  const photo =
    cust?.profiles?.avatar_url ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cust?.profiles?.first_name ?? "Client")}&backgroundColor=FF6B35&textColor=FFFFFF`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/dashboard" />

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 grid lg:grid-cols-[300px_1fr] gap-4 min-h-0">
        <aside className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft h-fit">
          <Link
            href="/app/tradie/matches"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/55 hover:text-navy mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All matches
          </Link>

          <div className="flex items-center gap-3">
            <img src={photo} alt="" className="w-12 h-12 rounded-2xl object-cover" />
            <div className="min-w-0">
              <div className="font-black text-navy truncate">
                {cust?.profiles?.first_name ?? "Customer"}
              </div>
              <div className="text-xs text-navy/55 truncate">
                {cust?.profiles?.city ?? ""}
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
            <Row label="Urgency">
              {job?.urgency ?? "—"}
            </Row>
            <Row label="Budget">
              {job?.budget_min || job?.budget_max
                ? `$${job.budget_min ?? 0}–$${job.budget_max ?? "?"}`
                : "Not specified"}
            </Row>
          </div>

          {job?.description && (
            <div className="mt-4 pt-4 border-t border-navy/8">
              <div className="text-[10px] font-bold uppercase tracking-wider text-navy/55 mb-1">
                Description
              </div>
              <p className="text-xs text-navy/75 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-orange/10 border border-orange/30 px-3 py-2 text-[11px] font-bold text-orange">
            Exclusive · Reply by{" "}
            {new Date(match.exclusive_until).toLocaleDateString("en-AU")}
          </div>
        </aside>

        <section className="rounded-2xl bg-white border border-navy/8 shadow-soft flex flex-col min-h-[520px] overflow-hidden">
          <ChatPanel
            roomId={match.chat_room_id}
            selfId={user.id}
            initialMessages={messages}
            otherName={cust?.profiles?.first_name ?? "Customer"}
            otherAvatar={photo}
            quickActions={<TradieMatchActions matchId={match.id} />}
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
