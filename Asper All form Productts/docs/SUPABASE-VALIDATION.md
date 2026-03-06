# Supabase: Validation & Security

## 1. Firebase Auth connection (Dashboard)

To allow **Firebase JWTs** to access this Supabase project:

1. In **Supabase Dashboard** → **Project Settings** → **Auth** → **Providers** (or **Auth** → **Custom JWT**).
2. Find **“Add new Firebase Auth connection”** (or **JWT custom issuer**).
3. Add your Firebase project:
   - **Firebase Project ID**
   - **Firebase JWKS URL** (e.g. `https://securetoken.google.com/<project-id>/.well-known/jwks.json`)
4. Save. Supabase will then accept Firebase-issued JWTs for RLS and API access.

No code change in this repo is required; auth remains via Supabase client. If you later want to **sign in with Firebase** in the app and use that token with Supabase, you would pass the Firebase ID token to Supabase’s `setSession` or use a custom auth flow.

---

## 2. Validation steps after schema/function changes

After applying migrations or editing functions:

1. **Run the linter**  
   In Supabase Dashboard: **SQL Editor** → run the project linter (or `supabase db lint` if using CLI). Confirm any SECURITY DEFINER / search_path warnings are resolved.

2. **Test under different roles**  
   - **anon:** Call `get_products_by_concern` / `get_tray_by_concern` with anon key; expect allowed read.  
   - **authenticated:** Same + RLS on `profiles`, `consultations`, `concierge_profiles`, etc.  
   - **service_role:** Edge Functions; should bypass RLS and still behave correctly.

3. **Verify referenced objects**  
   - All tables/views/functions used in a function must exist in **allowed schemas** (e.g. `public`) or be **fully-qualified** (e.g. `public.products`).  
   - No unqualified references to objects outside the function’s `search_path`.

---

## 3. Standard: search_path for PL/pgSQL and SECURITY DEFINER

- **All PL/pgSQL functions**, especially **triggers** and **SECURITY DEFINER**, must:
  - **Set `search_path` explicitly**, e.g. `SET search_path = public`, **or**
  - **Fully-qualify** all object references (e.g. `public.products`, `auth.uid()`).

- **Why:** A SECURITY DEFINER function runs with the definer’s privileges. If `search_path` is not set, a caller could change `search_path` and inject a different schema (e.g. a malicious table) before calling the function. Setting `search_path = public` (or `''` and qualifying everything) prevents that.

- **This repo:**  
  - `public.get_products_by_concern(text)` and `public.get_tray_by_concern(text)` are SECURITY DEFINER.  
  - Migration `20250213000000_function_search_path.sql` sets `search_path = public` on both and adds comments.

---

## 4. Chosen search_path

| Schema   | Purpose |
|----------|--------|
| `public` | Application tables, views, and functions. All Concierge and product logic lives here. |

We use **only `public`** in `search_path` for these functions so that:
- References resolve to `public.products`, `public.get_products_by_concern`, etc.
- No dependency on `pg_catalog` or other schemas for these objects; `auth.uid()` is called explicitly where needed in RLS policies, not inside these functions.
