import { requireRole } from "@/lib/auth/current-user";
import { TradieOnboardingWizard } from "@/components/tradie/OnboardingWizard";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "Tradie onboarding · TradieMatch" };

export default async function TradieOnboardingPage() {
  const { user, supabase } = await requireRole("tradie");

  // Check if tradie row already exists (resume onboarding)
  const tradieRes = await supabase
    .from("tradies")
    .select(
      "id, abn, abn_verified, abn_entity_name, business_name, trade_categories, service_radius_km, hourly_rate_min, hourly_rate_max, years_experience, bio, white_card_url, insurance_url, insurance_expiry, admin_verified",
    )
    .eq("profile_id", user.id)
    .maybeSingle();
  const existing = tradieRes.data as
    | {
        id: string;
        abn?: string;
        abn_verified?: boolean;
        abn_entity_name?: string;
        business_name?: string;
        trade_categories?: string[];
        service_radius_km?: number;
        hourly_rate_min?: number;
        hourly_rate_max?: number;
        years_experience?: number;
        bio?: string;
        white_card_url?: string;
        insurance_url?: string;
        insurance_expiry?: string;
        admin_verified?: boolean;
      }
    | null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/onboarding" />
      <main className="max-w-2xl mx-auto px-5 py-6 sm:py-10">
        <TradieOnboardingWizard
          userId={user.id}
          firstName={user.first_name}
          existing={existing}
        />
      </main>
    </div>
  );
}
