# Asper Beauty Shop — Live Verification Checklist

Use this checklist to verify all sites run correctly and Shopify is fully live.

---

## Quick links (your URLs)

| Service | URL |
|---------|-----|
| **Shopify Admin** | https://admin.shopify.com/store/lovable-project-milns |
| **Shopify Orders** | https://admin.shopify.com/store/lovable-project-milns/orders |
| **Shopify Settings** | https://admin.shopify.com/store/lovable-project-milns/settings |
| **Supabase** | https://rgehleqcubtmcwyipyvi.supabase.co |
| **Health Check (Bulk Upload)** | https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload |
| **Main site (Lovable live)** | https://https-www-asperbeautyshop-com.lovable.app |
| **Custom domain** | https://www.asperbeautyshop.com |
| **Gorgias** | https://app.gorgias.com |

---

## 1. Local dev — run perfectly

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
npm install
npm run dev
```

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts on http://localhost:8080
- [ ] Homepage loads, products show from Shopify
- [ ] Add to cart works
- [ ] Checkout redirects to Shopify

---

## 2. Build — production build succeeds

```powershell
npm run build
```

- [ ] Build completes with no errors
- [ ] `dist/` folder created
- [ ] `npm run preview` serves the build locally

---

## 3. Shopify store — full setup and live

### In Shopify Admin (https://admin.shopify.com/store/lovable-project-milns):

| # | Item | Where | Status |
|---|------|-------|--------|
| 1 | **Store details** | Settings → Store details | [ ] Name, email, address, timezone, currency set |
| 2 | **Payment methods** | Settings → Payments | [ ] At least one method active (Shopify Payments, PayPal, or Manual/COD) |
| 3 | **Shipping** | Settings → Shipping and delivery | [ ] Zones and rates added (e.g. 3 JOD standard, free over 50 JOD) |
| 4 | **Products** | Products | [ ] Products imported and published |
| 5 | **Plan & go live** | Settings → Plan | [ ] Paid plan selected |
| 6 | **Password off** | Online Store → Preferences | [ ] Password protection disabled |

### Make store live (short steps)

1. **Settings → Plan** → choose plan, complete billing
2. **Online Store → Preferences** → turn OFF "Password protection" → Save

---

## 4. Environment variables — all set

### Local (`.env`)

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SHOPIFY_STORE_DOMAIN` = `lovable-project-milns.myshopify.com`
- [ ] `VITE_SHOPIFY_STOREFRONT_TOKEN`
- [ ] `VITE_SHOPIFY_API_VERSION` = `2025-07`

### Production (Lovable / host)

- [ ] Same variables set in production environment

### Supabase Edge Function secrets (for Bulk Upload)

- [ ] `SHOPIFY_STORE_DOMAIN` = `lovable-project-milns.myshopify.com`
- [ ] `SHOPIFY_ACCESS_TOKEN` = Admin API token (if using Bulk Upload)

### External services — add main site URL

- [ ] **Supabase Auth** (Authentication → URL Configuration): Add redirect URL `https://https-www-asperbeautyshop-com.lovable.app/**`
- [ ] **hCaptcha** (Site Settings): Add domain `https-www-asperbeautyshop-com.lovable.app`
- [ ] **Shopify** (Settings → Domains): Main store domain / checkout redirect if needed

---

## 5. Health checks

| Endpoint | Expected | Command |
|----------|----------|---------|
| Bulk upload | 200 | `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"` |
| Beauty Assistant | 200, `{"status":"active"}` | `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"` |
| Main site | 200 | Open https://https-www-asperbeautyshop-com.lovable.app |

---

## 6. Monitor checklist

See `c:\Users\C-R\Desktop\monitor-checklist.md` for daily/weekly monitoring (Shopify orders, Gorgias, chat_logs, beauty_assistant_audit, health URL).

---

*Created: Feb 13, 2025*
