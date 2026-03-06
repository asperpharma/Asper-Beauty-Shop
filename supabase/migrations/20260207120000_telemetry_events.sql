-- Telemetry events: server-side only. No RLS policies for anon/authenticated.
-- Insert via Edge Function (log-telemetry) using Service Role.

CREATE TABLE IF NOT EXISTS public.telemetry_events (
  id bigserial PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL,
  event text NOT NULL,
  user_id uuid NULL,
  correlation_id uuid NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT payload_is_object CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_telemetry_events_time ON public.telemetry_events (occurred_at);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_source_event ON public.telemetry_events (source, event);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_correlation ON public.telemetry_events (correlation_id) WHERE correlation_id IS NOT NULL;

COMMENT ON TABLE public.telemetry_events IS 'Telemetry from quiz, API, sync. Writes only via Edge Function with Service Role.';

ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.telemetry_events FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.telemetry_events TO service_role;
