-- Asper Beauty Shop: Chat Logs — Persistent Memory for Beauty Assistant
-- Stores conversation history for the "Digital Log" and context continuity.

create table public.chat_logs (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now() not null
);

create index idx_chat_logs_session_id on public.chat_logs (session_id);
create index idx_chat_logs_created_at on public.chat_logs (created_at desc);

-- RLS: Service role (Edge Function) inserts; allow authenticated read for own session if needed later.
alter table public.chat_logs enable row level security;

create policy "Service role can insert chat_logs"
  on public.chat_logs for insert
  with check (true);

create policy "Service role can read chat_logs"
  on public.chat_logs for select
  using (auth.role() = 'service_role');

comment on table public.chat_logs is 'Persistent Memory: Beauty Assistant conversation history for Digital Log';
