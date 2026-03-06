-- Deployment health checks and launch checklist progress (for dashboard / CI ingest).
-- Writes via Edge Function health-checks-ingest (service role). Read by dashboard (admin or service).

CREATE TABLE IF NOT EXISTS public.deployment_health_checks (
  id bigserial PRIMARY KEY,
  reported_at timestamptz NOT NULL DEFAULT now(),
  branch text NOT NULL,
  job_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'failure', 'cancelled', 'running')),
  run_id text NULL,
  run_url text NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT payload_is_object CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_deployment_health_checks_reported ON public.deployment_health_checks (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployment_health_checks_branch_job ON public.deployment_health_checks (branch, job_name);

COMMENT ON TABLE public.deployment_health_checks IS 'CI/Git/NPM health check results; ingested via health-checks-ingest Edge Function.';

CREATE TABLE IF NOT EXISTS public.checklist_items (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  required boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.checklist_progress (
  id bigserial PRIMARY KEY,
  reported_at timestamptz NOT NULL DEFAULT now(),
  checklist_slug text NOT NULL,
  branch_or_context text NULL,
  completed boolean NOT NULL DEFAULT true,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT progress_payload_object CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_reported ON public.checklist_progress (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_slug ON public.checklist_progress (checklist_slug);

ALTER TABLE public.deployment_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.deployment_health_checks FROM anon, authenticated;
REVOKE ALL ON TABLE public.checklist_items FROM anon, authenticated;
REVOKE ALL ON TABLE public.checklist_progress FROM anon, authenticated;

GRANT SELECT, INSERT ON TABLE public.deployment_health_checks TO service_role;
GRANT SELECT ON TABLE public.checklist_items TO service_role;
GRANT SELECT, INSERT ON TABLE public.checklist_progress TO service_role;

-- Optional: allow authenticated admins to read for dashboard UI
CREATE POLICY "Admins can read deployment_health_checks"
ON public.deployment_health_checks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read checklist_items"
ON public.checklist_items FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read checklist_progress"
ON public.checklist_progress FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed launch checklist items (Payment, Shipping, Theme)
INSERT INTO public.checklist_items (slug, name, category, required, sort_order)
VALUES
  ('payment', 'Payment validation', 'payment', true, 10),
  ('shipping', 'Shipping validation', 'shipping', true, 20),
  ('theme', 'Theme validation', 'theme', true, 30),
  ('git-health', 'Git / branch health', 'ci', true, 40),
  ('npm-health', 'NPM / build health', 'ci', true, 50)
ON CONFLICT (slug) DO NOTHING;
