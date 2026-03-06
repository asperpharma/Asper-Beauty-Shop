-- Asper Beauty Shop: Set search_path on SECURITY DEFINER functions
-- Ensures consistent behavior and prevents search_path injection.
-- See: docs/SUPABASE-VALIDATION.md

-- get_products_by_concern: SQL SECURITY DEFINER. References public.products only.
alter function public.get_products_by_concern(text) set search_path = public;

-- get_tray_by_concern: PL/pgSQL SECURITY DEFINER. Calls public.get_products_by_concern.
alter function public.get_tray_by_concern(text) set search_path = public;

comment on function public.get_products_by_concern(text) is
  'Returns one product per step (Cleanser, Treatment, Protection) for a concern tag. SECURITY DEFINER to allow read when caller lacks direct table rights. search_path=public to prevent search_path injection.';

comment on function public.get_tray_by_concern(text) is
  'Returns JSON tray (step_1, step_2, step_3) for a concern. SECURITY DEFINER. search_path=public.';
