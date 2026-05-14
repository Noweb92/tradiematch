import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "Checkout cancelled · TradieMatch" };

export default async function SubscribeCancelledPage() {
  const { user } = await requireRole("tradie");

  return (
    <div className="min-h-screen bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/dashboard" />

      <main className="max-w-xl mx-auto px-5 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy/[0.06] text-navy/55 mb-5">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          No worries.
        </h1>
        <p className="text-navy/65 mt-3 text-base leading-relaxed">
          Nothing was charged. Your profile is still here and ready when you
          decide to subscribe.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press min-h-[48px]"
          >
            See plans again
          </Link>
          <Link
            href="/app/tradie/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-navy/10 text-navy font-bold hover:border-navy/25 btn-press min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
