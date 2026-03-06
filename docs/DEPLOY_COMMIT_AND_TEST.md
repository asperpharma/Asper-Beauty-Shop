# Deployment Documentation: Commit Message, PR Description, and Test Checklist

Use these templates for commits and pull requests when adding or updating
deployment docs.\
If the repo already contains README Deployment, NEXT_STEPS, and
docs/DEPLOYMENT_TEMPLATE.md, no patches are needed.

## What's Included (Contribution Templates and Workflow)

- Commit message — Full template referencing all updated files (README,
  NEXT_STEPS, DEPLOYMENT_TEMPLATE, PRE_LAUNCH_CHECKLIST)
- PR title — docs: Deployment flow, NEXT_STEPS, and bulk-product-upload health
  check
- PR description — Copy-pasteable markdown block with Summary, Changes, and
  Validation checkboxes for GitHub
- Curl examples — PowerShell and Bash/WSL GET and POST for bulk-product-upload;
  base URL, result/meaning, and status-code notes
- Short testing checklist — GET/POST expectations, 503 handling (set secrets,
  re-test), README/NEXT_STEPS checks
- Deployment workflow — Branch, apply patch(es), git add, commit, push; PR
  base/compare/title/description
- Other patch options — README-only and NEXT_STEPS-only apply and stage commands

**Workflow note:**\
If you applied only deployment-docs.patch, use\
`git add NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md`\
(do not add README.md).\
If you also applied readme-deployment.patch, include README.md in git add:\
`git add README.md NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md`

**Doc cross-reference:**\
`patches/README.md` references this file as the source for PR descriptions and
workflow.

## Commit Message (Concise)

```
docs: add Deployment section, NEXT_STEPS flow, and DEPLOYMENT_TEMPLATE

- README: Production-ready checklist, Deployment (health checks → 503 fix → PR → DNS → verify), bulk-product-upload curl
- NEXT_STEPS: Flow at a glance, health checks 1–5, PR/DNS/verify, PRE_LAUNCH §5 link
- docs/DEPLOYMENT_TEMPLATE: placeholders, concrete bulk-product-upload sample payload
- docs/PRE_LAUNCH_CHECKLIST: §5 secrets checklist + POST response interpretation
```

## PR Title

docs: Deployment flow, NEXT_STEPS, and bulk-product-upload health check

## PR Description

Paste this in the PR description field on GitHub:

### Summary

Adds deployment documentation and a clear go-live flow.

### Changes

- **README:** Production-ready checklist (links to NEXT_STEPS +
  ADVANTAGES_AND_PLATFORMS). Deployment section with health-check flow and
  ready-to-use curl for bulk-product-upload (GET + POST).
- **NEXT_STEPS:** Flow at a glance, "What we have to do now" table, health
  checks 1–5 (build, lint, bulk-upload GET, Supabase Logs/Advisors), Step 1–3
  (PR, DNS, verify). Links to PRE_LAUNCH_CHECKLIST §5 for 503 fix.
- **docs/DEPLOYMENT_TEMPLATE:** Placeholders for doc names; concrete curl
  examples for this project (bulk-product-upload with sample
  create-shopify-product payload).
- **docs/PRE_LAUNCH_CHECKLIST:** §5 add Edge Function secrets (checklist,
  Dashboard + CLI, verify GET/POST, response interpretation).

### Validation

- [ ] README: "## Deployment" appears after Quick Start; "Production-ready
      checklist" near top.
- [ ] NEXT_STEPS: Contains flow-at-a-glance, health checks table, PR/DNS/verify
      steps.
- [ ] docs/DEPLOYMENT_TEMPLATE.md: Contains bulk-product-upload POST sample with
      action and product object.
- [ ] Optional: Run GET health check; if 503, follow PRE_LAUNCH_CHECKLIST §5.

## Curl Examples and Short Testing Checklist

**Base URL**

```
https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload
```

### 1. GET (health check — no auth)

**PowerShell:**

```powershell
Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

**Bash / Git Bash (with status code):**

```sh
curl -s -w "\n%{http_code}" "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

**Result/Meaning**

- 200 + body like {"status":"ok","message":"Shopify secrets configured"}:
  Secrets OK; function healthy.
- 503 + message about SHOPIFY_STORE_DOMAIN / SHOPIFY_ACCESS_TOKEN: Set both
  secrets in Supabase → Edge Functions → Secrets (see
  docs/PRE_LAUNCH_CHECKLIST.md §5).

### 2. POST (create-shopify-product — auth required)

