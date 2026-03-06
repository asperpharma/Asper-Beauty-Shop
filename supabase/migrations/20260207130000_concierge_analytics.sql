-- Concierge / skin concern analytics: weekly summary table + aggregation.
-- Raw events go to telemetry_events (source='concierge', event='skin_concern_click').
-- This migration adds a weekly summary table and a function to aggregate (run via pg_cron or scheduled Edge Function).

-- Weekly counts per skin concern (Top Skin Concern metric)
CREATE TABLE IF NOT EXISTS public.analytics_skin_concern_weekly (
  id bigserial PRIMARY KEY,
  week_start date NOT NULL,
  concern_id text NOT NULL,
  click_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (week_start, concern_id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_skin_concern_weekly_week ON public.analytics_skin_concern_weekly (week_start DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_skin_concern_weekly_concern ON public.analytics_skin_concern_weekly (concern_id);

COMMENT ON TABLE public.analytics_skin_concern_weekly IS 'Weekly aggregated skin concern click counts; populated by aggregate_skin_concern_weekly().';

ALTER TABLE public.analytics_skin_concern_weekly ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.analytics_skin_concern_weekly FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.analytics_skin_concern_weekly TO service_role;

-- Allow admins to read for dashboard
CREATE POLICY "Admins can read analytics_skin_concern_weekly"
ON public.analytics_skin_concern_weekly FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Aggregation function: reads telemetry_events (source='concierge', event='skin_concern_click'),
-- groups by week and concern_id, upserts into analytics_skin_concern_weekly.
-- Call weekly via pg_cron or from a scheduled Edge Function.
CREATE OR REPLACE FUNCTION public.aggregate_skin_concern_weekly(p_weeks_back int DEFAULT 2)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start date;
  v_concern_id text;
  v_cnt bigint;
BEGIN
  FOR v_week_start, v_concern_id, v_cnt IN
    SELECT
      date_trunc('week', occurred_at)::date AS week_start,
      payload->>'concern_id' AS concern_id,
      count(*)::bigint
    FROM public.telemetry_events
    WHERE source = 'concierge'
      AND event = 'skin_concern_click'
      AND occurred_at >= date_trunc('week', now()) - (p_weeks_back || ' weeks')::interval
      AND payload->>'concern_id' IS NOT NULL
      AND payload->>'concern_id' <> ''
    GROUP BY date_trunc('week', occurred_at)::date, payload->>'concern_id'
  LOOP
    INSERT INTO public.analytics_skin_concern_weekly (week_start, concern_id, click_count, updated_at)
    VALUES (v_week_start, v_concern_id, v_cnt, now())
    ON CONFLICT (week_start, concern_id)
    DO UPDATE SET click_count = EXCLUDED.click_count, updated_at = now();
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.aggregate_skin_concern_weekly(int) IS 'Aggregate concierge skin_concern_click events into analytics_skin_concern_weekly. Schedule weekly (e.g. pg_cron: select cron.schedule(''agg-skin-concern'', ''0 2 * * 0'', ''select public.aggregate_skin_concern_weekly(2)''));';

-- Trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_analytics_skin_concern_weekly_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS analytics_skin_concern_weekly_updated_at ON public.analytics_skin_concern_weekly;
CREATE TRIGGER analytics_skin_concern_weekly_updated_at
  BEFORE UPDATE ON public.analytics_skin_concern_weekly
  FOR EACH ROW EXECUTE FUNCTION public.set_analytics_skin_concern_weekly_updated_at();
