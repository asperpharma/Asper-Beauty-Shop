# Health Check Protocol

Single reference to verify system status and run live health checks. Aligns with **CONNECTION_STATUS.md** and **NEXT_STEPS.md** (in repo root or parent Asper-Beauty-Shop).

---

## 1. Current system status (snapshot)

When all systems are green:

| System | Status | Notes |
|--------|--------|--------|
| **Commerce** | Green | Shopify Storefront API (v2025-07) connected, products fetching |
| **Backend** | Green | Supabase Auth + DB active; AI Beauty Assistant (Gemini 2.5 Flash) operational |
| **Frontend** | Green | Build passes (e.g. 48/48 checks, ~6.5s); no critical lint errors |
| **Security** | Green | Critical vulns (e.g. React Router, Glob CLI) addressed |
| **DNS** | Yellow | Code ready; **www.asperbeautyshop.com** needs CNAME at registrar → `asperbeautyshop.lovable.app` |

Verify at any time: **Connection Status Report** (CONNECTION_STATUS.md) or run the steps below. For **launch-day sequence** (bulk import, secrets, live tests), see **docs/LAUNCH_EXECUTION_PLAN.md**. For **daily/weekly monitoring** (orders, Gorgias, chat logs, audit, pulse), see **docs/monitor-checklist.md**.

---

## 2. Run a live health check

From the **project root** (where `package.json` and `vite.config` live):

### Step 1: Verify build integrity

```bash
npm run build
```

- **Success:** `dist/` is generated with no error.
- **If it fails:** Run `npm install` first; fix any TypeScript or build errors.

### Step 2: Verify code hygiene

```bash
npm run lint
```

- **Success:** No error messages.
- **If it fails:** Fix reported files or run `npm run format` if available.

### Step 3: Tray health check (optional)

With `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`) in `.env` run `npm run test:tray`. Success: tray returns 200/400 as expected. Skipped when env not set.

### Step 4: Test API connectivity (Supabase & Shopify)

Checks that backend secrets are loaded and the “Brain” can talk to the store:

**PowerShell:**

```powershell
Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

**Bash / curl:**

```bash
curl -s -o /dev/null -w "%{http_code}" "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

- **Green (200):** Secrets and function are OK.
- **Red (503):** Set **SHOPIFY_STORE_DOMAIN** and **SHOPIFY_ACCESS_TOKEN** in Supabase → Project → Edge Functions → Secrets; re-run until 200.

### Step 5: Database (PostgREST) check — optional

To verify the DB and PostgREST are reachable, use a **trivial SELECT** on an existing table (no custom RPC required). Example using `checklist_items` (anon read allowed):

**PowerShell:**

```powershell
$base = "https://rgehleqcubtmcwyipyvi.supabase.co/rest/v1/checklist_items"
$h = @{ apikey = $env:SUPABASE_ANON_KEY; Authorization = "Bearer $env:SUPABASE_ANON_KEY" }
Invoke-RestMethod -Uri "$base`?select=id&limit=1" -Headers $h
```

**curl:**

```bash
curl -s -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "https://rgehleqcubtmcwyipyvi.supabase.co/rest/v1/checklist_items?select=id&limit=1"
```

- **200 + JSON array:** DB and PostgREST are up (empty `[]` is still OK).
- **4xx/5xx:** Check project URL and anon key; ensure RLS allows anon read on `checklist_items`.

**Alternative:** If you prefer an RPC-based check, create a helper in the DB, e.g. `create or replace function public.now() returns timestamptz language sql stable as $$ select now(); $$;` and call `POST /rest/v1/rpc/now`. The table query above avoids any new DB object.

### Optional: All-in-one script (PowerShell)

From project root:

```powershell
.\scripts\health-checks.ps1
```

Runs Git branch, lint, test, build, and Supabase function checks (bulk-product-upload, audit-24h).

---

## 3. Post-deployment verification

After pushing to `main` (or deploying), use the checklist in **DEPLOYMENT_GUIDE.md** (or below):

| # | Check | Pass |
|---|--------|------|
| 1 | **Visual** — Background is Soft Ivory (#F8F8FF)? | ☐ |
| 2 | **Functional** — Can you add a product (e.g. Vichy Mineral 89) to the cart? | ☐ |
| 3 | **Intelligence** — Does the AI Concierge respond to “I have dry skin” with the Pharmacist persona / 3-click flow? | ☐ |
| 4 | **SSL** — HTTPS padlock on the live URL? | ☐ |
| 5 | **DNS** (if using custom domain) — www.asperbeautyshop.com resolves and shows the site? | ☐ |

---

## 4. References

- **CONNECTION_STATUS.md** — Full connection status (Shopify, Supabase, domain, functions).
- **NEXT_STEPS.md** — Deploy flow, health checks table, PR → DNS → verify.
- **DEPLOYMENT_GUIDE.md** — Post-deployment checklist and URLs.
- **scripts/health-checks.ps1** — Automated health checks (Git, NPM, Supabase).

Supabase project ID used in this protocol: **rgehleqcubtmcwyipyvi** (from CONNECTION_STATUS.md).
