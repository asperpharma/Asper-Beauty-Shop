# Deployment / health-check template (placeholders)

Use this when reusing the flow in another repo or when you want to plug in your
own URLs and doc names. **This project:** real function URL is filled in and
ready to copy-paste; auth stays placeholder or env var. **Other projects:** copy
the structure and do minimal find-replace (URL, doc names).

---

## 1. Patch with doc name placeholders

Where the docs reference each other, you can use placeholders instead of real
filenames so another project can substitute its own paths:

| Placeholder                   | Replace with (this repo)     | Use for                                        |
| ----------------------------- | ---------------------------- | ---------------------------------------------- |
| `{{SHOPIFY_SETUP_CHECKLIST}}` | `SHOPIFY_SETUP_CHECKLIST.md` | Link to Shopify setup and pre-launch checklist |
| `{{CONNECTION_STATUS}}`       | `CONNECTION_STATUS.md`       | Link to integration status                     |

**Patch with placeholders (leave unchanged):** Keep
`{{SHOPIFY_SETUP_CHECKLIST}}` and `{{CONNECTION_STATUS}}` as-is in the snippet
below when you copy the patch to another repo; replace them only when you know
that repo’s doc paths.

**Example snippet (placeholders):**

```markdown
After steps 1–4 pass, continue with:

- **Shopify pre-launch** (optional): See {{SHOPIFY_SETUP_CHECKLIST}} § Before
  you go live.
- **Step 1: Create PR** → merge to `main`.
- **Step 2: DNS** → CNAME www → your-app.lovable.app (optional).
- **Step 3: Verify deployment** → test URLs; see {{CONNECTION_STATUS}} for
  integration status.
```

Replace `{{SHOPIFY_SETUP_CHECKLIST}}` and `{{CONNECTION_STATUS}}` with your
actual doc paths (e.g. `SHOPIFY_SETUP_CHECKLIST.md` and `CONNECTION_STATUS.md`)
or leave as-is and do a find-replace when copying to another repo.

---

## 2. Useful curl examples (Edge Functions)

**Filled in for this project:** All examples use the actual project ref and
function path. Only the auth key is placeholder or env var.

### Bulk product upload (Edge Function)

**POST with placeholder (replace `{{AUTH_HEADER}}` with your admin user JWT; do
not commit this token):**

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer {{AUTH_HEADER}}" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

**Using an environment variable:**

```bash
export ADMIN_TOKEN="your-admin-jwt-here"
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

### GET health check (no auth)

```bash
curl -s "{{FUNCTION_URL}}"
```

**With this project’s URL filled in:**

```bash
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

- **200** = secrets OK
- **503** = set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` in Supabase →
  Edge Functions → Secrets (see {{SHOPIFY_SETUP_CHECKLIST}}).

**Full commit/PR flow and Vercel bypass:**
[DEPLOY_COMMIT_AND_TEST.md](DEPLOY_COMMIT_AND_TEST.md).

---

## Secrets / headers — Vercel bypass

If your deployment uses Vercel Deployment Protection (e.g. staging or preview),
configure the bypass so crawlers and webhooks can reach the app:

- **Header name:** `x-vercel-protection-bypass`
- **Value:** In Vercel → Project → Settings → Deployment Protection. Do not
  commit this value.

**Steps to set or change the value:**

1. Vercel dashboard → your project → **Application Settings**.
2. Choose the environment (production, preview, etc.).
3. Set the required HTTP header for bypass.

**Example:**

```http
x-vercel-protection-bypass: your-secret-value
```

Use a strong, unpredictable value; treat it as a secret. Ensure any caller
(crawler, webhook, health-check) sends this header to avoid 401.
