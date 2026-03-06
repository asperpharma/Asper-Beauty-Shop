-- Asper Beauty Shop: Master Deployment Dashboard
-- Tables and views for health checks + launch checklist tracking

-- 1. DEPLOYMENT HEALTH CHECKS (CI/Git/NPM signals)
create table public.deployment_health_checks (
  id uuid default uuid_generate_v4() primary key,
  branch text not null,
  check_type text not null, -- lint, test, build, git_branch, git_clean, supabase_bulk, supabase_audit
  status text not null check (status in ('pass', 'fail')),
  details jsonb default '{}',
  source text default 'webhook', -- webhook, script, manual
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_deployment_health_branch on public.deployment_health_checks (branch);
create index idx_deployment_health_created on public.deployment_health_checks (created_at desc);
create index idx_deployment_health_type on public.deployment_health_checks (check_type);

-- 2. CHECKLIST ITEMS (Master Launch Checklist definitions)
create table public.checklist_items (
  id uuid default uuid_generate_v4() primary key,
  category text not null, -- payment, shipping, theme, domain, catalog
  name text not null,
  description text,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CHECKLIST PROGRESS (per-item status)
create table public.checklist_progress (
  id uuid default uuid_generate_v4() primary key,
  checklist_item_id uuid references public.checklist_items(id) on delete cascade not null,
  status text not null check (status in ('pending', 'complete', 'failed')),
  notes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(checklist_item_id)
);

create index idx_checklist_progress_item on public.checklist_progress (checklist_item_id);

-- 4. SEED CHECKLIST ITEMS (Payment, Shipping, Theme from Operational Plan)
insert into public.checklist_items (category, name, description, sort_order) values
  ('payment', 'COD Enabled', 'Cash on Delivery (Verified by Asper) active', 1),
  ('payment', 'Payment Methods', 'Shopify manual payment configured', 2),
  ('shipping', 'Amman Zone', '3.00 JOD standard / Free > 50 JOD', 3),
  ('shipping', 'Governorates Zone', '3.00 JOD standard / Free > 50 JOD', 4),
  ('shipping', 'Cart Free Shipping Logic', 'Add X JOD for Free Shipping sync', 5),
  ('theme', 'Soft Ivory Background', '#F8F8FF applied globally', 6),
  ('theme', 'Gold Stitch Hover', '1px Shiny Gold border on product cards', 7),
  ('theme', 'Maroon Actions', 'Primary buttons use #800020', 8),
  ('domain', 'SSL Active', 'https padlock on asperbeauty.com', 9),
  ('domain', 'DNS Resolved', 'Domain points to Vercel/Lovable', 10),
  ('catalog', 'Product Import', '5,000 SKUs imported with tags', 11);

-- 5. RLS
alter table public.deployment_health_checks enable row level security;
alter table public.checklist_items enable row level security;
alter table public.checklist_progress enable row level security;

-- Service role + anon can read (dashboard is read-heavy)
create policy "Allow read deployment_health_checks" on public.deployment_health_checks for select using (true);
create policy "Allow read checklist_items" on public.checklist_items for select using (true);
create policy "Allow read checklist_progress" on public.checklist_progress for select using (true);

-- Insert via Edge Function (service role) or authenticated
create policy "Allow insert deployment_health_checks" on public.deployment_health_checks for insert with check (true);
create policy "Allow update checklist_progress" on public.checklist_progress for update using (true);
create policy "Allow insert checklist_progress" on public.checklist_progress for insert with check (true);

-- 6. REALTIME: Enable in Supabase Dashboard (Table Editor > deployment_health_checks > Enable Realtime)
-- Same for checklist_progress if you want live UI updates.

-- 7. VIEWS for Master Deployment Dashboard

-- Last status per branch per check_type
create or replace view public.v_deployment_health_last as
  select distinct on (branch, check_type)
    id, branch, check_type, status, details, created_at
  from public.deployment_health_checks
  order by branch, check_type, created_at desc;

-- Failing checks (for alerts)
create or replace view public.v_deployment_failing_checks as
  select branch, check_type, status, details, created_at
  from public.v_deployment_health_last
  where status = 'fail';

-- Checklist completion by category
create or replace view public.v_checklist_completion as
  select
    c.category,
    count(*) as total,
    count(p.id) filter (where p.status = 'complete') as completed,
    round(100.0 * count(p.id) filter (where p.status = 'complete') / nullif(count(*), 0), 1) as pct_complete
  from public.checklist_items c
  left join public.checklist_progress p on p.checklist_item_id = c.id
  group by c.category;

-- Overall checklist % for Launch Checklist Technical View
create or replace view public.v_checklist_overall as
  select
    count(*) as total_items,
    count(p.id) filter (where p.status = 'complete') as completed_items,
    round(100.0 * count(p.id) filter (where p.status = 'complete') / nullif(count(*), 0), 1) as completion_pct
  from public.checklist_items c
  left join public.checklist_progress p on p.checklist_item_id = c.id and p.status = 'complete';

-- Master Dashboard summary (counts, last run)
create or replace view public.v_master_dashboard as
  select
    (select count(*) from public.deployment_health_checks where created_at > now() - interval '24 hours') as health_checks_24h,
    (select count(*) from public.v_deployment_failing_checks) as failing_checks_count,
    (select completion_pct from public.v_checklist_overall) as checklist_pct,
    (select max(created_at) from public.deployment_health_checks) as last_health_check_at;
