# Deployment

## Required external services

You need accounts on:

1. **Supabase** — DB + Auth + Storage + Realtime (free tier)
2. **Stripe** — Subscriptions (test mode for dev)
3. **Resend** — Transactional emails (free tier, 3K/month)
4. **ABR** (Australian Business Register) — ABN verification (free, requires GUID registration)
5. **Vercel** — Hosting (free tier, already done — `tradiematch.vercel.app`)

Optional but recommended:
- **PostHog** — product analytics (free, 1M events/month)
- **Sentry** — error tracking (free, 5K errors/month)
- **Upstash Redis** — rate limiting (free, 10K req/day)

---

## Step 1 — Supabase setup

1. Go to <https://supabase.com> → New project → name `tradiematch-prod`.
2. Region: **Sydney** (`ap-southeast-2`) for AU data residency.
3. Wait ~2 min for provisioning.
4. **SQL Editor** → paste the contents of `supabase/migrations/0001_initial_schema.sql` → Run.
5. **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (secret!) → `SUPABASE_SERVICE_ROLE_KEY`
6. **Authentication → Providers** → enable **Google** (you'll need a Google Cloud OAuth client).
7. **Authentication → URL Configuration** → set Site URL to your production domain. Add redirect URLs for `https://tradiematch.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`.
8. **Storage** → create three buckets:
   - `tradie-portfolio` (public)
   - `tradie-documents` (private, RLS-controlled)
   - `job-photos` (public)

---

## Step 2 — Stripe setup

1. <https://dashboard.stripe.com> → activate **Test mode**.
2. **Products** → create 3 products with recurring prices:
   - **TradieMatch Basic** → AUD $49 / month
   - **TradieMatch Pro** → AUD $89 / month
   - **TradieMatch Elite** → AUD $149 / month
3. Copy each Price ID (`price_xxx`) → `STRIPE_PRICE_BASIC/PRO/ELITE`.
4. **Developers → API keys** → copy:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. **Developers → Webhooks** → add endpoint:
   - URL: `https://tradiematch.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
6. **Settings → Billing → Customer portal** → enable.

For local development of webhooks, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Step 3 — ABR (Australian Business Register)

1. Register at <https://abr.business.gov.au/Tools/WebServices>
2. Submit the form. Approval takes 1-2 business days.
3. They email you a `GUID` → `ABR_GUID`.

Free, unlimited use. No rate limit listed but use defensively (rate-limit yourself to 10 req/min in `/api/abn/verify`).

---

## Step 4 — Resend

1. <https://resend.com> → sign up.
2. **Domains** → add `tradiematch.com.au` and verify DNS.
3. **API keys** → create one → `RESEND_API_KEY`.
4. Set `RESEND_FROM_EMAIL=hello@tradiematch.com.au` (or any verified address).

---

## Step 5 — Vercel deploy

The repo is already deployed at `tradiematch.vercel.app`. To add env vars:

1. <https://vercel.com> → your project → **Settings → Environment Variables**.
2. Add every variable from `.env.local.example` (set all three environments: Production / Preview / Development).
3. Trigger a redeploy (push any commit or click **Redeploy**).

---

## Step 6 — Local dev

```bash
cp .env.local.example .env.local
# Fill in values
npm install
npm run dev
```

Visit <http://localhost:3000>.

To test the full flow locally you'll also need Stripe CLI running (`stripe listen` — see step 2).

---

## Step 7 — Custom domain (when ready)

1. Buy `tradiematch.com.au` (~$50/yr from a registrar like VentraIP or auDA partner).
2. In Vercel → **Settings → Domains** → add `tradiematch.com.au`.
3. Update DNS records as instructed.
4. Update `NEXT_PUBLIC_APP_URL` env var to `https://tradiematch.com.au`.
5. Update Supabase Site URL + Auth redirect URLs.
6. Update Stripe webhook URL.

---

## Troubleshooting

- **`/login` returns 500**: Supabase env vars not set in Vercel. Add them and redeploy.
- **Google OAuth fails**: redirect URL mismatch. Make sure Google Cloud OAuth client has the exact callback URL: `https://<project>.supabase.co/auth/v1/callback`.
- **Stripe webhooks fail signature check**: wrong `STRIPE_WEBHOOK_SECRET` — copy fresh from the webhook detail page.
- **ABN verify fails with "Invalid request"**: ABR GUID needs to be URL-encoded if it contains hyphens.
- **Vercel build fails on missing env**: V1 features gracefully degrade — only the auth/Stripe/ABN routes hard-require env vars. Demo routes always work.
