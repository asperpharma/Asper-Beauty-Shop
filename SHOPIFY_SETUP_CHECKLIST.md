# Shopify full setup checklist

Use this to confirm your Shopify store is fully set up so you can start using
the shop. For a full 11-step operational launch plan (domain, payments,
shipping, legal, theme, chat, SSL, test), see
[docs/OPERATIONAL_LAUNCH_PLAN.md](docs/OPERATIONAL_LAUNCH_PLAN.md).

---

## 1. Storefront (browsing, cart, checkout) – already configured

| Item                    | Status | Where it’s set                                                                       |
| ----------------------- | ------ | ------------------------------------------------------------------------------------ |
| Store domain            | ✅     | `VITE_SHOPIFY_STORE_DOMAIN` or `VITE_SHOPIFY_STORE` in `.env` (fallback: demo store) |
| API version             | ✅     | `VITE_SHOPIFY_API_VERSION` in `.env` (default: `2025-07`)                            |
| Storefront access token | ✅     | `VITE_SHOPIFY_STOREFRONT_TOKEN` in `.env` (fallback: demo token)                     |

These are used for:

- Listing products on the site
- Search
- Add to cart and Shopify checkout

No code change needed here unless you switch to **your own** Shopify store (see
section 4).

---

## 2. Shopify Admin – do this in the Shopify dashboard

