-- Asper Beauty Shop: Concierge Brain — Medical File (Skin Profile)
-- Stores the customer's skin concern and prescribed routine from the 3-Click flow.

create table public.concierge_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  skin_concern text not null check (skin_concern in (
    'Acne & Blemishes',
    'Anti-Aging & Wrinkles',
    'Dryness & Hydration',
    'Sensitivity & Redness'
  )),
  recommended_routine jsonb not null default '[]', -- [{ step, product_handle, why }, ...]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

create index idx_concierge_profiles_user_id on public.concierge_profiles (user_id);
create index idx_concierge_profiles_skin_concern on public.concierge_profiles (skin_concern);

-- RLS: Clinical Privacy — users see only their own medical file
alter table public.concierge_profiles enable row level security;

create policy "Users can view own concierge profile"
  on public.concierge_profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own concierge profile"
  on public.concierge_profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own concierge profile"
  on public.concierge_profiles for insert
  with check (auth.uid() = user_id);

-- Note: Edge Functions use service_role and bypass RLS for upserts.

comment on table public.concierge_profiles is 'Medical File: Skin concern and prescribed routine from 3-Click flow';
