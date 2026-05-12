# Database

Schema lives at `supabase/migrations/0001_initial_schema.sql`. Apply via Supabase SQL editor or the Supabase CLI.

## Tables overview

```
auth.users (Supabase native)
    │
    ▼
profiles ──┬───── customers ───── jobs ─────┐
           │                                │
           └───── tradies ───── tradie_portfolio
                                            │
                              swipes ◄──────┤
                                            │
                              matches ──────┘
                                  │
                              chat_rooms ── chat_messages
                                            quotes
                                            reviews

subscription_events  ◄── tradies (audit log of Stripe events)
analytics_events     ◄── profiles (light backup for PostHog)
admin_actions        ◄── profiles (admin audit log)
```

## Key tables

### `profiles` — extends `auth.users`
Every authenticated user has one row. Role is stamped at signup.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | FK → auth.users(id) |
| role | enum | `customer` / `tradie` / `admin` |
| onboarding_completed | bool | Drives post-login redirect |
| latitude / longitude | numeric | For geo-distance queries |

### `tradies` — extends `profiles`
Created during **onboarding** (not at signup) because we need ABN.

Critical columns:
- `abn_verified` + `admin_verified` — both must be `true` for the tradie to appear in customer swipe results.
- `subscription_tier` / `matches_quota_monthly` / `matches_used_this_period` — quota gating.
- `stripe_customer_id` / `stripe_subscription_id` — link to Stripe.

### `jobs`
Customer-created. `status` transitions: `open → matched → in_progress → completed`.

### `swipes`
Append-only log of every swipe. Composite unique key prevents double-swipes.
Mutual right-swipe = match creation (see `lib/matching/engine.ts` in Session #4).

### `matches`
Created when both sides swipe right. `exclusive_until` is set to `NOW() + 48h`. A cron job (`/api/cron/expire-matches`) expires inactive matches and returns the job to `open`.

### `chat_rooms` / `chat_messages`
One chat_room per match. Real-time via Supabase Realtime (`postgres_changes` on INSERT).

## Row Level Security

All tables have RLS enabled. Key policies:

- **profiles**: read self + verified tradies (publicly). Update self only.
- **tradies**: read if admin_verified OR own row. Insert/update own row.
- **jobs**: customer reads own. Verified tradies read `status = 'open'`. Tradie reads matched jobs.
- **swipes**: read/insert only the role you are.
- **matches** / **chat_rooms** / **chat_messages** / **quotes**: only the two parties (+ admins).
- **reviews**: public read. Insert only as reviewer.
- **subscription_events** / **admin_actions**: admin-only.

`is_admin()` helper (SQL function) returns `EXISTS(profiles WHERE id = auth.uid() AND role = 'admin')`.

## Auth trigger

`handle_new_user()` runs `AFTER INSERT ON auth.users` and creates the `profiles` row + `customers` row (if role = 'customer') from `raw_user_meta_data`.

Tradie row creation happens in onboarding (Session #2) because ABN is required.

## Critical indexes

| Index | Purpose |
|---|---|
| `idx_jobs_status_category` | Tradie swipe deck (filter by `status = 'open'` + category) |
| `idx_jobs_location` | Distance filtering (haversine in app code) |
| `idx_tradies_verified_available` (partial) | Customer swipe deck — only verified + available |
| `idx_tradies_categories` (GIN) | Filter tradies by trade category |
| `idx_swipes_lookup` | Mutual swipe check (`O(1)` instead of full scan) |
| `idx_matches_active` | Expiry cron query |
| `idx_chat_messages_room` | Chat scroll (most recent first) |

## Common query patterns

### Fetch swipe deck for a customer (excluding already-swiped tradies)

```sql
SELECT t.*, p.first_name, p.last_name, p.avatar_url
FROM tradies t
JOIN profiles p ON p.id = t.profile_id
WHERE t.admin_verified = TRUE
  AND t.available = TRUE
  AND t.subscription_status IN ('active', 'trialing')
  AND $1 = ANY(t.trade_categories)
  AND t.id NOT IN (
    SELECT tradie_id FROM swipes
    WHERE job_id = $2 AND swiper_role = 'customer'
  )
  -- distance filter applied client-side or via PostGIS later
ORDER BY t.rating_average DESC, t.response_rate DESC
LIMIT 20;
```

### Check for mutual swipe + create match

```sql
WITH mutual AS (
  SELECT 1 FROM swipes
  WHERE job_id = $1 AND tradie_id = $2
    AND swiper_role = 'tradie' AND direction = 'right'
)
INSERT INTO matches (job_id, tradie_id, customer_id)
SELECT $1, $2, (SELECT customer_id FROM jobs WHERE id = $1)
WHERE EXISTS (SELECT 1 FROM mutual)
RETURNING id;
```

(Better: a stored procedure `create_match_if_mutual()` — Session #4.)

## Regenerating types

When the schema changes, regenerate `lib/supabase/types.ts`:

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
npx supabase gen types typescript --linked > lib/supabase/types.ts
```

(In V1, types are hand-maintained to avoid the dev-dep weight.)
