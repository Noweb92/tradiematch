import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Log in · TradieMatch" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back."
      subtitle="Log in to your TradieMatch account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange font-bold hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-sm text-navy/55">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
