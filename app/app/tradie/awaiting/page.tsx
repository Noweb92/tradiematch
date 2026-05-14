import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Clock, Mail } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "Awaiting verification · TradieMatch" };

export default async function AwaitingPage() {
  const { user, supabase } = await requireRole("tradie");
  const tradieRes = await supabase
    .from("tradies")
    .select("admin_verified, abn_entity_name, business_name")
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | { admin_verified: boolean; abn_entity_name: string | null; business_name: string | null }
    | null;

  if (!tradie) {
    redirect("/app/tradie/onboarding");
  }

  if (tradie.admin_verified) {
    redirect("/app/tradie/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/awaiting" />
      <main className="max-w-xl mx-auto px-5 py-10 sm:py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange/10 text-orange mb-5">
          <Clock className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Submitted &amp; under review.
        </h1>
        <p className="text-navy/65 mt-3 text-base leading-relaxed">
          Our team is reviewing <span className="font-bold">{tradie.business_name ?? tradie.abn_entity_name}</span>.
          You&apos;ll get an email once verified — usually within 24 hours, often
          faster on a weekday.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
          <Card icon={<ShieldCheck className="w-4 h-4" />} title="What we check">
            ABN active &amp; GST-registered · white card valid · public liability insurance &amp; expiry · trade categories make sense.
          </Card>
          <Card icon={<Mail className="w-4 h-4" />} title="What's next">
            Approved → pick a subscription (Basic / Pro / Elite) → go live in the swipe deck. Rejected → we email you why &amp; how to fix.
          </Card>
        </div>

        <div className="mt-8">
          <Link
            href="/app/tradie/onboarding"
            className="text-sm font-bold text-orange hover:underline"
          >
            Update my profile
          </Link>
        </div>
      </main>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft">
      <div className="flex items-center gap-2 text-orange mb-1.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p className="text-sm text-navy/70 leading-relaxed">{children}</p>
    </div>
  );
}
