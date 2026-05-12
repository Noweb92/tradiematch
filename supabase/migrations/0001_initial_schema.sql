-- =============================================================================
-- TradieMatch V1 - Initial Schema
-- =============================================================================
-- Australian tradie marketplace. Mobile-first. Exclusive matching. Subscriptions.
-- Designed to run on Supabase free tier through ~500 paying tradies.
-- =============================================================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'tradie', 'admin');
  CREATE TYPE subscription_tier AS ENUM ('none', 'basic', 'pro', 'elite');
  CREATE TYPE job_status AS ENUM ('open', 'matched', 'in_progress', 'completed', 'canceled');
  CREATE TYPE job_urgency AS ENUM ('flexible', 'within_week', 'asap');
  CREATE TYPE swipe_role AS ENUM ('customer', 'tradie');
  CREATE TYPE swipe_direction AS ENUM ('left', 'right');
  CREATE TYPE match_status AS ENUM ('active', 'expired', 'converted', 'declined');
  CREATE TYPE message_type AS ENUM ('text', 'image', 'quote', 'system');
  CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  city TEXT,
  state TEXT,
  postcode TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);

-- =============================================================================
-- TRADIES
-- =============================================================================

CREATE TABLE IF NOT EXISTS tradies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  abn TEXT UNIQUE NOT NULL,
  abn_verified BOOLEAN DEFAULT FALSE,
  abn_verified_at TIMESTAMPTZ,
  abn_entity_name TEXT,
  abn_entity_type TEXT,
  abn_gst_registered BOOLEAN,
  business_name TEXT,
  trade_categories TEXT[] NOT NULL DEFAULT '{}',
  service_radius_km INT NOT NULL DEFAULT 25 CHECK (service_radius_km BETWEEN 5 AND 50),
  hourly_rate_min NUMERIC(8, 2),
  hourly_rate_max NUMERIC(8, 2),
  years_experience INT CHECK (years_experience >= 0),
  bio TEXT,
  white_card_url TEXT,
  insurance_url TEXT,
  insurance_expiry DATE,
  police_check_url TEXT,
  admin_verified BOOLEAN DEFAULT FALSE,
  admin_verified_at TIMESTAMPTZ,
  admin_verified_by UUID REFERENCES profiles(id),
  admin_rejection_reason TEXT,
  subscription_tier subscription_tier DEFAULT 'none',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_current_period_end TIMESTAMPTZ,
  matches_quota_monthly INT DEFAULT 0,
  matches_used_this_period INT DEFAULT 0,
  rating_average NUMERIC(3, 2) DEFAULT 0 CHECK (rating_average BETWEEN 0 AND 5),
  rating_count INT DEFAULT 0,
  response_rate NUMERIC(5, 2) DEFAULT 100 CHECK (response_rate BETWEEN 0 AND 100),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tradies_verified_available
  ON tradies(admin_verified, available, subscription_status)
  WHERE admin_verified = TRUE AND available = TRUE;
CREATE INDEX IF NOT EXISTS idx_tradies_categories
  ON tradies USING GIN(trade_categories);
