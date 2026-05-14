-- =============================================================================
-- 0002 — Matching engine
-- =============================================================================
-- Atomic swipe + mutual check + match creation, all in a single DB function.
-- The PostgREST client calls this via supabase.rpc('swipe_and_match', ...).
-- =============================================================================

CREATE OR REPLACE FUNCTION swipe_and_match(
  p_job_id UUID,
  p_tradie_id UUID,
  p_swiper_role swipe_role,
  p_direction swipe_direction
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job RECORD;
  v_tradie RECORD;
  v_match_id UUID;
  v_room_id UUID;
  v_other_swiped BOOLEAN;
BEGIN
  -- 1. Validate the job exists + is open
  SELECT id, customer_id, status, trade_category
    INTO v_job FROM jobs WHERE id = p_job_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Job not found');
  END IF;
  IF v_job.status <> 'open' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Job is no longer open');
  END IF;

  -- 2. Validate the tradie exists + is verified
  SELECT id, profile_id, admin_verified, available, subscription_status,
         matches_quota_monthly, matches_used_this_period, trade_categories
    INTO v_tradie FROM tradies WHERE id = p_tradie_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tradie not found');
  END IF;
  IF NOT v_tradie.admin_verified THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tradie not verified');
  END IF;

  -- 3. Quota gate (only when the swiper IS the tradie and direction is right)
  IF p_swiper_role = 'tradie' AND p_direction = 'right' THEN
    IF v_tradie.subscription_status NOT IN ('active', 'trialing') THEN
      RETURN jsonb_build_object(
        'ok', false, 'error', 'Active subscription required',
        'code', 'NO_SUBSCRIPTION'
      );
    END IF;
    IF v_tradie.matches_used_this_period >= v_tradie.matches_quota_monthly THEN
      RETURN jsonb_build_object(
        'ok', false, 'error', 'Match quota exceeded for this period',
        'code', 'QUOTA_EXCEEDED'
      );
    END IF;
  END IF;

  -- 4. Idempotent swipe insert (do nothing on conflict).
  INSERT INTO swipes (job_id, tradie_id, swiper_role, direction)
  VALUES (p_job_id, p_tradie_id, p_swiper_role, p_direction)
  ON CONFLICT (job_id, tradie_id, swiper_role) DO NOTHING;

  -- 5. Only check for mutual when this swipe is a right-swipe
  IF p_direction <> 'right' THEN
    RETURN jsonb_build_object('ok', true, 'matched', false);
  END IF;

  -- 6. Did the OTHER side already right-swipe?
  SELECT EXISTS (
    SELECT 1 FROM swipes
    WHERE job_id = p_job_id
      AND tradie_id = p_tradie_id
      AND swiper_role <> p_swiper_role
      AND direction = 'right'
  ) INTO v_other_swiped;

  IF NOT v_other_swiped THEN
    RETURN jsonb_build_object('ok', true, 'matched', false);
  END IF;

  -- 7. Match! Create transactionally (function is atomic).
  -- Belt and braces: re-check job is still open with a row lock.
  PERFORM 1 FROM jobs WHERE id = p_job_id AND status = 'open' FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', true, 'matched', false, 'error', 'Job snapped up');
  END IF;

  INSERT INTO matches (job_id, tradie_id, customer_id)
  VALUES (p_job_id, p_tradie_id, v_job.customer_id)
  RETURNING id INTO v_match_id;

  UPDATE jobs
    SET status = 'matched', matched_tradie_id = p_tradie_id
    WHERE id = p_job_id;

  INSERT INTO chat_rooms (match_id) VALUES (v_match_id) RETURNING id INTO v_room_id;

  UPDATE matches SET chat_room_id = v_room_id WHERE id = v_match_id;

  -- Increment tradie quota (only if the match counts against them, which is always).
  UPDATE tradies
    SET matches_used_this_period = matches_used_this_period + 1
    WHERE id = p_tradie_id;

  RETURN jsonb_build_object(
    'ok', true,
    'matched', true,
    'match_id', v_match_id,
    'chat_room_id', v_room_id
  );
END;
$$;

-- =============================================================================
-- expire_matches() — cron-driven helper.
-- Returns the count of expired matches.
-- =============================================================================
CREATE OR REPLACE FUNCTION expire_matches()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  WITH expired AS (
    UPDATE matches
       SET status = 'expired'
     WHERE status = 'active'
       AND exclusive_until < NOW()
       AND NOT EXISTS (
         -- Don't expire if any chat activity happened (engagement)
         SELECT 1 FROM chat_messages cm
         WHERE cm.chat_room_id = matches.chat_room_id
       )
    RETURNING job_id
  )
  UPDATE jobs SET status = 'open', matched_tradie_id = NULL
    WHERE id IN (SELECT job_id FROM expired)
      AND status = 'matched';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- =============================================================================
-- Bump last_message_at on chat_rooms when a message lands
-- =============================================================================
CREATE OR REPLACE FUNCTION bump_chat_room()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chat_rooms
    SET last_message_at = NEW.created_at
    WHERE id = NEW.chat_room_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_chat_room ON chat_messages;
CREATE TRIGGER trg_bump_chat_room
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION bump_chat_room();
