import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { AccountPanel } from "@/components/shared/AccountPanel";

export const metadata = { title: "Account · TradieMatch" };

export default async function CustomerAccountPage() {
  const { user, supabase } = await requireRole("customer");
  const profileRes = await supabase
    .from("profiles")
    .select("first_name, last_name, phone, city, state, postcode, marketing_opt_in")
    .eq("id", user.id)
    .single();
  const profile = profileRes.data as
    | {
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        city: string | null;
        state: string | null;
        postcode: string | null;
        marketing_opt_in: boolean;
      }
    | null;

  return (
    <div className="min-h-screen bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <AccountPanel
          email={user.email}
          firstName={profile?.first_name ?? null}
          lastName={profile?.last_name ?? null}
          phone={profile?.phone ?? null}
          location={
            [profile?.city, profile?.state, profile?.postcode]
              .filter(Boolean)
              .join(", ") || null
          }
          marketingOptIn={profile?.marketing_opt_in ?? false}
        />
      </main>
    </div>
  );
}
