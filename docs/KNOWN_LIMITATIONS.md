# Known limitations

What's not done in V1 and what will need attention as we grow.

## Scale ceilings

### Will break at ~500 paying tradies
- **Supabase free tier**: 500 MB DB + 2 GB bandwidth/mo + 50K monthly active users. Plan to upgrade to Pro ($25/mo) at ~200 tradies + 1K customers.
- **Vercel free tier**: 100 GB bandwidth + 100 K function invocations/day. Should hold until ~5K DAU. Upgrade to Pro ($20/mo) before national rollout.
- **Resend free tier**: 3K emails/mo · 100/day. Upgrade to $20/mo at first paid tradie ramp.

### Will break sooner if abused
- **Nominatim**: free public instance, 1 req/sec policy. Add caching + a paid alternative (Mapbox $0.50/1K) before national rollout.
- **ABR API**: free, no rate limit listed. We rate-limit ourselves at 10 req/min per IP in middleware (TODO Session #6).

## Hacky / hand-waved

### Type generation skipped
`lib/supabase/types.ts` is hand-maintained — the Supabase generic was dropped from the SSR client to avoid friction with Insert/Update inference. Run `supabase gen types typescript --linked > lib/supabase/types.ts` once and reintroduce the generic when the schema settles.

### Manual KYC
Tradie verification (white card + insurance) is reviewed by hand in `/app/admin/tradies/pending`. Doesn't scale past ~30 reviews per week per admin. Integrate Onfido or Stripe Identity at $5M MRR.

### Police checks are self-declared
We don't run actual police checks in V1. Documented as a known gap. CrimCheck.com.au integration costs ~$14-22 AUD per check — add when revenue covers.

### No PostGIS
Distance filtering uses haversine in app code. Fine until ~10K tradies. Switch to PostGIS `ST_DWithin` + spatial index when geo queries dominate.

### `expire_matches` is conservative
The function skips matches that have ANY chat activity, even a single "hi". This is intentional (don't kill engaged conversations) but means stalled chats hold the job indefinitely. Plan: add a "completed/declined" UI action so customers can free the job manually.

### No real-time presence
Chat shows "Realtime via Supabase" but doesn't track read receipts beyond the `read_at` column being settable. No "typing…" indicator. Supabase Presence works for this — add in V1.1.

### Cookie consent banner missing
Australian Privacy Act doesn't strictly require it for transactional cookies, but recommended for marketing emails / PostHog. Add before launch.

## Won't work without env vars

The codebase degrades gracefully:
- **Without Supabase env**: middleware no-ops, demo routes (`/`, `/swipe`, `/match`, etc.) keep working with mock data, auth routes show "couldn't sign in" toast.
- **Without Stripe env**: `/pricing` buttons return a configuration error; demo continues to render.
- **Without Resend env**: emails are silently skipped (logged to server console). All flows still work.
- **Without ABR_GUID**: tradie onboarding ABN step shows "ABN verification not configured" error.
- **Without CRON_SECRET**: cron endpoints return 401. Manual cron secret = no auto-quota-reset and no match expiry.

## Future work

### Session #6 candidates
- Rate limiting via Upstash Redis on `/api/swipes`, `/api/abn/verify`, `/api/auth/*`
- E2E tests with Playwright (customer-signup, tradie-signup, job-creation, swipe-match, chat, subscription)
- Unit tests for ABN checksum, quota logic, swipe_and_match RPC
- Sentry integration (frontend + backend)
- PostHog event tracking
- Cookie consent banner
- `/api/account/export` (data export per Privacy Act)
- `/api/account/delete` (hard delete via service role)

### Future product
- Push notifications (Web Push for PWA, FCM/APNs when native)
- Customer-to-tradie payments (Stripe Connect, escrow)
- Multi-photo upload with crop + EXIF strip
- AI-powered job-to-tradie matching scoring
- Tradie referral program ("invite a mate, get a month free")
- White-label / agency mode for property management firms
