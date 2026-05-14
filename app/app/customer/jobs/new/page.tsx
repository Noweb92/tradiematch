import { requireRole } from "@/lib/auth/current-user";
import { JobCreationWizard } from "@/components/customer/JobCreationWizard";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "New job · TradieMatch" };

export default async function NewJobPage() {
  const { user, supabase } = await requireRole("customer");

  // Fetch defaults from profile
  const profileRes = await supabase
    .from("profiles")
    .select("city, state, postcode, latitude, longitude")
    .eq("id", user.id)
    .single();
  const profile = profileRes.data as {
    city: string | null;
    state: string | null;
    postcode: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;

  const customerRes = await supabase
    .from("customers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  const customer = customerRes.data as { id: string } | null;

  return (
    <div className="min-h-screen bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />
      <main className="max-w-xl mx-auto px-5 py-6 sm:py-10">
        <JobCreationWizard
          customerId={customer?.id ?? ""}
          defaultAddress={
            profile?.city
              ? `${profile.city}${profile.state ? ", " + profile.state : ""}${
                  profile.postcode ? " " + profile.postcode : ""
                }`
              : ""
          }
          defaultCoords={
            profile?.latitude && profile?.longitude
              ? { lat: profile.latitude, lon: profile.longitude }
              : null
          }
        />
      </main>
    </div>
  );
}
