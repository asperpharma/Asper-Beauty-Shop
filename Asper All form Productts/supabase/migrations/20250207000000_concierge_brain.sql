-- Asper Beauty Shop: Digital Concierge Brain
-- Run this in Supabase SQL Editor to initialize the Concierge and 3-Click Solution.
-- Shopify holds the Catalog (5,000 items). Supabase holds the User Context.

-- Enable UUID extension for secure IDs
create extension if not exists "uuid-ossp";

-- 1. PROFILES: Extends the user data beyond basic auth
-- Stores the "Clinical Profile" for the 3-Click Solution
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  skin_type text check (skin_type in ('Dry', 'Oily', 'Combination', 'Sensitive', 'Normal')),
  primary_concern text check (primary_concern in ('Acne & Blemishes', 'Anti-Aging & Wrinkles', 'Dryness & Hydration', 'Sensitivity & Redness')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CONSULTATIONS: Stores the history of AI Concierge interactions
-- Allows the AI to reference past advice ("As we discussed last time...")
create table public.consultations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  transcript jsonb, -- Stores the chat history with the "Pharmacist Logic" persona
  recommended_skus text[], -- Array of Shopify Product IDs recommended
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WISHLIST: Custom wishlist functionality (often strictly limited in Shopify Basic)
create table public.wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  shopify_product_handle text not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, shopify_product_handle)
);

-- 4. ROW LEVEL SECURITY (RLS): "Clinical Privacy"
-- Ensure users can only see their own medical/skin data.
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

alter table public.consultations enable row level security;
create policy "Users can view own consultations" on public.consultations for select using (auth.uid() = user_id);
create policy "Users can insert own consultations" on public.consultations for insert with check (auth.uid() = user_id);

alter table public.wishlist_items enable row level security;
create policy "Users can view own wishlist" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on public.wishlist_items for delete using (auth.uid() = user_id);
