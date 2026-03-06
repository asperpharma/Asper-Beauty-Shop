# Analytics: Top Skin Concern, Most Prescribed SKU, Prescription Conversion

## a. Top Skin Concern

**Source:** Supabase Edge Function + `telemetry_events`\
**How:** Count click events for each skin concern (navigation/selection on the
Skin Concerns page).

### Implementation (done)

- **Frontend:** `src/pages/SkinConcerns.tsx` calls
  `logSkinConcernClick(concern.id)` when a user selects a concern.
  `src/lib/conciergeAnalytics.ts` sends a POST to the `log-concierge-events`
  Edge Function.
- **Edge Function:** `supabase/functions/log-concierge-events` — accepts
  `{ concern_id, concern_slug? }`, rate-limits by IP (60/min), writes to
  `telemetry_events` with `source='concierge'`, `event='skin_concern_click'`.
- **Tables:** Raw events in `telemetry_events`. Weekly summary in
  `analytics_skin_concern_weekly` (see migration
  `20260207130000_concierge_analytics.sql`).
- **Aggregation:** SQL function
  `public.aggregate_skin_concern_weekly(p_weeks_back)` — groups by week and
  `payload->>'concern_id'`, upserts into `analytics_skin_concern_weekly`.

### Automation: schedule weekly aggregation

**Option 1 – Supabase pg_cron (if enabled):**

```sql
-- Run every Sunday at 02:00 UTC
SELECT cron.schedule(
  'agg-skin-concern-weekly',
  '0 2 * * 0',
  $$SELECT public.aggregate_skin_concern_weekly(2)$$
);
```

**Option 2 – Scheduled Edge Function:** Create a function that runs the
aggregation via Service Role (e.g. `SELECT aggregate_skin_concern_weekly(2)`)
and invoke it weekly via GitHub Actions cron, Vercel Cron, or Supabase scheduled
invocations if available.

**Option 3 – Manual:** Run in SQL Editor when needed:

```sql
SELECT public.aggregate_skin_concern_weekly(2);
```

### Query: top skin concerns (last week)

```sql
SELECT concern_id, click_count
FROM public.analytics_skin_concern_weekly
WHERE week_start = date_trunc('week', current_date)::date - interval '1 week'
ORDER BY click_count DESC;
```

### Deploy

```bash
supabase functions deploy log-concierge-events
# Optional: set secret for production (client can send VITE_CONCIERGE_EVENTS_SECRET)
supabase secrets set CONCIERGE_EVENTS_SECRET=your-secret
```

---

## b. Most Prescribed SKU

**Source:** Shopify Admin/API\
**How:** Use Shopify Product/Order API to get best sellers filtered by a
`chatbot-referral` (or similar) tag that your bot attaches to orders it
influences.

### Implementation (stub + automation)

- **Tagging:** When the chatbot/prescription flow influences an order, tag the
  order or line item (e.g. `chatbot-referral` or `prescription-referral`) in
  your checkout or order-creation flow (e.g. in `create-cod-order` or Shopify
  order metadata).
- **Edge Function stub:** `supabase/functions/shopify-best-sellers` — calls
  Shopify Admin API to fetch orders or products with that tag and returns top
  SKUs. Requires `SHOPIFY_STORE`, `SHOPIFY_ACCESS_TOKEN` (Admin API).
- **Automation:** Schedule the Edge Function (e.g. weekly via GitHub Actions or
  external cron) and optionally store results in a table (e.g.
  `analytics_prescribed_sku_weekly`) for dashboard use. Alternatively use
  **Matrixify** export filtered by tag and analyze in a sheet.

See **`supabase/functions/shopify-best-sellers/`** (stub). Implement by calling
Shopify Admin API (orders with tag, aggregate line items by product/variant).

### Required secrets (Supabase)

- `SHOPIFY_STORE` — e.g. `your-store.myshopify.com`
- `SHOPIFY_ACCESS_TOKEN` — Admin API access token (read orders/products)

---

## c. Prescription Conversion

**Source:** Shopify Analytics / Storefront API + frontend events\
**How:** Track “Add to Cart” events linked to prescription CTAs (e.g. from Quick
View or prescription CTA buttons).

### Implementation

1. **Frontend (Add to Cart from prescription CTA):**\
   Add event listeners in your Quick View / prescription components so that when
   the user clicks “Add to Cart” from a prescription or chatbot-suggested
   product, send a telemetry event (e.g. `source: 'concierge'`,
   `event: 'add_to_cart_from_prescription'`,
   `payload: { product_id, source: 'quick_view' | 'prescription_cta' }`).
   - Use `log-telemetry` (server-side, with `TELEMETRY_INGEST_SECRET`) from a
     small backend that the frontend calls, or
   - Use `log-concierge-events` extended to accept this event type (add
     `add_to_cart_from_prescription` with payload `product_id`, `source`), or
   - Reuse `quizFunnelAnalytics.ts`: extend
     `trackQuizFunnel('ADD_TO_CART', { product_id, source: 'prescription' })`
     and have that send to your backend/Edge Function.

2. **Backend:** Store in `telemetry_events` (e.g.
   `event = 'add_to_cart_from_prescription'`) so you can count conversions and
   join with order data if needed.

3. **Shopify Storefront API (optional):** Periodically fetch “cart_create” or
   checkout data from Storefront API if you use Shopify’s cart; filter by
   sessions that included prescription products. This is optional if you already
   track Add to Cart in your app.

### Quick View / prescription CTA wiring (done)

- **`src/lib/conciergeAnalytics.ts`** —
  `logPrescriptionAddToCart(productId, source)` sends
  `event: 'add_to_cart_from_prescription'` to `log-concierge-events`.
- **`ProductQuickViewModal.tsx`** and **`QuickViewModal.tsx`** — call
  `logPrescriptionAddToCart(product.id | node.id, 'quick_view')` in
  `handleAddToCart`.
- For prescription CTA (e.g. from chatbot or prescription view), call
  `logPrescriptionAddToCart(productId, 'prescription_cta')`.

---

## Related

- `docs/TELEMETRY_AND_HEALTH_CHECKS.md` — telemetry table, log-telemetry,
  log-concierge-events
- `src/lib/conciergeAnalytics.ts` — client helper for skin concern clicks
- `src/lib/quizFunnelAnalytics.ts` — quiz funnel steps (can be extended for
  ADD_TO_CART from prescription)
