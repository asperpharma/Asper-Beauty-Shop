# Pre-launch checklist

One place for RLS review, monitoring, test requests, and the full deployment
sequence. Use with [NEXT_STEPS.md](../NEXT_STEPS.md) and
[SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md).

**Before deploying the new Premium Pharmacy look:** run through
[Master Launch Checklist (payments, shipping, theme)](MASTER_LAUNCH_CHECKLIST.md).

---

## 1. Full pre-launch: prioritized actionable todo list

Do in this order. Check off as you go.

| # | Task                            | Where / How                                                                                                                                                                                                |
| - | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | **Health checks 1–4**           | [NEXT_STEPS.md § Run these health checks now](../NEXT_STEPS.md): `npm run build`, `npm run lint`, GET bulk-product-upload (200 vs 503), Supabase Dashboard Logs/Advisors.                                  |
| 2 | **Fix 503 if needed**           | Supabase → Project → Edge Functions → Secrets: set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ACCESS_TOKEN`. Re-run GET until 200. See [SHOPIFY_SETUP_CHECKLIST.md § Step 3 and § 6](../SHOPIFY_SETUP_CHECKLIST.md). |
| 3 | **Shopify pre-launch**          | [SHOPIFY_SETUP_CHECKLIST.md § Before you go live](../SHOPIFY_SETUP_CHECKLIST.md): products, payments, shipping, theme, plan/password.                                                                      |
| 4 | **RLS review**                  | Run `list_tables` and `list_policies` (or Supabase Dashboard → Table Editor + Authentication → Policies). See § 2 below; fix any missing/overly permissive policies.                                       |
| 5 | **Create PR → merge to `main`** | [NEXT_STEPS.md § Step 1](../NEXT_STEPS.md). Auto-deploys.                                                                                                                                                  |
| 6 | **DNS (optional)**              | CNAME `www` → `asperbeautyshop.lovable.app`. [NEXT_STEPS.md § Step 2](../NEXT_STEPS.md).                                                                                                                   |
| 7 | **Verify deployment**           | Dev URL + production URL; test checklist in [NEXT_STEPS.md § Step 3](../NEXT_STEPS.md).                                                                                                                    |
| 8 | **Monitoring**                  | Add health-check to uptime/alert (see § 3). Optional.                                                                                                                                                      |

---

## 2. RLS review — tables and policy checklist

When you run **list_tables** and **list_policies**, use this to decide what
should exist and what to add/change.

### Tables the app uses

| Table                  | Used by                                                                                                                 | Expected access                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **cod_orders**         | CODCheckoutForm (insert), AdminOrders, DriverDashboard, DriverAssignment, AdminAuditLogs                                | **INSERT** for anonymous (checkout). **SELECT/UPDATE** only for admin or driver (by role).                  |
| **user_roles**         | ManageProducts, AdminOrders, DriverAssignment, AdminAuditLogs                                                           | **SELECT** for authenticated users (or only admin); used to check `role = 'admin'` or driver. No anonymous. |
| **products**           | ProductDetail, Shop, ManageProducts, ProductCatalog, LuxurySearch, FeaturedCollection, DealOfTheDay, BestSellersSection | **SELECT** for all (public read). **INSERT/UPDATE/DELETE** only for admin.                                  |
| **product-images**     | ManageProducts                                                                                                          | **SELECT** for all; **INSERT/UPDATE/DELETE** only for admin.                                                |
| **profiles**           | AdminAuditLogs, DriverAssignment                                                                                        | **SELECT** for admin (or authenticated with same user id). No anonymous.                                    |
| **driver_access_logs** | AdminAuditLogs, useDriverAuditLog                                                                                       | **SELECT** for admin; **INSERT** for driver/edge function. No anonymous.                                    |

### What to check (after you run list_policies)

- **cod_orders:** One policy allowing **INSERT** for anon or all (for checkout).
  Separate policies so **SELECT** and **UPDATE** are restricted to admin (or
  driver, if you have driver role).
- **user_roles:** No **INSERT/UPDATE/DELETE** for anon. **SELECT** only for
  authenticated (and ideally only for own row or admin).
- **products / product-images:** **SELECT** for anon or authenticated;
  **INSERT/UPDATE/DELETE** only for service role or admin (e.g.
  `auth.jwt() ->> 'role' = 'admin'` or via backend).
- **profiles:** No anon write; **SELECT** restricted (e.g. admin or own `id`).
- **driver_access_logs:** No anon; **SELECT** for admin; **INSERT** for driver
  or edge function.

After you run **list_tables** and **list_policies**, paste the policy list (or a
summary) and we can propose exact `CREATE POLICY` statements for any missing or
weak policies.

---

## 3. Monitoring — health-check test plan and uptime/alert suggestions

### Health-check endpoint (already exists)

- **URL:**
  `GET https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`
- **No auth.**
- **200** = Edge Function secrets (SHOPIFY_* ) present and valid.
- **503** = secrets missing or invalid.

### Test plan

1. **Manual:** Run weekly (or before each release):\
   `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"`\
   Expect `{"status":"ok",...}` and status 200.
