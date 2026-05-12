# Architecture

## High-level

```
┌────────────────────────────────────────────────────────────────┐
│                          BROWSER (PWA)                          │
│  Next.js 14 (App Router) · React 18 · Framer Motion · Tailwind  │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
               │ HTTPS                            │ WebSocket (Realtime)
               ▼                                  ▼
┌────────────────────────────┐      ┌─────────────────────────────┐
│      Vercel (Edge)         │      │       Supabase Cloud         │
│  Next.js Server / RSC      │      │  Postgres + Auth + Storage   │
│  API routes (/api/*)       │      │  Realtime + Edge Functions   │
└────────────┬───────────────┘      └─────────────────────────────┘
             │                                    ▲
             │ Server-side calls (RLS-aware)      │
             ▼                                    │
   ┌─────────────────────┐                        │
   │  External services  │                        │
   │  Stripe · Resend    │────── webhooks ────────┘
   │  ABR · PostHog      │
   │  Sentry             │
   └─────────────────────┘
```

## Request flow examples

### 1. Customer creates a job

1. Browser → `POST /api/jobs/create` (Next.js API route)
2. API uses `createSupabaseServerClient()` → session cookie auto-attached
3. RLS verifies the user is a customer; INSERT into `jobs` table
4. Return `job.id`
5. Browser navigates to `/app/customer/jobs/[id]/swipe`

### 2. Tradie swipes right on a job

1. Browser → `POST /api/swipes` with `{ jobId, direction: 'right' }`
2. API checks quota: `tradies.matches_used_this_period < matches_quota_monthly`
3. If quota ok: INSERT swipe, then check for mutual swipe (customer side)
4. If mutual: BEGIN TRANSACTION → create match + chat_room + update job.status → COMMIT
5. Fire notifications (Resend email both parties)
6. Return `{ matched: true, matchId }` or `{ matched: false }`

### 3. Real-time chat

1. Browser subscribes via Supabase Realtime: `channel('chat:{roomId}').on(INSERT)`
2. Message INSERT in DB → broadcasts to all subscribers
3. Browser updates local state, scrolls to bottom

### 4. Stripe webhook

1. Stripe → `POST /api/webhooks/stripe` (raw body)
2. API verifies signature with `STRIPE_WEBHOOK_SECRET`
3. Switch on `event.type`: update `tradies.subscription_status / tier / quota`
4. INSERT into `subscription_events` (audit log)
5. 200 OK to Stripe

## Auth flow

```
                    ┌─────────────────┐
                    │  /signup/tradie │
                    └────────┬────────┘
                             │ supabase.auth.signUp({ data: { role:'tradie' }})
                             ▼
                    ┌────────────────────┐
                    │  Email confirm     │
                    │  (Supabase native) │
                    └────────┬───────────┘
                             │ user clicks link
                             ▼
                    ┌─────────────────────┐
                    │  /auth/callback     │
                    │  exchangeCodeForSession │
                    └────────┬────────────┘
                             │ checks profiles.onboarding_completed
                             ▼
              ┌──────────────┴──────────────┐
              ▼                             ▼
   /app/tradie/onboarding         /app/tradie/dashboard
```

A Postgres trigger `handle_new_user()` auto-creates the `profiles` row + role-specific row (`customers`) when the user record is inserted in `auth.users`. Tradies are NOT inserted into `tradies` automatically — that happens in onboarding (needs ABN).

## RLS strategy

- All tables RLS-enabled.
- `is_admin()` helper checks `profiles.role = 'admin'`.
- Default deny — every policy is permissive (FOR SELECT, INSERT, UPDATE) and explicit.
- Service-role key (in `lib/supabase/server.ts → createSupabaseServiceRoleClient()`) is used ONLY in webhook handlers and admin scripts that need to bypass RLS.

## Demo vs V1 coexistence

The visual demo (sidebar nav, `/swipe`, `/match`, `/investor`, etc.) shares the same Next.js app as the functional V1. They are separated by route:

- **Demo routes**: `/`, `/onboarding`, `/swipe`, `/match`, `/chat`, `/dashboard`, `/pricing`, `/investor`, `/discovery` → use mock data from `lib/mockData.ts`. These render inside `AppShell`.
- **Auth routes**: `/login`, `/signup/*`, `/forgot-password`, `/reset-password`, `/auth/*` → render WITHOUT `AppShell` (see `AppShell.tsx` → `AUTH_PREFIXES`).
- **Functional V1 routes**: `/app/customer/*`, `/app/tradie/*`, `/app/admin/*` → also render without AppShell, will get their own role-specific chrome.

This means the marketing site keeps working with zero env vars set, while the V1 features gracefully fail (toast "not configured") if Supabase isn't set up.

## Build plan (sessions)

| Session | Scope | Acceptance |
|---|---|---|
| **#1 ✅** | DB schema · auth · signup/login | User can sign up, confirm email, log in |
| **#2** | Onboarding flows · ABN verify · Storage uploads · Profile pages | Tradie can complete profile end-to-end |
| **#3** | Stripe subscriptions · webhooks · quotas · customer portal | Tradie can subscribe and be billed |
| **#4** | Matching engine · swipe wired to DB · real-time chat · exclusivity expiry cron | Two users can swipe, match, chat |
| **#5** | Admin panel · email templates · PWA · seed script · E2E tests · final docs | Production-ready |

## Key design decisions & tradeoffs

| Decision | Rationale | Tradeoff |
|---|---|---|
| Supabase over custom backend | Auth + DB + Storage + Realtime in one free tier. Solo founder velocity. | Vendor lock-in. Migrate to self-hosted Postgres if scale demands. |
| No Stripe Connect in V1 | Subscription only, no escrow. Simpler. | No customer→tradie payment routing yet (Phase 2). |
| Manual KYC | Founder reviews white card / insurance manually. | Doesn't scale beyond ~200 tradies/month. Onfido at $500 MRR. |
| Mobile PWA, not native | Single codebase. App stores later. | No push notifications on iOS in PWA (Web Push limited). |
| Free tier only for 6 months | <$50/month infra budget. | Will need migration plan at ~500 tradies (see `KNOWN_LIMITATIONS.md`). |
| Email OTP, no SMS | Twilio costs money. | Tradies who lose email access need manual recovery. |
| Demo + V1 in same app | Investor demo stays live during build. Single deploy. | Some bundle bloat. Refactor if needed. |
