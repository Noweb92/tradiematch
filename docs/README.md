# TradieMatch V1

Australia's smartest tradie marketplace. Tinder-style exclusive matching. Subscription billing. Mobile-first PWA.

This repo contains both:

- The **visual demo** (the marketing site at `tradiematch.vercel.app`) — fully static, mock data, used for investor pitches.
- The **functional V1** (in progress) — Supabase auth, real DB, Stripe subscriptions, real-time chat, admin panel.

The demo keeps working through the V1 build because the demo pages (`/`, `/swipe`, `/match`, `/investor`, `/discovery`, etc.) use mock data and remain untouched. The functional V1 lives under `/app/`, `/login`, `/signup`, `/auth/`.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Copy and fill env vars
cp .env.local.example .env.local
# (fill in Supabase + Stripe + Resend + ABR GUID — see docs/DEPLOYMENT.md)

# 3. Apply DB migration to your Supabase project
# Option A (CLI): supabase db push
# Option B: copy supabase/migrations/0001_initial_schema.sql into SQL Editor

# 4. Dev server
npm run dev
```

Open <http://localhost:3000>.

---

## Stack

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Next.js API routes (no separate server)
- **Database / Auth / Storage / Realtime**: Supabase (free tier)
- **Payments**: Stripe Subscriptions
- **Email**: Resend
- **ABN verification**: ABR (Australian Business Register) free API
- **Hosting**: Vercel (frontend) + Supabase Cloud (backend)

---

## Project structure

```
/app
  /(demo pages)              ← marketing site, mock data
  /signup, /login, /forgot-password, /reset-password
  /auth/callback             ← OAuth + email confirm handler
  /auth/logout
  /app
    /customer/...            ← (coming) customer-only routes
    /tradie/...              ← (coming) tradie-only routes
    /admin/...               ← (coming) admin panel
  /api
    /abn/verify              ← (coming) ABR proxy
    /stripe/create-checkout  ← (coming)
    /webhooks/stripe         ← (coming)
/components
  /auth                      ← AuthCard, FormField, GoogleButton, SignupForm, LoginForm
  /...
/lib
  /supabase                  ← client.ts, server.ts, middleware.ts, types.ts
  /validation                ← Zod schemas
  /cn.ts
/supabase
  /migrations/0001_initial_schema.sql
/public
  TradieMatch_Business_Plan.docx
/docs
  README.md, ARCHITECTURE.md, DATABASE.md, DEPLOYMENT.md, QUESTIONS.md
```

---

## What's done

- [x] **Session #1**: DB schema · auth · signup / login / reset
- [x] **Session #2**: Onboarding (customer + tradie) · ABN verify (ABR) · Nominatim · Storage uploads · job creation
- [x] **Session #3**: Stripe Subscriptions · webhooks · quota management · billing portal · daily quota reset cron
- [x] **Session #4**: Matching engine (atomic RPC) · real-time chat (Supabase Realtime) · quote system · hourly expiry cron
- [x] **Session #5**: Admin panel · transactional emails (Resend) · PWA manifest + service worker · seed script · final docs

## What's not done — see `docs/KNOWN_LIMITATIONS.md`

Most important gaps for production:
- Real KYC (Onfido / Stripe Identity) — V1 uses manual admin review
- Rate limiting (planned for Session #6)
- E2E tests with Playwright
- PostGIS for >10K tradies
- Cookie consent banner
- Push notifications

---

## Commands

```bash
npm run dev      # local dev
npm run build    # production build (must pass before merging)
npm run lint     # ESLint
```

---

## Documentation

- [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) — system design, request flows, build plan
- [`docs/DATABASE.md`](./DATABASE.md) — schema reference, RLS policies, query patterns
- [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) — Supabase setup, Stripe setup, Vercel deploy
- [`docs/QUESTIONS.md`](./QUESTIONS.md) — open decisions for the founder