Replace YOUR_ADMIN_JWT with a real Supabase JWT (admin) or
SUPABASE_SERVICE_ROLE_KEY (for testing only).

**PowerShell:**

```powershell
$headers = @{
  "Authorization" = "Bearer YOUR_ADMIN_JWT"
  "Content-Type"  = "application/json"
}
$body = '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" -Method POST -Headers $headers -Body $body
```

**Bash / Git Bash:**

```sh
curl -s -w "\n%{http_code}" -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

**Status/Meaning**

- 200 / 201: Success; body has product or confirmation.
- 400: Validation error; check response body.
- 401 / 403: Use valid admin JWT or service_role.
- 503: Same as GET — fix secrets (PRE_LAUNCH_CHECKLIST §5).

### Short Testing Checklist

- [ ] Run GET; expect 200 (or 503 → add secrets → re-run).
- [ ] (Optional) Run POST with admin JWT or service_role; expect 200/201 or a
      clear 400/401/403.
- [ ] If 503 on GET or POST: add SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN
      in Supabase → Edge Functions → Secrets; re-run GET.
- [ ] Confirm README has "## Deployment" after Quick Start and NEXT_STEPS has
      health checks + PR/DNS/verify.

## Vercel Protection Bypass Header

See
**[DEPLOYMENT_TEMPLATE.md § Secrets / headers — Vercel bypass](DEPLOYMENT_TEMPLATE.md)**
for header name, value location, and steps.

## Deployment Documentation Workflow (git, from repo root)

**Unified patch:**\
deployment-docs.patch changes only NEXT_STEPS.md and docs/DEPLOYMENT_TEMPLATE.md
(not README). Stage those two by default.\
If you also applied readme-deployment.patch, add README.md:\
`git add README.md NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md`\
This matches `patches/README.md`, which uses the two-file add by default and
points here for the full PR description block.

```sh
git checkout -b docs/deployment-flow-and-health-check
git apply patches/deployment-docs.patch
# If it fails (e.g. files already match), inspect conflicts:
git apply --reject patches/deployment-docs.patch
git add NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md
# If you also applied readme-deployment.patch, use this instead: git add README.md NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md
git commit -m "docs: add Deployment section, NEXT_STEPS flow, and DEPLOYMENT_TEMPLATE

- README: Production-ready checklist, Deployment (health checks → 503 fix → PR → DNS → verify), bulk-product-upload curl
- NEXT_STEPS: Flow at a glance, health checks 1–5, PR/DNS/verify, PRE_LAUNCH §5 link
- docs/DEPLOYMENT_TEMPLATE: placeholders, concrete bulk-product-upload sample payload
- docs/PRE_LAUNCH_CHECKLIST: §5 secrets checklist + POST response interpretation"
git push -u origin docs/deployment-flow-and-health-check
```

- Base: main (or default branch)
- Compare: docs/deployment-flow-and-health-check
- Title: docs: Deployment flow, NEXT_STEPS, and bulk-product-upload health check
- Description: Use the PR description block from this file (Summary, Changes,
  Validation).

## Notes

- If git apply fails due to rejects, run
  `git apply --reject patches/deployment-docs.patch`, manually fix .rej / target
  files, then stage only the files you changed and re-run the commit/push steps.
- If you prefer the multiline commit message (with arrows and §) and PowerShell
  encoding causes issues, run the commit as a separate multiline command or use
  Git Bash/WSL.
- If push timed out (network/auth): from repo root run
  `git push -u origin docs/deployment-flow-and-health-check`, then open the PR
  (Base: main, Compare: docs/deployment-flow-and-health-check, title/description
  from this file).
- After push, open a PR with Base: main, Compare:
  docs/deployment-flow-and-health-check, and the title/description above. Or use
  the gh pr create command in the next section.

## Create PR via GitHub CLI

Use the PR description block from the "PR Description" section above. Save it to
a file (for example, pr-body.md) and run:

```sh
gh pr create --base main --head docs/deployment-flow-and-health-check \
  --title "docs: Deployment flow, NEXT_STEPS, and bulk-product-upload health check" \
  --body-file pr-body.md
```

Or open the PR in the GitHub UI and paste the PR description block (Summary,
Changes, Validation) into the description field.

## Other Patch Options

**README only:**

```sh
git apply patches/readme-deployment.patch
# Stage just README.md (adjust commit message).
git add README.md
```

**NEXT_STEPS only:**

```sh
git apply patches/NEXT_STEPS.patch
# Stage just NEXT_STEPS.md (adjust commit message).
git add NEXT_STEPS.md
```
