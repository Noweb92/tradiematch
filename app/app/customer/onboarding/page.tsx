import { requireRole } from "@/lib/auth/current-user";
import { CustomerOnboardingWizard } from "@/components/customer/OnboardingWizard";

export const metadata = { title: "Welcome · TradieMatch" };

export default async function CustomerOnboardingPage() {
  const { user } = await requireRole("customer");

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <div className="max-w-xl mx-auto px-5 py-6 sm:py-10">
        <CustomerOnboardingWizard
          firstName={user.first_name}
          email={user.email}
        />
      </div>
    </main>
  );
}
