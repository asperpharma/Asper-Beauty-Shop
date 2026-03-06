# Telemetry and Health Checks (Supabase)

## Telemetry events

- **Table:** `public.telemetry_events`
  - Columns: `id`, `occurred_at`, `source`, `event`, `user_id`,
    `correlation_id`, `payload` (jsonb).
- **Access:** Table is locked for `anon` and `authenticated`. Writes only via
  Edge Function using the **Service Role** key.
- **Migration:** `supabase/migrations/20260207120000_telemetry_events.sql`
  - Run with `supabase db push` or apply in SQL Editor (requires
    [Supabase CLI](https://supabase.com/docs/guides/cli) and a linked project).

## log-telemetry Edge Function

- **Role:** Validates input and inserts into `telemetry_events` with the Service
  Role.
- **Auth:** Request must include header `x-telemetry-secret` equal to
  `TELEMETRY_INGEST_SECRET` (set in Supabase secrets).

### Deploy

Requires [Supabase CLI](https://supabase.com/docs/guides/cli) and a linked
project (`supabase link`).

```bash
# Set secret (once; do not commit the real value)
supabase secrets set TELEMETRY_INGEST_SECRET=your-secret-here
# Or: echo "TELEMETRY_INGEST_SECRET=your-secret-here" >> .env && supabase secrets set --env-file .env

# Apply migrations then deploy
supabase db push
supabase functions deploy log-telemetry
```

### Invoke

```bash
supabase functions invoke log-telemetry --no-verify-jwt \
  --body '{"source":"api","event":"request_handled","payload":{"ok":true}}' \
  --header "x-telemetry-secret: your-secret-here"
```

Or from app/script (server-side only, never expose the secret in client code):

```http
POST https://<project-ref>.supabase.co/functions/v1/log-telemetry
Content-Type: application/json
x-telemetry-secret: <TELEMETRY_INGEST_SECRET>

{"source":"quiz","event":"quiz_started","payload":{"quiz_id":"q1","version":"1.0.0"}}
```

**Allowed sources:** `quiz`, `api`, `sync`. Payload is limited to 20 keys; must
be a JSON object.

### Verify events

In SQL Editor (as a user with DB access, e.g. dashboard):

```sql
SELECT count(*) AS cnt, source, event
FROM public.telemetry_events
WHERE occurred_at > now() - interval '5 minutes'
GROUP BY source, event
ORDER BY source, event;
```

## Optional: client INSERT policy

If you later want limited direct client writes (e.g. authenticated users,
whitelisted events only), you can add a narrow RLS policy and keep `SELECT`
blocked. See your Supabase/Copilot thread for the pattern; we can add it here if
you specify the allowed `(source, event)` list.

## Health checks for dashboard

Deployment health and launch checklist data are stored in Postgres and ingested
via an Edge Function.

### Tables

- **deployment_health_checks** — `branch`, `job_name`, `status`
  (success/failure/cancelled/running), `run_id`, `run_url`, `payload`,
  `reported_at`.
- **checklist_items** — `slug`, `name`, `category`, `required`, `sort_order`
  (seeded: payment, shipping, theme, git-health, npm-health).
- **checklist_progress** — `checklist_slug`, `branch_or_context`, `completed`,
  `payload`, `reported_at`.

Migration: `supabase/migrations/20260207120100_deployment_health_checks.sql`.
RLS: only service_role can insert; admins can SELECT (for dashboard).

### health-checks-ingest Edge Function

- **Auth:** Header `x-health-checks-secret` must equal `HEALTH_CHECKS_SECRET`.
- **Body:** `health_check` and/or `checklist_progress` (see below). At least one
  required.

**Health check example:**

```json
{
  "health_check": {
    "branch": "main",
    "job_name": "deno",
    "status": "success",
    "run_id": "123",
    "run_url": "https://github.com/...",
    "payload": {}
  }
}
```

**Checklist progress example:**

```json
{
  "checklist_progress": {
    "checklist_slug": "payment",
    "branch_or_context": "main",
    "completed": true,
    "payload": {}
  }
}
```

**Deploy and invoke:**

```bash
supabase secrets set HEALTH_CHECKS_SECRET=your-secret
supabase functions deploy health-checks-ingest
# Invoke (e.g. from GitHub Actions or dashboard):
curl -X POST "https://<project-ref>.supabase.co/functions/v1/health-checks-ingest" \
  -H "Content-Type: application/json" -H "x-health-checks-secret: your-secret" \
  -d '{"health_check":{"branch":"main","job_name":"deno","status":"success"}}'
```

### Sample dashboard queries

```sql
-- Last status per branch/job
SELECT DISTINCT ON (branch, job_name) branch, job_name, status, reported_at
FROM public.deployment_health_checks
ORDER BY branch, job_name, reported_at DESC;

-- Failing checks (last 24h)
SELECT branch, job_name, status, reported_at
FROM public.deployment_health_checks
WHERE status = 'failure' AND reported_at > now() - interval '24 hours'
ORDER BY reported_at DESC;

-- Checklist completion (latest per slug)
SELECT checklist_slug, completed, reported_at
FROM (
  SELECT *, row_number() OVER (PARTITION BY checklist_slug ORDER BY reported_at DESC) AS rn
  FROM public.checklist_progress
) t
WHERE rn = 1;
```

## Related docs

- `docs/ANALYTICS_TOP_SKIN_CONCERN_AND_PRESCRIPTION.md` – Top Skin Concern, Most
  Prescribed SKU, Prescription Conversion (log-concierge-events, weekly
  aggregation, Shopify stub)
- `docs/RLS_BASELINE.md` – RLS summary for products, orders, storage, telemetry,
  health tables
- `docs/SUPABASE_LINK_AND_ORG.md` – linking and org
- `docs/KEY_ROTATION_CHECKLIST.md` – rotating keys (include
  `TELEMETRY_INGEST_SECRET`, `HEALTH_CHECKS_SECRET` if used)
