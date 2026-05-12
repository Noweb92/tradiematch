# Open Questions

Tracking decisions that need a founder call. I assumed sensible defaults to keep the build moving — flag anything you'd like changed.

## Auth & users

- **Admin assignment**: `ADMIN_EMAILS` env var lists emails that auto-receive the `admin` role. The first signup with that email becomes admin. Acceptable?
- **Email confirmation required?** Default = YES (Supabase native). Disabling speeds up dev but lets fake emails through. Keep it.
- **Google OAuth-only signup, what role?** Solution: pass `?role=customer` or `?role=tradie` in the OAuth callback URL. Sign-up buttons on each role page pre-fill it. ✅
- **Tradies needing to change role to customer later?** Not supported. Make a second account.

## ABN verification

- **What if a tradie's ABN is valid but not GST-registered?** BP requires GST. We block the signup with a clear error. Reasonable?
- **Sole traders vs companies vs partnerships?** Currently all accepted as long as ABN is active. Filter to specific entity types?
- **What if ABR API is down?** We show a graceful error and let the tradie retry. We could fall back to manual admin verification for a queue.

## Stripe

- **Subscription auto-renewal**: yes (default Stripe behaviour). Cancel = stays active until period_end.
- **Trial period?** Not in V1. Tradies pay immediately on signup. (BP says no trials.)
- **What happens if subscription becomes `past_due`?** Tradie loses access to new swipes; existing matches keep working. After 14 days → `canceled` + matches frozen.
- **GST on the subscription?** Stripe Tax handles this. Need to enable in Stripe dashboard once ABN is set up.

## Matching

- **Exclusivity window**: BP says 48 hours. Confirmed.
- **What happens after 48h with no chat activity?** Match expires. Job returns to `open`. Tradie's quota is NOT refunded (otherwise tradies hoard matches).
- **Can a tradie unmatch themselves?** Not in V1 (causes abuse). They can simply not respond, match expires after 48h.
- **Can a customer unmatch?** Yes — sets match.status = 'declined'. Tradie's quota IS refunded in this case.

## Data & privacy

- **GDPR/AU Privacy Act data export?** Endpoint stubbed at `/api/account/export` (Session #5). Returns a JSON dump of the user's data.
- **Account deletion**: cascade deletes via FK `ON DELETE CASCADE`. Soft-delete vs hard-delete? Hard delete by default.
- **Cookie consent banner?** Australian Privacy Act doesn't strictly require, but recommended for marketing emails. Implement as a simple component in Session #5.

## Operations

- **Where do tradies upload white card / insurance?** Supabase Storage `tradie-documents` bucket (private). Admins review in `/app/admin/tradies/pending`.
- **What if a tradie's insurance expires?** Cron checks daily. 14/7/1 day warnings via email. After expiry → `available = false` + email "renew your insurance".
- **Support inbox?** `hello@tradiematch.com.au` via Resend. Contact form on `/help` forwards there.
- **Rate limiting?** 10 req/min per IP on `/api/abn/verify`, `/api/auth/*`. Upstash Redis (free tier) in Session #3.

## Geographic

- **Perth pilot only at launch?** Yes per BP. Hard-gate signup by postcode? Or soft (allow any AU postcode but only show pilot tradies)?
- **Decision**: soft. Anyone can sign up. Show "we're launching in your city soon" if outside Perth.
- **NZ later?** Out of V1.

## Open architecture decisions deferred

- **Postgres `earthdistance` extension for geo?** Not in V1. Haversine in JS is fine until ~10K tradies.
- **PostGIS later?** Switch when geo queries dominate >50% of swipe load.
- **Stream Chat or Sendbird?** Not yet. Supabase Realtime is free and sufficient for V1.
- **Push notifications?** PWA Web Push in Session #5. Native push (APNs/FCM) post-V1.

## To confirm with you when you're back

- [ ] Should the V1 deploy be a separate Vercel project from the demo? (Currently same.)
- [ ] Domain: `tradiematch.com.au` confirmed?
- [ ] Stripe product creation: do you have a Stripe AU account? Or need to create one?
- [ ] ABR GUID applied for? (1-2 day delay.)
- [ ] Resend domain verified?