2. **Uptime/alert:** Add a check every 5–15 minutes:
   - **URL:** same as above.
   - **Success:** HTTP 200.
   - **Alert:** On 503 or timeout → notify (email/Slack); then check Supabase
     Edge Function secrets and **Advisors** (see § 4).

### Optional: extra health endpoint

If you want a dedicated “ping” endpoint (e.g. no Shopify dependency), add a
second Edge Function (e.g. `health`) that returns 200. The bulk-product-upload
GET already serves as the main health check for “secrets loaded.”

---

## 4. Test requests and 503 troubleshooting

### Run these

**GET (health, no auth):**

```bash
curl -s -w "\n%{http_code}" "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

**POST (admin JWT; use placeholder or env var):**

```bash
curl -s -w "\n%{http_code}" -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

### How to interpret

- **GET 200:** Secrets OK.
- **GET 503:** Secrets missing or invalid.
- **POST 200/201:** Request accepted (or Shopify created the product).
- **POST 400:** Validation error (e.g. missing `action` or `product`).
- **POST 401/403:** Auth problem (invalid or non-admin JWT).

### If you get 503

1. **Edge Function secrets**\
   Supabase → Project → **Edge Functions** → **Secrets**. Ensure:
   - `SHOPIFY_STORE_DOMAIN` = `your-store.myshopify.com` (no `https://`).
   - `SHOPIFY_ACCESS_TOKEN` = your Admin API token (e.g. `shpat_...`).\
     Re-deploy or invoke the function after saving.

2. **Run get_advisors**\
   In Supabase (Dashboard or API): run **Advisors** (or your org’s equivalent).
   Look for “missing environment variable” or “Edge Function secrets” for
   `bulk-product-upload`.

3. **Run get_logs**\
   Supabase → **Edge Functions** → **bulk-product-upload** → **Logs**. On the
   request that returned 503, check the log line: it will usually say which
   secret is missing or invalid.

4. **Re-run GET**\
   After fixing secrets, call the GET URL again; expect 200.

Share the **GET response body + status** and, if 503, the relevant **Advisors**
and **Logs** output, and we can suggest exact next steps.

---

## 5. Add Edge Function secrets (503 fix) — checklist and exact steps

Use this when GET returns **503** and the diagnostic says to set
`SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN`.

### Checklist

- [ ] Get **SHOPIFY_STORE_DOMAIN**: your store’s myshopify domain (e.g.
      `your-store.myshopify.com`). No `https://`.
- [ ] Get **SHOPIFY_ACCESS_TOKEN**: Admin API token from Shopify (Settings →
      Apps → Develop apps → your app → Admin API → token, e.g. `shpat_...`).
      Keep secret.
- [ ] Add both in Supabase (Dashboard or CLI below).
- [ ] Re-run GET health check; expect **200**.
- [ ] (Optional) Run POST with sample body and admin JWT; expect 200/201 or a
      clear error.

### Option A: Supabase Dashboard (screenshot-friendly)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select project
   **rgehleqcubtmcwyipyvi**.
2. Left sidebar → **Project Settings** (gear).
3. **Edge Functions** in the left menu → **Secrets** (or **Environment
   variables** for Edge Functions).
4. **Add secret** (or **New secret**):
   - **Name:** `SHOPIFY_STORE_DOMAIN`\
     **Value:** `your-store.myshopify.com` (replace with your store; no
     `https://`).\
     Save.
   - **Name:** `SHOPIFY_ACCESS_TOKEN`\
     **Value:** your Admin API token (e.g. `shpat_...`).\
     Save.
5. Invoke the function again (no need to redeploy). New requests will see the
   new secrets.

### Option B: Supabase CLI

From repo root (with Supabase CLI installed and project linked):

```bash
supabase secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
```

Or from a file (do not commit):

```bash
# .env.secrets (add to .gitignore)
# SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
# SHOPIFY_ACCESS_TOKEN=shpat_...

supabase secrets set --env-file .env.secrets
```

### Verify

**1. GET (health) — expect 200**

```bash
curl -s -w "\n%{http_code}" "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

Expect body like `{"status":"ok","message":"Shopify secrets configured"}` and
status **200**.

**2. POST (optional) — with admin JWT or service_role**

Replace `YOUR_ADMIN_JWT` with a Supabase user JWT that has
`user_roles.role = 'admin'`, or use `SUPABASE_SERVICE_ROLE_KEY` for testing:

```bash
curl -s -w "\n%{http_code}" -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

### How to interpret POST responses

| Status                                                              | Meaning                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **200 / 201**                                                       | Success. 201 = resource created. Response body contains created product details or success confirmation from Shopify proxy logic.                                                                                                                                 |
| **400**                                                             | Bad request — invalid or malformed payload. Use the function response body (error message / validation details) to fix the request.                                                                                                                               |
| **401 / 403**                                                       | Unauthorized / Forbidden — missing or invalid JWT, or insufficient role/claims. If GET was 200 but POST is 401/403, the function is correctly enforcing auth for write actions. Use an admin JWT with required claims or `SUPABASE_SERVICE_ROLE_KEY` for testing. |
| **503** (with “set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN…”) | Secrets missing or invalid. Follow the steps in this §5 to add them, then re-run GET and POST.                                                                                                                                                                    |
