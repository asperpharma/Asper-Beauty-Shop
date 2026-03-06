# Clinical Sensors — Automated Telemetry Implementation

**Objective:** Transform the 24-Hour Clinical Audit from manual inspection to
**automated diagnosis** via real-time telemetry.

---

## 1. Database Schema: The "Clinical Sensor" Tables

Run the migration in Supabase SQL Editor (or `supabase db push`):

**File:** `supabase/migrations/20250208000000_clinical_sensors.sql`

### Tables Created

| Table                   | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| **as_telemetry**        | API latency, quiz steps, Shopify sync events                     |
| **as_concierge_events** | Intent detection, routine recommendations, authenticity triggers |

### Example: Logging API Latency

```sql
insert into public.as_telemetry (event_type, metric_name, value_numeric, source)
values ('api_latency', 'shopify_storefront_ms', 142, 'api');
```

### Example: Logging Concierge Intent

```sql
insert into public.as_concierge_events (event_type, intent, recommended_handles)
values ('intent_detected', 'acne', array['vichy-normaderm-phytosolution', 'lrp-effaclar-duo-plus']);
```

---

## 2. The Audit Edge Function (`/audit/24h`)

Aggregates the last 24 hours of data into a single JSON report.

### Deploy

```bash
supabase functions deploy audit-24h
```

### Invoke

```bash
curl -s "https://YOUR_PROJECT_REF.supabase.co/functions/v1/audit-24h" \
  -H "Authorization: Bearer YOUR_ANON_OR_SERVICE_KEY"
```

### Sample Response

```json
{
  "audit_window": { "start": "...", "end": "...", "duration_hours": 24 },
  "telemetry": {
    "total_events": 150,
    "by_event_type": { "api_latency": 80, "quiz_step": 70 },
    "api_latency_ms": { "avg": 142, "sample_count": 80 }
  },
  "concierge": {
    "events_count": 25,
    "intent_counts": { "acne": 10, "anti_aging": 8 },
    "consultations_count": 12
  },
  "raw": { ... }
}
```

Use this output to fill `docs/audits/24_HOUR_CLINICAL_AUDIT.md` or feed into a
dashboard.

---

## 3. Strategic Implementation Steps

### Step 1: Deploy SQL

Execute `supabase/migrations/20250208000000_clinical_sensors.sql` in Supabase
SQL Editor.

### Step 2: Deploy Edge Function

```bash
supabase functions deploy audit-24h
```

### Step 3: Connect Telemetry

**Event whitelist:** Client inserts are restricted. Use only these `event_type`
values:

- **as_telemetry:** `api_latency`, `quiz_step`, `quiz_completion`,
  `shopify_sync`
- **as_concierge_events:** `intent_detected`, `routine_recommended`,
  `authenticity_triggered`

**Env vars:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected
by Supabase (not custom secrets). Verify with
`supabase functions serve audit-24h` locally.

---

**A. Quiz / 3-Click Flow** — In `QuizComponent.tsx` or equivalent:

```ts
// After user selects concern and receives recommendations
await supabase.from("as_concierge_events").insert({
  event_type: "intent_detected",
  intent: "acne", // or routine.concern slug
  recommended_handles: routine.products.map((p) => p.handle),
});
```

**B. API Latency** — In your Shopify fetch layer:

```ts
const start = performance.now();
const res = await fetchShopifyProducts(...);
const ms = Math.round(performance.now() - start);
await supabase.from('as_telemetry').insert({
  event_type: 'api_latency',
  metric_name: 'shopify_storefront_ms',
  value_numeric: ms,
  source: 'api',
});
```

**C. Shopify Sync Script** — After bulk sync:

```ts
await supabase.from("as_telemetry").insert({
  event_type: "shopify_sync",
  metric_name: "bulk_upload",
  value_numeric: productCount,
  metadata: { duration_ms, errors: 0 },
  source: "shopify_sync",
});
```

---

## 4. Quick Reference

| Action          | Command / Location                        |
| --------------- | ----------------------------------------- |
| Run migration   | Supabase SQL Editor or `supabase db push` |
| Deploy function | `supabase functions deploy audit-24h`     |
| Get 24h report  | `curl` to `/functions/v1/audit-24h`       |
| Audit template  | `docs/audits/24_HOUR_CLINICAL_AUDIT.md`   |
