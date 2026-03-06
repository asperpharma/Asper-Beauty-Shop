# Next Steps — Deployment Checklist

Use this checklist **in strict order** when preparing for deployment. For the **full launch execution** (bulk import via Matrixify, Brain connection, live-fire tests), see **docs/LAUNCH_EXECUTION_PLAN.md**. The **Asper Beauty Pre-Launch** skill (`.cursor/skills/asper-beauty-pre-launch`) uses this file for the exact step order. **Stop on first failure** for steps 1–4.

**Order:** 1) `npm run lint` → 2) `npm run build` (stop on failure) → 3) **bulk-product-upload** Edge Function (HTTP 200) → 4) **SHOPIFY_STORE_DOMAIN** and **SHOPIFY_ACCESS_TOKEN** set in Supabase secrets (no values echoed).

---

## Health checks (strict order)

Run these in order. Do **not** proceed if a step fails unless the step says otherwise.

### 1. Clinical hygiene (Lint)

```bash
npm run lint
```

- **Pass:** No errors.
- **Fail:** STOP. Fix reported issues, then re-run from step 1.

### 2. Structural integrity (Build)

```bash
npm run build
```

- **Pass:** `dist/` (or configured output dir) is created with no errors.
- **Fail:** STOP. Fix build errors, then re-run from step 1.

### 3. Brain connectivity (Edge Function)

Verify the Supabase Edge Function responds **200 OK**:

- **URL:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`
- **Pass:** HTTP 200.
- **Fail:** STOP. If 503, set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` in Supabase → Edge Functions → Secrets, then re-check.

### 4. Vault check (Secrets)

Verify these are set in Supabase → Edge Functions → Secrets. **Do not echo or log secret values.**

- `SHOPIFY_STORE_DOMAIN` — set (value not displayed).
- `SHOPIFY_ACCESS_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN` per your setup) — set (value not displayed).

- **Pass:** Both present.
- **Fail:** Add missing secrets in Supabase dashboard and re-check.

### 5. Build output (optional)

**Reference:** `docs/DEPLOYMENT_GUIDE.md` (when present).

Optional validation of `dist/` after a successful build: `dist/robots.txt` (exist, non-empty), `dist/sitemap.xml` or `dist/sitemap-index.xml` (exist, well-formed XML). If this doc is missing, the skill skips or uses SKILL.md defaults.

### 6. Pull request (after all checks pass)

When steps 1–5 pass (or 5 is waived for this run), generate:

- **PR title:** `chore: release preparations [Date]` (use today’s date, e.g. `2026-02-07`).
- **PR body:** Use the template below. Fill checkboxes to match what was run.

#### PR body template

```markdown
## Deployment to main

- [x] Lint passed
- [x] Build passed
- [x] bulk-product-upload Edge Function returns 200
- [x] SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN set (Supabase secrets)
- [x] dist/ validated for robots.txt and sitemap (or waived)

Ready to merge to `main` for production deploy.
```

Use this in the PR body when opening a PR targeting `main`.

---

## Automation

- **Skill:** **Asper Beauty Pre-Launch** (`.cursor/skills/asper-beauty-pre-launch`) — when **`scripts/health-checks.ps1`** exists, the skill runs it **from the repo root**; otherwise the skill follows the steps in **SKILL.md**. It generates the standardized PR template (checkboxes: lint, build, Edge Function 200, secrets, dist validation). Triggers: **"Prepare for deployment"**, **"Run health checks"**, **"Check system status"**, **"Ready to go live?"**
- **Script:** `scripts/health-checks.ps1` — run from project root: `.\scripts\health-checks.ps1`. The script may not fully match this checklist order (e.g. it may run build before lint or omit Edge Function 200 / Shopify env checks); the skill can run those checks itself when using SKILL.md.

---

## References

- **docs/DEPLOYMENT_GUIDE.md** — Sitemap and robots.txt rules for build validation.
- **docs/HEALTH-CHECK-PROTOCOL.md** — Live health check and DB (PostgREST) details.
- **docs/FINISH-AND-PUBLISH.md** — Phases for going live (push, secrets, domain, verify).
