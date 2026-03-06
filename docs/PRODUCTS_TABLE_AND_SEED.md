# Products Table: Schema, Indexes, and Seed

This doc confirms what’s in place for the **products** table and **baseline
RLS** so you can test filtering and Digital Tray logic.

---

## What’s in the migration

**Migration:**
`supabase/migrations/20260209120000_products_is_active_indexes_seed.sql`

1. **`is_active` column**
   - `boolean NOT NULL DEFAULT true`.
   - When `false`, product is hidden from storefront and search (soft delete).

2. **Indexes (filtering and speed)**
   - `idx_products_is_active` — partial index where `is_active = true`.
   - `idx_products_category` — filter by category.
   - `idx_products_brand` — filter by brand.
   - `idx_products_skin_concerns` — GIN index on `skin_concerns` array.
   - `idx_products_updated_at` — recent-first ordering.

3. **Baseline RLS**
   - **Public read:** only rows with `is_active = true`.
   - Admins keep full insert/update/delete via existing policies.

4. **Seed SKUs (3–5 sample rows)**
   - Real brands: **Vichy** (Minéral 89, Normaderm, LiftActiv), **La
     Roche-Posay** (Effaclar Duo, Toleriane Sensitive).
   - Realistic titles, prices, `skin_concerns`, and tags (e.g. `Concern_Acne`,
     `Concern_Hydration`) so you can test:
     - Filtering by concern and brand.
     - Digital Tray / bot recommendations.
     - `get-products-by-concern` Edge Function.

---

## Confirmation checklist

- [x] Products table has `is_active` and indexes.
- [x] Public read restricted to `is_active = true`.
- [x] Sample SKUs seeded (Vichy, La Roche-Posay).
- [ ] _(Optional)_ Scaffold **products-search** Edge Function for ultra-fast
      product lookup and bot recommendations.

---

## Next step: products-search Edge Function

When you’re ready, you can add a **products-search** Edge Function that:

- Accepts query params (e.g. `concern`, `brand`, `q` for text).
- Queries `public.products` with `is_active = true` and uses the new indexes.
- Returns a small, consistent payload for the bot and Digital Tray.

Your existing **get-products-by-concern** function already returns products by
concern (and optional brand); products-search can extend this with full-text
search and caching if you need it.
