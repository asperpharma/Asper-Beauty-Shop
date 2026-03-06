# RLS baseline (Supabase)

Summary of Row Level Security for Asper-Beauty-Shop. Policies live in
`supabase/migrations/`; this doc is a reference only.

## Overview

| Table / area                 | anon             | authenticated                                          | service_role                   | Notes                                               |
| ---------------------------- | ---------------- | ------------------------------------------------------ | ------------------------------ | --------------------------------------------------- |
| **products**                 | SELECT (catalog) | SELECT; admin: INSERT/UPDATE/DELETE                    | full                           | Public read; writes via `has_role(uid, 'admin')`.   |
| **cod_orders**               | no access        | admin: SELECT/UPDATE/DELETE; driver: SELECT/UPDATE own | INSERT only (create-cod-order) | Orders created only via Edge Function.              |
| **profiles**                 | no access        | own: SELECT/INSERT/UPDATE; admin: SELECT/UPDATE        | full                           | Explicit deny for anon.                             |
| **user_roles**               | no access        | own: SELECT; admin: ALL                                | full                           | Role checks use `public.has_role()`.                |
| **storage** (product-images) | SELECT           | admin: INSERT (upload)                                 | ALL                            | Public read; uploads restricted to admin.           |
| **telemetry_events**         | no access        | no access                                              | SELECT, INSERT                 | Writes only via Edge Function (e.g. log-telemetry). |

## Products

- **SELECT:** `USING (true)` — public catalog.
- **INSERT/UPDATE/DELETE:** `public.has_role(auth.uid(), 'admin')` — staff only.
- Migrations: `20260117084922`, `20260118142850`.

## Orders (cod_orders)

- **anon:** Explicit deny (SELECT/INSERT/UPDATE/DELETE).
- **INSERT:** Policy with `WITH CHECK (false)` so only service role (bypasses
  RLS) can insert; used by `create-cod-order` Edge Function.
- **SELECT/UPDATE/DELETE:** Admins via `has_role(..., 'admin')`; drivers can
  SELECT/UPDATE rows where `driver_id = auth.uid()`.
- Migrations: `20260116215547`, `20260117065326`, `20260117092556`,
  `20260118142850`, `20260118222323`, `20260119185400`.

## Storage (product-images bucket)

- **SELECT:** `bucket_id = 'product-images'` — public read.
- **INSERT:** Admin only,
  `bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::app_role)`.
- **Service role:** Full access on that bucket.
- Migrations: `20260110023044`, `20260117065326`.

## Telemetry (telemetry_events)

- RLS enabled; no policies for `anon` or `authenticated`.
- `REVOKE` from anon/authenticated; `GRANT` to service_role.
- Writes only via Edge Function (e.g. `log-telemetry`) with Service Role.
- Migration: `20260207120000_telemetry_events.sql`.

## Role helper

- `public.has_role(_user_id uuid, _role app_role)` — used by RLS policies.
- Roles in `public.user_roles`; enum `app_role` includes `admin`, `user`,
  `driver` (see migrations).

## Tying to docs/checklists

- **Staff (admin/driver):** RLS enforces `has_role()`; ensure users have correct
  rows in `user_roles` (see `docs/KEY_ROTATION_CHECKLIST.md`, onboarding).
- **Order owner:** No direct client read on `cod_orders`; status via
  `get-order-status` Edge Function (e.g. by confirmation token).
- **Launch checklist:** Payment/Shipping/Theme validation are app/config
  concerns; DB side is orders + products + storage as above.

For new tables, default to RLS on and grant only what’s needed (e.g.
service_role for ingest, narrow policies for authenticated).
