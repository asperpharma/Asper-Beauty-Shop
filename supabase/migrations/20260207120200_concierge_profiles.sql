-- Concierge profiles for delivery/concierge staff (e.g. Amman Concierge).
CREATE TABLE IF NOT EXISTS public.concierge_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  phone text NULL,
  email text NULL,
  region text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_concierge_profiles_user_id ON public.concierge_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_concierge_profiles_active ON public.concierge_profiles (is_active) WHERE is_active = true;

COMMENT ON TABLE public.concierge_profiles IS 'Concierge/delivery staff profiles for Amman Concierge Delivery.';

ALTER TABLE public.concierge_profiles ENABLE ROW LEVEL SECURITY;

-- Concierge can read own profile (when user_id = auth.uid())
CREATE POLICY "Concierge can view own profile"
ON public.concierge_profiles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins can manage concierge_profiles"
ON public.concierge_profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Service role for backend/Edge Functions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.concierge_profiles TO service_role;

-- Optional: updated_at trigger
CREATE OR REPLACE FUNCTION public.set_concierge_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS concierge_profiles_updated_at ON public.concierge_profiles;
CREATE TRIGGER concierge_profiles_updated_at
  BEFORE UPDATE ON public.concierge_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_concierge_profiles_updated_at();
