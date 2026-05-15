-- =============================================================================
-- 0003 — Fix auth user-creation trigger
-- =============================================================================
-- The trigger in 0001 was missing two things needed for Supabase auth to call it:
--   1. SET search_path = public  (so it resolves public.profiles unqualified)
--   2. Explicit GRANTs to supabase_auth_admin (the role that runs auth.users INSERT)
-- Without these, every signup fails with "Database error saving new user".
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value public.user_role;
BEGIN
  user_role_value := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'customer'
  );

  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    user_role_value,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  IF user_role_value = 'customer' THEN
    INSERT INTO public.customers (profile_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'handle_new_user failed: %', SQLERRM;
END;
$$;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT INSERT ON TABLE public.profiles TO supabase_auth_admin;
GRANT INSERT ON TABLE public.customers TO supabase_auth_admin;
GRANT SELECT ON TABLE public.profiles TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
