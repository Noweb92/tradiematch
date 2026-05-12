"use client";

import { createBrowserClient } from "@supabase/ssr";

// Note: dropping the Database generic for V1 to avoid friction with the strict
// inferred Insert/Update types. We'll regenerate proper types in Session #5
// via `supabase gen types typescript` once the project is linked. See docs/DATABASE.md.

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
