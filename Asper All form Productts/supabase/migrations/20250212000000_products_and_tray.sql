-- Asper Beauty Shop: Products table + get_products_by_concern + get_tray_by_concern
-- Populated via Matrixify/Shopify sync. Bridge logic for Digital Tray.

create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  handle text not null unique,
  title text not null,
  brand text,
  price decimal(10, 2) default 0,
  image_url text,
  tags text[] not null default '{}',
  inventory_total int not null default 0,
  bestseller_rank int,
  hero boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index idx_products_tags on public.products using gin (tags);
create index idx_products_inventory on public.products (inventory_total) where inventory_total > 0;

alter table public.products enable row level security;

create policy "Products are publicly readable"
  on public.products for select
  using (true);

comment on table public.products is 'Product catalog synced from Shopify/Matrixify. Tags: Concern_*, Step_*';

-- One product per step. Tie-breaker: Hero > bestseller_rank DESC > created_at DESC > handle ASC.
create or replace function public.get_products_by_concern(p_concern_tag text)
returns table (
  step_tag text,
  handle text,
  title text,
  brand text,
  price decimal,
  image_url text,
  inventory_total int
)
language sql
stable
security definer
as $$
  with steps as (
    select unnest(array['Step_1_Cleanser', 'Step_2_Treatment', 'Step_3_Protection']) as st
  ),
  candidates as (
    select
      st.st as step_tag,
      p.handle, p.title, p.brand, p.price, p.image_url, p.inventory_total,
      p.created_at,
      (case when p.hero then 1 else 0 end) as hero_ord,
      coalesce(p.bestseller_rank, 0) as rank_val
    from public.products p
    cross join steps st
    where p_concern_tag = any(p.tags)
      and st.st = any(p.tags)
      and p.inventory_total > 0
  ),
  ranked as (
    select *,
      row_number() over (
        partition by step_tag
        order by hero_ord desc, rank_val desc, created_at desc, handle asc
      ) as rn
    from candidates
  )
  select step_tag, handle, title, brand, price, image_url, inventory_total
  from ranked
  where rn = 1
  order by (case step_tag when 'Step_1_Cleanser' then 1 when 'Step_2_Treatment' then 2 when 'Step_3_Protection' then 3 else 4 end);
$$;

-- JSON tray with nulls for missing steps. UI renders "Consult Pharmacist" for null slots.
create or replace function public.get_tray_by_concern(concern_tag text)
returns jsonb
language plpgsql
stable
security definer
as $$
declare
  step_1 jsonb;
  step_2 jsonb;
  step_3 jsonb;
  out jsonb;
begin
  select jsonb_build_object('step_tag', step_tag, 'handle', handle, 'title', title, 'brand', brand, 'price', price, 'image_url', image_url, 'inventory_total', inventory_total)
  into step_1 from public.get_products_by_concern(concern_tag) where step_tag = 'Step_1_Cleanser' limit 1;

  select jsonb_build_object('step_tag', step_tag, 'handle', handle, 'title', title, 'brand', brand, 'price', price, 'image_url', image_url, 'inventory_total', inventory_total)
  into step_2 from public.get_products_by_concern(concern_tag) where step_tag = 'Step_2_Treatment' limit 1;

  select jsonb_build_object('step_tag', step_tag, 'handle', handle, 'title', title, 'brand', brand, 'price', price, 'image_url', image_url, 'inventory_total', inventory_total)
  into step_3 from public.get_products_by_concern(concern_tag) where step_tag = 'Step_3_Protection' limit 1;

  out := jsonb_build_object(
    'concern_tag', concern_tag,
    'step_1', coalesce(step_1, 'null'::jsonb),
    'step_2', coalesce(step_2, 'null'::jsonb),
    'step_3', coalesce(step_3, 'null'::jsonb)
  );
  return out;
end;
$$;