CREATE INDEX IF NOT EXISTS idx_tradies_stripe_customer ON tradies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_tradies_stripe_sub ON tradies(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_tradies_pending_review
  ON tradies(admin_verified, created_at) WHERE admin_verified = FALSE;

-- =============================================================================
-- TRADIE PORTFOLIO
-- =============================================================================

CREATE TABLE IF NOT EXISTS tradie_portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID NOT NULL REFERENCES tradies(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_tradie ON tradie_portfolio(tradie_id, display_order);

-- =============================================================================
-- CUSTOMERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- JOBS
-- =============================================================================

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trade_category TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  location_address TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  urgency job_urgency NOT NULL DEFAULT 'flexible',
  budget_min NUMERIC(10, 2),
  budget_max NUMERIC(10, 2),
  status job_status NOT NULL DEFAULT 'open',
  matched_tradie_id UUID REFERENCES tradies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_category ON jobs(status, trade_category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_matched_tradie ON jobs(matched_tradie_id);

-- =============================================================================
-- SWIPES
-- =============================================================================

CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tradie_id UUID NOT NULL REFERENCES tradies(id) ON DELETE CASCADE,
  swiper_role swipe_role NOT NULL,
  direction swipe_direction NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, tradie_id, swiper_role)
);

CREATE INDEX IF NOT EXISTS idx_swipes_lookup ON swipes(job_id, tradie_id, swiper_role);
CREATE INDEX IF NOT EXISTS idx_swipes_tradie ON swipes(tradie_id, created_at DESC);

-- =============================================================================
-- MATCHES
-- =============================================================================

CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tradie_id UUID NOT NULL REFERENCES tradies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exclusive_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  status match_status NOT NULL DEFAULT 'active',
  chat_room_id UUID,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_matches_active ON matches(status, exclusive_until);
CREATE INDEX IF NOT EXISTS idx_matches_tradie ON matches(tradie_id, matched_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_customer ON matches(customer_id, matched_at DESC);

-- =============================================================================
-- CHAT ROOMS & MESSAGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID UNIQUE NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  attachment_url TEXT,
  read_at TIMESTAMPTZ,
  message_type message_type NOT NULL DEFAULT 'text',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(chat_room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(chat_room_id, read_at) WHERE read_at IS NULL;

-- =============================================================================
-- QUOTES
-- =============================================================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  tradie_id UUID NOT NULL REFERENCES tradies(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  valid_until DATE,
  status quote_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_quotes_match ON quotes(match_id, created_at DESC);

-- =============================================================================
-- REVIEWS
-- =============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);

-- =============================================================================
-- SUBSCRIPTION EVENTS (Stripe audit log)
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tradie_id UUID REFERENCES tradies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_events_tradie ON subscription_events(tradie_id, created_at DESC);

-- =============================================================================
-- ANALYTICS EVENTS (light backup for PostHog)
-- =============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name, created_at DESC);

-- =============================================================================
-- ADMIN ACTIONS (audit log)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions ON admin_actions(admin_id, created_at DESC);

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tradies_updated_at ON tradies;
CREATE TRIGGER trg_tradies_updated_at BEFORE UPDATE ON tradies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- AUTH HOOK: auto-create profile on signup
-- =============================================================================
-- The signup form passes role + name in user metadata.
-- This trigger creates a row in profiles AND the role-specific table.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
BEGIN
  user_role_value := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'customer'
  );

  INSERT INTO profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    user_role_value,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  IF user_role_value = 'customer' THEN
    INSERT INTO customers (profile_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  -- Tradie row is created during onboarding (needs ABN)

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradie_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Helper to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES
DROP POLICY IF EXISTS "profiles read self or admin" ON profiles;
CREATE POLICY "profiles read self or admin" ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "profiles read verified tradies public" ON profiles;
CREATE POLICY "profiles read verified tradies public" ON profiles FOR SELECT
  USING (role = 'tradie' AND EXISTS (
    SELECT 1 FROM tradies t WHERE t.profile_id = profiles.id AND t.admin_verified = TRUE
  ));

DROP POLICY IF EXISTS "profiles update own" ON profiles;
CREATE POLICY "profiles update own" ON profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- TRADIES
DROP POLICY IF EXISTS "tradies public read verified" ON tradies;
CREATE POLICY "tradies public read verified" ON tradies FOR SELECT
  USING (admin_verified = TRUE OR profile_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "tradies insert own" ON tradies;
CREATE POLICY "tradies insert own" ON tradies FOR INSERT
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "tradies update own" ON tradies;
CREATE POLICY "tradies update own" ON tradies FOR UPDATE
  USING (profile_id = auth.uid() OR is_admin())
  WITH CHECK (profile_id = auth.uid() OR is_admin());

-- TRADIE_PORTFOLIO
DROP POLICY IF EXISTS "portfolio public read" ON tradie_portfolio;
CREATE POLICY "portfolio public read" ON tradie_portfolio FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "portfolio modify own" ON tradie_portfolio;
CREATE POLICY "portfolio modify own" ON tradie_portfolio FOR ALL
  USING (EXISTS (SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid()));

-- CUSTOMERS
DROP POLICY IF EXISTS "customers read own" ON customers;
CREATE POLICY "customers read own" ON customers FOR SELECT
  USING (profile_id = auth.uid() OR is_admin());

-- JOBS
DROP POLICY IF EXISTS "jobs customer reads own" ON jobs;
CREATE POLICY "jobs customer reads own" ON jobs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM customers c WHERE c.id = customer_id AND c.profile_id = auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS "jobs tradie reads open" ON jobs;
CREATE POLICY "jobs tradie reads open" ON jobs FOR SELECT
  USING (
    status = 'open' AND EXISTS (
      SELECT 1 FROM tradies t WHERE t.profile_id = auth.uid() AND t.admin_verified = TRUE
    )
  );

DROP POLICY IF EXISTS "jobs tradie reads matched" ON jobs;
CREATE POLICY "jobs tradie reads matched" ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tradies t WHERE t.id = matched_tradie_id AND t.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "jobs customer creates" ON jobs;
CREATE POLICY "jobs customer creates" ON jobs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM customers c WHERE c.id = customer_id AND c.profile_id = auth.uid()));

DROP POLICY IF EXISTS "jobs customer updates own" ON jobs;
CREATE POLICY "jobs customer updates own" ON jobs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM customers c WHERE c.id = customer_id AND c.profile_id = auth.uid()));

