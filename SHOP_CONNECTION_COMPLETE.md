# Asper Beauty Shop — Complete Shop Connection

Use this checklist to ensure the store is fully connected and ready for customers.

---

## Connection status

| System | Status | How it connects |
|--------|--------|-----------------|
| **Shopify Store** | lovable-project-milns.myshopify.com | Products, cart, checkout |
| **Main site** | https://https-www-asperbeautyshop-com.lovable.app | Headless storefront |
| **Supabase** | rgehleqcubtmcwyipyvi | Auth, Edge Functions, COD orders |
| **Beauty Assistant** | Edge Function + webhook | Chat on site + Gorgias/ManyChat |

---

## 1. Shopify Admin — complete these

**Go to:** https://admin.shopify.com/store/lovable-project-milns

| # | Task | Where | Done |
|---|------|-------|------|
| 1 | **Store details** | Settings → Store details | [ ] Name, email, address, timezone, currency |
| 2 | **Payments** | Settings → Payments | [ ] At least one active (Shopify Payments, PayPal, or COD) |
| 3 | **Shipping** | Settings → Shipping and delivery | [ ] Zones + rates (e.g. 3 JOD, free over 50 JOD) |
| 4 | **Products** | Products | [ ] Products imported and published |
| 5 | **Password off** | Online Store → Preferences | [ ] Password protection OFF |
| 6 | **Plan** | Settings → Plan | [ ] Paid plan when going live |

### Checkout redirect (optional)

After checkout, customers land on Shopify’s thank-you page. To send them back to your site:

1. **Settings → Checkout → Order status page**
2. Add a “Continue shopping” button or redirect link to:  
   `https://https-www-asperbeautyshop-com.lovable.app`

---

## 2. Environment variables — all set

### Local (`.env`)

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SHOPIFY_STORE_DOMAIN` = `lovable-project-milns.myshopify.com`
- [ ] `VITE_SHOPIFY_STOREFRONT_TOKEN`
- [ ] `VITE_SHOPIFY_API_VERSION` = `2025-07`

### Production (Lovable)

Set in **Lovable Dashboard** → Project → Environment Variables (or use `.env.production`):

- [ ] Same as above
- [ ] `VITE_SITE_URL` = `https://https-www-asperbeautyshop-com.lovable.app`

---

## 3. Supabase Edge Function secrets

For **Bulk Upload** (admin product import):

| Secret | Value |
|--------|-------|
| `SHOPIFY_STORE_DOMAIN` | `lovable-project-milns.myshopify.com` |
| `SHOPIFY_ACCESS_TOKEN` | Admin API token (shpat_...) |

Set in: **Supabase** → Project Settings → Edge Functions → Secrets

---

## 4. Test the connection

### Products

1. Open https://https-www-asperbeautyshop-com.lovable.app
2. Products should load from Shopify
3. Collections, search, and filters should work

### Cart & checkout

1. Add a product to cart
2. Click **Checkout** → opens Shopify checkout in new tab
3. Complete (or abandon) checkout
4. Return to site → cart should sync/clear as expected

### COD (Cash on delivery)

1. Add product → Cart → Cash on delivery
2. Fill form → Submit
3. Order should appear in Supabase `cod_orders` table

---

## 5. Health checks

```powershell
# Bulk upload (expect 200)
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"

# Beauty Assistant (expect 200, {"status":"active"})
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"
```

---

## 6. Related docs

- [SHOPIFY_SETUP_CHECKLIST.md](SHOPIFY_SETUP_CHECKLIST.md) — Full Shopify setup
- [LIVE_VERIFICATION_CHECKLIST.md](LIVE_VERIFICATION_CHECKLIST.md) — Pre-launch verification
- [docs/OPERATIONS_MASTER.md](docs/OPERATIONS_MASTER.md) — Quick links and monitoring

---

*Last updated: Feb 2025*
