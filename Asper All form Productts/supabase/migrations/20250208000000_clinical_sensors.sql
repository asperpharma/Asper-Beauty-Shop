-- Asper Beauty Shop: Clinical Sensor Tables
-- Automated telemetry for the 24-Hour Clinical Audit.
-- Captures latency, concierge interactions, and system health.

-- 1. TELEMETRY: Latency, API response times, quiz/completion events
create table public.as_telemetry (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null, -- e.g. 'api_latency', 'quiz_step', 'concierge_intent', 'shopify_sync'
  metric_name text,         -- e.g. 'shopify_storefront_ms', 'quiz_completion', 'intent_acne'
  value_numeric numeric,    -- for latency (ms), counts, etc.
  value_text text,          -- for labels, handles, etc.
  metadata jsonb default '{}', -- flexible payload
  source text,              -- e.g. 'quiz', 'shopify_sync', 'concierge', 'api'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast 24h window queries
create index idx_as_telemetry_created_at on public.as_telemetry (created_at desc);
create index idx_as_telemetry_event_type on public.as_telemetry (event_type);

-- 2. CONCIERGE EVENTS: Lightweight intent/flow tracking (complements consultations)
create table public.as_concierge_events (
  id uuid default uuid_generate_v4() primary key,
  event_type text not null, -- e.g. 'intent_detected', 'routine_recommended', 'authenticity_triggered'
  intent text,              -- e.g. 'acne', 'anti_aging', 'hydration', 'sensitivity'
  recommended_handles text[],
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_as_concierge_events_created_at on public.as_concierge_events (created_at desc);
create index idx_as_concierge_events_intent on public.as_concierge_events (intent);

-- 3. RLS: Telemetry is write-only from app; read by Edge Function (service role)
-- Allow anonymous/service inserts for telemetry from frontend/sync scripts
alter table public.as_telemetry enable row level security;
alter table public.as_concierge_events enable row level security;

-- Allow inserts from authenticated users and service role (Edge Functions use service role)
create policy "Service and auth can insert telemetry" on public.as_telemetry
  for insert with check (true);

create policy "Service can read telemetry" on public.as_telemetry
  for select using (true); -- Edge Function uses service role; restrict via function if needed

create policy "Service and auth can insert concierge events" on public.as_concierge_events
  for insert with check (true);

create policy "Service can read concierge events" on public.as_concierge_events
  for select using (true);

-- Comment for documentation
comment on table public.as_telemetry is 'Clinical Sensor: API latency, quiz steps, sync events for 24h audit';
comment on table public.as_concierge_events is 'Clinical Sensor: Concierge intent and recommendation events';
