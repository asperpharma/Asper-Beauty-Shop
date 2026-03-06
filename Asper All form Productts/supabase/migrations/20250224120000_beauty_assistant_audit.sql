-- Asper Beauty Shop: Beauty Assistant Audit Table
-- Logs persona routing and responses for compliance and Director tuning.

create table public.beauty_assistant_audit (
  id uuid default gen_random_uuid() primary key,
  route text check (route in ('gorgias', 'manychat', 'direct')),
  external_user_id text,
  user_message_hash text,
  user_message_length int,
  persona_routed text not null check (persona_routed in ('sami', 'zain', 'auto')),
  response_preview text,
  response_length int,
  created_at timestamptz default now() not null
);

create index idx_beauty_assistant_audit_created_at
  on public.beauty_assistant_audit (created_at desc);

create index idx_beauty_assistant_audit_persona
  on public.beauty_assistant_audit (persona_routed);

create index idx_beauty_assistant_audit_route
  on public.beauty_assistant_audit (route);

-- RLS: Audit is append-only; only service_role inserts. No select for anon.
alter table public.beauty_assistant_audit enable row level security;

create policy "Service role can insert audit"
  on public.beauty_assistant_audit for insert
  with check (true);

-- Read: service_role only (dashboard/backoffice)
create policy "Service role can read audit"
  on public.beauty_assistant_audit for select
  using (auth.role() = 'service_role');

comment on table public.beauty_assistant_audit is 'Logs Beauty Assistant persona routing and responses for compliance';
