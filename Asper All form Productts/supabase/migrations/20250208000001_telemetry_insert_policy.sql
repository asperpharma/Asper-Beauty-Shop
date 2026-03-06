-- Asper Beauty Shop: Narrow INSERT policy for telemetry (event whitelist)
-- Replaces permissive insert; only allowed event_type values from frontend/sync.

-- Drop the permissive insert policies
drop policy if exists "Service and auth can insert telemetry" on public.as_telemetry;
drop policy if exists "Service and auth can insert concierge events" on public.as_concierge_events;

-- Whitelist: only these event_type values accepted from client inserts
-- (Service role / Edge Functions bypass RLS)

-- as_telemetry: api_latency, quiz_step, quiz_completion, shopify_sync
create policy "Client can insert whitelisted telemetry" on public.as_telemetry
  for insert
  with check (
    event_type in ('api_latency', 'quiz_step', 'quiz_completion', 'shopify_sync')
  );

-- as_concierge_events: intent_detected, routine_recommended, authenticity_triggered
create policy "Client can insert whitelisted concierge events" on public.as_concierge_events
  for insert
  with check (
    event_type in ('intent_detected', 'routine_recommended', 'authenticity_triggered')
  );
