# Supabase: Digital Concierge Brain

Supabase stores **user context** for the 3-Click Solution and Digital Concierge:

- **profiles** — Skin type, primary concern (clinical profile)
- **consultations** — AI chat history and recommended SKUs
- **wishlist_items** — Custom wishlist (complements Shopify)

Shopify holds the **product catalog**. Supabase holds the **user memory**.

## Run the migration

**Option A — Supabase Dashboard**

1. Open your project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Paste the contents of `migrations/20250207000000_concierge_brain.sql`
4. Run it

**Option B — Supabase CLI** (if configured)

```bash
supabase db push
```

## Security & validation

- **SECURITY DEFINER functions** (`get_products_by_concern`,
  `get_tray_by_concern`) have `search_path = public` set via
  `20250213000000_function_search_path.sql`.
- **Firebase Auth:** To allow Firebase JWTs to access this project, add a
  Firebase Auth connection in Dashboard → Auth. See
  **`docs/SUPABASE-VALIDATION.md`** for steps and for the validation checklist
  (linter, roles, search_path).
