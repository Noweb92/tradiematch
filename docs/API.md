# API reference

All endpoints live under `/api/*` (Next.js App Router route handlers). Auth uses Supabase session cookies, so calls from the same-origin app are auto-authenticated. External callers (Stripe, Vercel Cron) authenticate via the signing secret / `x-cron-secret` header.

## Auth

### `POST /auth/callback` (GET handler)
Supabase OAuth + email-confirm exchange. Promotes admin if email is on `ADMIN_EMAILS`. Sends welcome email on first sign-in. Redirects to role-appropriate route.

### `POST /auth/logout` (also GET)
Clears the session and redirects to `/`.

### `POST /auth/promote-admin`
Called by `LoginForm` after password sign-in. Idempotent. Upgrades to admin if env-allowed. Returns `{ role, onboarding_completed }`.

## ABN

### `POST /api/abn/verify`
Body: `{ abn: string }`
Response: `ABNVerificationResult` — `{ valid, abn?, entityName?, entityType?, abnStatus?, gstRegistered?, state?, postcode?, error? }`
Validates format + checksum locally, then proxies to the Australian Business Register JSONP API.

## Geocoding

### `GET /api/geo/search?q=<query>`
AU-restricted Nominatim autocomplete. Returns `{ results: GeoSuggestion[] }` (up to 5). Cached 1h via `Cache-Control`.

## Swipes & matches

### `POST /api/swipes`
Body: `{ jobId: uuid, tradieId: uuid, direction: "left" | "right" }`
Validates ownership (customer owns job OR tradie owns tradie row), calls the `swipe_and_match` SQL RPC, returns:
```json
{ "ok": true, "matched": true, "match_id": "uuid", "chat_room_id": "uuid" }
```
Or on error:
```json
{ "ok": false, "error": "...", "code": "QUOTA_EXCEEDED" | "NO_SUBSCRIPTION" }
```
Fires match emails to both parties on success.

### `GET /api/customer/swipe-deck/[jobId]`
Returns `{ tradies: TradieCard[], jobStatus }`. Filters by trade, admin_verified, available, subscription_status, excludes already-swiped, sorts by rating + response rate. Applies tradie service-radius filter app-side.

### `GET /api/tradie/swipe-deck`
Returns `{ jobs: JobCard[], quotaRemaining }`. Filters by `status='open'`, tradie's trade_categories, excludes already-swiped, sorts by urgency then distance.

## Quotes

### `POST /api/quotes`
Body: `{ matchId: uuid, amount: number, description?: string, validUntil?: ISO date }`
Creates a `quotes` row + a `chat_messages` row with `type='quote'` and metadata. Sends quote email to customer.

## Stripe

### `POST /api/stripe/create-checkout`
Body: `{ tier: "basic" | "pro" | "elite" }`
Creates / reuses Stripe customer, opens Checkout Session for the right price, returns `{ url }`.

### `POST /api/stripe/create-portal`
Opens Stripe Customer Portal session for the signed-in tradie. Returns `{ url }`.

### `POST /api/webhooks/stripe`
Stripe-signed. Idempotent (unique `stripe_event_id` in `subscription_events`). Handles `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`. Updates `tradies.subscription_tier / status / quota / current_period_end`. Sends payment-failed email.

## Admin

All admin routes require `profile.role = 'admin'` (server-checked, RLS-backed).

### `POST /api/admin/tradies/[id]/approve`
Body: `{ action: "approve" | "reject", reason?: string }`
Approve flow: sets `admin_verified = true`, audits in `admin_actions`, sends approval email.
Reject flow: writes rejection reason, audits.

## Cron (Vercel)

All cron endpoints require `x-cron-secret` header matching `CRON_SECRET` env var.

### `GET /api/cron/reset-quotas` — daily 01:00 UTC
Safety net for `invoice.payment_succeeded` webhook misses. Resets `matches_used_this_period` for tradies past their period end.

### `GET /api/cron/expire-matches` — hourly
Calls SQL function `expire_matches()`. Expires inactive matches past `exclusive_until`, returns job to `open`.

## Types

Shared TypeScript types live in:
- `lib/supabase/types.ts` — DB row types
- `lib/matching/types.ts` — Swipe/Match domain types
- `lib/stripe/tiers.ts` — Tier config + `Tier` type
- `lib/abn/verify.ts` — `ABNVerificationResult`
- `lib/geo/nominatim.ts` — `GeoSuggestion`
- `lib/validation/auth.ts` — Zod schemas + inferred types

## Rate limiting (planned)

Targets for Session #6:
| Endpoint | Limit |
|---|---|
| `/api/abn/verify` | 10/min/IP |
| `/api/swipes` | 60/min/user |
| `/api/stripe/create-checkout` | 5/min/user |
| `/auth/*` | 5/min/IP for unauthenticated |

Implementation: Upstash Redis free tier + `lib/rate-limit.ts` middleware helper.
