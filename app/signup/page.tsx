import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Search, Hammer, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sign up · TradieMatch",
};

export default function SignupSelectionPage() {
  return (
    <AuthCard
      title="Join TradieMatch"
      subtitle="Are you looking for a tradie, or are you a tradie looking for work?"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-orange font-bold hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="grid gap-3">
        <Link
          href="/signup/customer"
          className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-navy/10 hover:border-orange hover:bg-orange/[0.03] transition-all"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl bg-orange/10 text-orange grid place-items-center group-hover:bg-orange group-hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-navy">I need a tradie</div>
            <div className="text-xs text-navy/55 mt-0.5">
              Post a job. Get matched in 60 seconds.
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-navy/40 group-hover:text-orange group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/signup/tradie"
          className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-navy/10 hover:border-orange hover:bg-orange/[0.03] transition-all"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl bg-navy/[0.06] text-navy grid place-items-center group-hover:bg-navy group-hover:text-white transition-colors">
            <Hammer className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-navy">I am a tradie</div>
            <div className="text-xs text-navy/55 mt-0.5">
              ABN-verified. Exclusive matches. Subscription billing.
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-navy/40 group-hover:text-orange group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </AuthCard>
  );
}
