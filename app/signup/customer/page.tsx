import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Customer sign up · TradieMatch" };

export default function CustomerSignupPage() {
  return (
    <AuthCard
      title="Find your tradie."
      subtitle="Free to sign up. Match in 60 seconds with ABN-verified pros."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-orange font-bold hover:underline">
            Log in
          </Link>
          {" · "}
          <Link
            href="/signup/tradie"
            className="text-navy font-bold hover:underline"
          >
            I&apos;m a tradie instead
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-sm text-navy/55">Loading…</div>}>
        <SignupForm role="customer" />
      </Suspense>
    </AuthCard>
  );
}