1. **Log in to Shopify**
   - Go to [admin.shopify.com](https://admin.shopify.com) and open the store:
     **lovable-project-milns**.

2. **Store details**
   - **Settings → Store details**: set your store name, contact email, address,
     timezone, currency.

3. **Payments**
   - **Settings → Payments**: add at least one payment provider (Shopify
     Payments, PayPal, etc.) so “Checkout” works when customers pay.

4. **Shipping** (if you ship products)
   - **Settings → Shipping and delivery**: add shipping zones and rates.

5. **Products**
   - **Products**: add or import products. The site will show whatever is
     published in this store.

6. **Storefront API token** (only if you create a new store or regenerate the
   token)
   - **Settings → Apps and sales channels → Develop apps** (or “Develop apps for
     your store”) → create or open an app → **Configure Storefront API scopes**.
   - Ensure at least: `unauthenticated_read_product_listings`,
     `unauthenticated_read_product_inventory`,
     `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
   - Create a **Storefront API access token** and put it in your app (see
     section 4 if you use env vars).

Once these are done, the store is “full setup” for normal selling (browsing,
cart, checkout).

---

## 3. Bulk product upload (admin only) – optional

The **Bulk Upload** feature (admin) uses the **Shopify Admin API** and needs an
**Admin API** token.

| Item                   | Status             | Action                               |
| ---------------------- | ------------------ | ------------------------------------ |
| `SHOPIFY_ACCESS_TOKEN` | ⚠️ Set in Supabase | Required only if you use Bulk Upload |

Steps:

1. In Shopify: **Settings → Apps and sales channels → Develop apps** → create or
   open an app.
2. Under **Admin API integration**, configure scopes (e.g. `write_products`,
   `read_products`).
3. Install the app and get the **Admin API access token**.
4. In **Supabase**: Project → **Project Settings** → **Edge Functions** →
   **Secrets**.
5. Add: `SHOPIFY_ACCESS_TOKEN` = your Admin API access token.

If you don’t set this, the rest of the site still works; only Bulk Upload to
Shopify will fail until the secret is set.

---

## 4. Using your own Shopify store (e.g. Asper Beauty)

The app reads Shopify settings from **environment variables**, so you can switch
to your own store without changing code.

### Step 1: Create tokens in your Shopify store

1. Log in to **your** store at [admin.shopify.com](https://admin.shopify.com).
2. **Storefront API token** (for the website):
   - **Settings → Apps and sales channels → Develop apps** → create or open an
     app.
   - **Configure Storefront API scopes**: at least
     `unauthenticated_read_product_listings`,
     `unauthenticated_read_product_inventory`,
     `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
   - Create a **Storefront API access token** and copy it.
3. **Admin API token** (only if you use Bulk Upload):
   - Same app (or another) → **Admin API integration** → scopes e.g.
     `write_products`, `read_products`.
   - Install the app, get the **Admin API access token** and copy it.

### Step 2: Set environment variables for the frontend

Set these so the site uses your store (domain only, no `.myshopify.com` suffix
if you use a custom domain—use your **myshopify.com** store domain):

**Local (`.env`):**

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-api-token
VITE_SHOPIFY_API_VERSION=2025-07
```

You can use `VITE_SHOPIFY_STORE` instead of `VITE_SHOPIFY_STORE_DOMAIN`; both
are supported.

**Production (e.g. Lovable / your host):**\
Set the same variables in your production environment so the built app uses your
store.

### Step 3: Bulk upload (optional)

If you use **Bulk Upload**, set these in **Supabase** → **Project Settings** →
**Edge Functions** → **Secrets**:

| Secret                 | Value                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` (no `https://`; myshopify domain only)                                 |
| `SHOPIFY_ACCESS_TOKEN` | Your **Admin API** access token (e.g. `shpat_...` — keep secret, never commit or paste in public) |

The bulk-upload function validates these when you run **Create product in
Shopify**. If either is missing, it returns **400** with a clear error and hint.

**Set secrets via Supabase CLI (optional):**

```bash
# From project root, with Supabase CLI installed and linked
supabase secrets set SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
```

Or from a file (do not commit this file):

```bash
# .env.secrets (add to .gitignore)
# SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
# SHOPIFY_ACCESS_TOKEN=shpat_...

supabase secrets set --env-file .env.secrets
```

**After saving secrets:** Redeploy or invoke the Edge Function so it picks up
the new values. If logs show a missing env var, double-check the secret names in
**Project Settings → Edge Functions → Secrets**.

---

## 5. Quick verification

- **Products on site**\
  Run the app (`npm run dev`), open the homepage and category pages. You should
  see products from your Shopify store.

- **Cart and checkout**\
  Add a product to cart and click checkout. You should be redirected to Shopify
  checkout. If you see “Payment required” (402), complete **Payments** in
  Shopify (section 2, step 3).

- **Bulk upload** (if you use it)\
  Log in as admin, go to Bulk Upload, try uploading one product. If it fails
  with “SHOPIFY_ACCESS_TOKEN is not configured”, add the secret in Supabase
  (section 3).

---

**Full connection checklist:** [SHOP_CONNECTION_COMPLETE.md](SHOP_CONNECTION_COMPLETE.md)

---

## 6. Health check, testing, and rotating secrets

### Health-check endpoint (GET)

The **bulk-product-upload** Edge Function exposes a **GET** endpoint that does
not require auth:

- **200**: Both `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` are set and
  valid (domain has no `https://`).
- **503**: One or both secrets missing or invalid (e.g. domain contains a
  protocol).

Example:

```bash
curl -s "https://PROJECT_REF.supabase.co/functions/v1/bulk-product-upload"
```

Use this for monitoring or after deploying to confirm secrets are loaded.

### Local script to test validation

A script simulates the health check and (optionally) the
**create-shopify-product** action to confirm validation behavior. The
health-check uses the same validation rules as **create-shopify-product** via
`isShopifyConfigValid()`, so behavior is consistent.

**Prerequisites:** Node 18+ (or Deno).

**Make the script executable (Unix / macOS / WSL / Git Bash):**

```bash
chmod +x scripts/test-bulk-upload-validation.mjs
```

**1. Set the function URL:**

```bash
# Deployed
export BULK_UPLOAD_URL="https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"

# Or local (run in another terminal: supabase functions serve bulk-product-upload)
export BULK_UPLOAD_URL="http://localhost:54321/functions/v1/bulk-product-upload"
```

**2. Run the script:**

```bash
node scripts/test-bulk-upload-validation.mjs
```

Or use the npm script (works on Windows without chmod): set `BULK_UPLOAD_URL` in
the environment, then `npm run test:bulk-upload`.

**Run while serving locally (two terminals):**

Terminal 1 — serve the function:

```bash
supabase functions serve bulk-product-upload
```

Terminal 2 — run the script against local URL:

```bash
BULK_UPLOAD_URL="http://localhost:54321/functions/v1/bulk-product-upload" node scripts/test-bulk-upload-validation.mjs
```

- With only `BULK_UPLOAD_URL`: runs **GET** and prints 200 or 503 (and body).
- With **ADMIN_TOKEN** (admin user JWT): also sends **POST** with
  `action: "create-shopify-product"`; expects **400** when secrets are missing
  (confirms validation).

```bash
ADMIN_TOKEN=eyJ... node scripts/test-bulk-upload-validation.mjs
```

After you add or change the GET route, test locally with
`supabase functions serve bulk-product-upload` and the script above.

### Remove or rotate secrets (Supabase CLI)

All commands below require you to be **logged in** (`supabase login`) and to use
a **linked project** (`SUPABASE_PROJECT_REF` or `supabase link`). Secret
**values** are never printed by `supabase secrets list` for security.

**Remove secrets:**

```bash
supabase secrets remove SHOPIFY_ACCESS_TOKEN
supabase secrets remove SHOPIFY_STORE_DOMAIN
```

**Rotate token:**

1. Create a new Admin API token in Shopify (or a new app), and copy the new
   `shpat_...` value.
2. Set the new secret (overwrites the previous value for that name):

   ```bash
   supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_NEW_TOKEN
   ```

3. Redeploy or invoke the Edge Function so it uses the new token.
4. Optionally revoke the old token in the Shopify admin.

**Rotate domain:**

```bash
supabase secrets set SHOPIFY_STORE_DOMAIN=new-store.myshopify.com
```

Do **not** include `https://` — use only the myshopify domain (e.g.
`new-store.myshopify.com`). Redeploy or invoke the function after changing.

**List secrets (names only):**

```bash
supabase secrets list
```

---

## Payments and shipping (tackle first)

Without at least one payment method, customers can’t complete **Shopify
Checkout**. Your app also has **in-app COD** (cart → Cash on delivery →
`create-cod-order` → `cod_orders`). Do these in **Shopify Admin** so both paths
work.

### 1. Enable cash on delivery (COD)

**In-app COD (already working)**

- Cart → “Cash on delivery” → `CODCheckoutForm` → Edge Function
  `create-cod-order` → row in `cod_orders`. No Shopify payment needed for this
  path.

**COD in Shopify Checkout (optional)**\
If you want “Cash on delivery” as an option when the customer is on
**Shopify’s** checkout page:

1. **Shopify Admin** → **Settings** → **Payments**.
2. Under **Manual payment methods**, click **Add manual payment method**.
3. Add one named e.g. **“Cash on delivery”** (or “Pay on delivery”).
4. Set instructions if you want (e.g. “Pay when the order is delivered”).
5. Save. Customers will see it at checkout alongside any other methods.

### 2. Add other payment methods

So that **Checkout with Shopify** (card/online payment) works:

1. **Settings** → **Payments**.
2. **Shopify Payments** (if available in your region): complete setup (business
   details, bank account).
3. Or add **PayPal**, **alternative payment methods**, etc., as offered.
4. Ensure at least one method is **Active** so checkout doesn’t block with “No
   payment methods”.

### 3. Configure shipping and free-shipping threshold

1. **Settings** → **Shipping and delivery**.
2. **Shipping zones**: add the zone(s) you deliver to (e.g. Jordan), then add
   **rates** (e.g. “Standard 3 JOD”, “Express 5 JOD”).
3. **Free shipping over X**:
   - Add a **rate** named e.g. “Free shipping” with **Free** price.
   - Under **Conditions**, choose **Order weight** or **Order price** (e.g.
     “Minimum order price: 50 JOD”) so it only applies above your threshold.
   - Or use **Shipping profile** → **Add rate** → set minimum order amount
     there.

**In-app COD shipping (no Shopify change needed)**\
The app uses a **50 JOD** free-shipping threshold and **3 JOD** shipping below
that for the **COD** flow only (`CartDrawer.tsx`, `CODCheckoutForm.tsx`). To
change those, edit `FREE_SHIPPING_THRESHOLD` and `SHIPPING_COST` in those files.

---

## Before you go live (pre-launch checklist)

Verify these in **Shopify Admin** and in your **Asper Beauty Shop** app before
publishing.

| # | Item                             | Where to check / configure                                                                                                                                                                                                                                                                                                                                                    |
| - | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | **Products ready**               | **Shopify → Products**: Do you have your products imported (e.g. ~50 via CSV) with images? The storefront shows whatever is published here. You can use **Bulk Upload** in the app (admin) to push products to Shopify if Supabase Edge Function secrets are set.                                                                                                             |
| 2 | **Payment methods**              | **Shopify → Settings → Payments**: Add at least one method so Shopify Checkout works. For COD: in-app flow is already live; for COD in Shopify Checkout add a **Manual payment method**. Full steps: § **Payments and shipping (tackle first)** above.                                                                                                                        |
| 3 | **Shipping rates**               | **Shopify → Settings → Shipping and delivery**: Add zones and rates; set free-shipping threshold (e.g. min order 50 JOD). App COD uses 50 JOD / 3 JOD in code. See § **Payments and shipping (tackle first)**.                                                                                                                                                                |
| 4 | **Theme ready**                  | Your storefront is the **Asper Beauty Shop** app (Lovable); the Shopify “theme” is mainly for the Shopify-hosted checkout and any Shopify storefront you use. In **Shopify → Online Store → Themes**: confirm the theme is customized and tested if you use a Shopify storefront; otherwise focus on testing the app (asperbeautyshop.lovable.app / www.asperbeautyshop.com). |
| 5 | **Plan selected / password off** | **Shopify → Settings → Plan**: Select a paid plan when you’re ready to go live. **Remove password protection**: **Online Store → Preferences** → under “Password protection”, disable it so the store is public.                                                                                                                                                              |

**Publish store & remove password (short steps):**

1. **Shopify Admin** → **Settings** → **Plan** → choose a plan and complete
   billing.
2. **Online Store** → **Preferences** → turn **off** “Password protection” (and
   save).
3. Your store is now live; the Asper Beauty Shop app (with your store’s
   products) is already wired — just ensure **NEXT_STEPS.md** (health checks,
   PR, DNS, verify deployment) is done.

If you want to **check product import status** or **verify theme/checkout** in
more detail, do it from Shopify Admin (Products, Themes, Settings → Payments and
Shipping) and re-run the app’s health checks and deployment verification from
**NEXT_STEPS.md**.

---

## Summary

- **Storefront (shop use)**: Already configured for
  `lovable-project-milns.myshopify.com`. Finish in Shopify Admin: store details,
  **payments**, shipping, and products. Then you can start using the shop.
- **Bulk upload**: Optional; set `SHOPIFY_ACCESS_TOKEN` in Supabase Edge
  Function secrets if you use it.
- **Your own store**: Follow section 4 to point the app at your store and (if
  needed) update the bulk-upload function and secrets.
