import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Tradie sign up · TradieMatch" };

export default function TradieSignupPage() {
  return (
    <AuthCard
      title="Get exclusive leads."
      subtitle="Subscription, not pay-per-lead. ABN + license + insurance verified before you go live."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-orange font-bold hover:underline">
            Log in
          </Link>
          {" · "}
          <Link
            href="/signup/customer"
            className="text-navy font-bold hover:underline"
          >
            I&apos;m a customer instead
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-sm text-navy/55">Loading…</div>}>
        <SignupForm role="tradie" />
      </Suspense>
    </AuthCard>
  );
}
