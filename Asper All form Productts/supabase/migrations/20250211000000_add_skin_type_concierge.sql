-- Asper Beauty Shop: Add skin_type to concierge_profiles
-- Supports Gorgias/ManyChat payload (e.g. Oily, Dry, Sensitive)

alter table public.concierge_profiles
  add column if not exists skin_type text
  check (skin_type in ('Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'));

comment on column public.concierge_profiles.skin_type is 'Skin type from 3-Click quiz (e.g. Oily, Dry)';

create index if not exists idx_concierge_profiles_skin_type
  on public.concierge_profiles (skin_type);
