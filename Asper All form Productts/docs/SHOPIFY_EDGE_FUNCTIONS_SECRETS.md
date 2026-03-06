# Shopify + Supabase Edge Functions: Secrets & Discovery

How to call Shopify from Edge Functions without putting secrets in the repo, and when to use Storefront vs Admin/Discovery.

---

## Rotate and store secrets

1. **In Shopify Admin:** Rotate any exposed `client_secret` (e.g. Admin → Settings → Apps and sales channels → Develop apps → your app → rotate client secret).
2. **In Supabase:** Set function secrets so they are never in the repo or client:
   - **SHOPIFY_CLIENT_ID**
   - **SHOPIFY_CLIENT_SECRET**
   - Optionally **SHOPIFY_SCOPES** if you later need OAuth installs.
3. **Keep existing Storefront/backend vars** in Edge Function secrets as needed:
   - **SHOPIFY_STORE_DOMAIN**
   - **SHOPIFY_STOREFRONT_TOKEN** (or **SHOPIFY_ACCESS_TOKEN**)

---

## When to use which API

| Need | Use | Secrets |
|------|-----|---------|
| Live catalog, product recommendations, inventory for Dr. Sami / Ms. Zain | **Storefront API** in `beauty-assistant` (or dedicated function) | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN` — no client_secret |
| Discovery / Admin endpoints (e.g. search_global_products) | **shopify-discovery** Edge Function (client-credentials) | `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` |

**Recommendation for "1 Brain, 2 Characters":** Prefer the **Storefront API** in `beauty-assistant` for live inventory and recommendations. Use the **shopify-discovery** function only when you have a concrete need for discovery/Admin endpoints.

---

## shopify-discovery Edge Function

**Purpose:** Server-side only. Gets a client-credentials token and calls Shopify discovery API (e.g. `search_global_products`). Keeps client ID/secret out of the repo.

**Secrets (Supabase Dashboard → Edge Functions → shopify-discovery → Secrets):**
- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`

**Deploy:**
```bash
supabase secrets set SHOPIFY_CLIENT_ID=<your_id> SHOPIFY_CLIENT_SECRET=<your_rotated_secret>
supabase functions deploy shopify-discovery
```

**Call:**
- **Method:** POST  
- **URL:** `https://<PROJECT_REF>.supabase.co/functions/v1/shopify-discovery`  
- **Body:** `{ "query": "", "context": "", "limit": 10 }`  
- **Response:** JSON from the discovery API.

**Code:** `supabase/functions/shopify-discovery/index.ts`

---

## Immediate actions if secrets were exposed

1. **Rotate** the exposed Shopify `client_secret` in Admin.
2. **Remove** any committed secrets from repo history (e.g. `git filter-branch` or BFG; then force-push and rotate keys again).
3. **Confirm** whether you actually need the discovery endpoint. If not, rely on the Storefront API in `beauty-assistant` and leave `shopify-discovery` undeployed or unused.