-- SWIPES
DROP POLICY IF EXISTS "swipes read own" ON swipes;
CREATE POLICY "swipes read own" ON swipes FOR SELECT
  USING (
    (swiper_role = 'customer' AND EXISTS (
      SELECT 1 FROM jobs j JOIN customers c ON c.id = j.customer_id
      WHERE j.id = job_id AND c.profile_id = auth.uid()
    ))
    OR (swiper_role = 'tradie' AND EXISTS (
      SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid()
    ))
    OR is_admin()
  );

DROP POLICY IF EXISTS "swipes insert own" ON swipes;
CREATE POLICY "swipes insert own" ON swipes FOR INSERT WITH CHECK (
  (swiper_role = 'customer' AND EXISTS (
    SELECT 1 FROM jobs j JOIN customers c ON c.id = j.customer_id
    WHERE j.id = job_id AND c.profile_id = auth.uid()
  ))
  OR (swiper_role = 'tradie' AND EXISTS (
    SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid() AND t.admin_verified = TRUE
  ))
);

-- MATCHES
DROP POLICY IF EXISTS "matches read parties" ON matches;
CREATE POLICY "matches read parties" ON matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM customers c WHERE c.id = customer_id AND c.profile_id = auth.uid())
  OR EXISTS (SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid())
  OR is_admin()
);

-- CHAT_ROOMS
DROP POLICY IF EXISTS "chat_rooms read parties" ON chat_rooms;
CREATE POLICY "chat_rooms read parties" ON chat_rooms FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches m
    LEFT JOIN customers c ON c.id = m.customer_id
    LEFT JOIN tradies t ON t.id = m.tradie_id
    WHERE m.id = match_id
      AND (c.profile_id = auth.uid() OR t.profile_id = auth.uid())
  )
  OR is_admin()
);

-- CHAT_MESSAGES
DROP POLICY IF EXISTS "chat_messages read parties" ON chat_messages;
CREATE POLICY "chat_messages read parties" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_rooms cr
    JOIN matches m ON m.id = cr.match_id
    LEFT JOIN customers c ON c.id = m.customer_id
    LEFT JOIN tradies t ON t.id = m.tradie_id
    WHERE cr.id = chat_room_id
      AND (c.profile_id = auth.uid() OR t.profile_id = auth.uid())
  )
  OR is_admin()
);

DROP POLICY IF EXISTS "chat_messages insert parties" ON chat_messages;
CREATE POLICY "chat_messages insert parties" ON chat_messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (
    SELECT 1 FROM chat_rooms cr
    JOIN matches m ON m.id = cr.match_id
    LEFT JOIN customers c ON c.id = m.customer_id
    LEFT JOIN tradies t ON t.id = m.tradie_id
    WHERE cr.id = chat_room_id
      AND (c.profile_id = auth.uid() OR t.profile_id = auth.uid())
  )
);

-- QUOTES
DROP POLICY IF EXISTS "quotes read parties" ON quotes;
CREATE POLICY "quotes read parties" ON quotes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches m
    LEFT JOIN customers c ON c.id = m.customer_id
    LEFT JOIN tradies t ON t.id = m.tradie_id
    WHERE m.id = match_id
      AND (c.profile_id = auth.uid() OR t.profile_id = auth.uid())
  )
  OR is_admin()
);

DROP POLICY IF EXISTS "quotes insert tradie" ON quotes;
CREATE POLICY "quotes insert tradie" ON quotes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM tradies t WHERE t.id = tradie_id AND t.profile_id = auth.uid())
);

-- REVIEWS
DROP POLICY IF EXISTS "reviews public read" ON reviews;
CREATE POLICY "reviews public read" ON reviews FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "reviews insert own" ON reviews;
CREATE POLICY "reviews insert own" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- SUBSCRIPTION_EVENTS / ADMIN_ACTIONS — admin only
DROP POLICY IF EXISTS "sub_events admin only" ON subscription_events;
CREATE POLICY "sub_events admin only" ON subscription_events FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "admin_actions admin only" ON admin_actions;
CREATE POLICY "admin_actions admin only" ON admin_actions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ANALYTICS_EVENTS — service-role only (no client policy)

-- =============================================================================
-- DONE
-- =============================================================================
