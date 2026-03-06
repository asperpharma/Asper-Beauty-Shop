# Domain & Shopify — Headless Setup

Asper Beauty Shop is **headless**: React/Vite on **Lovable** + **Shopify Storefront API**. This doc clarifies how domains and Shopify settings apply.

---

## 1. Ignore "Change target" in Shopify

**Verdict:** Do **not** use the "Change target" setting in Shopify Admin.

- **What it does:** Switches traffic between Shopify’s internal options (Liquid theme vs Hydrogen app).
- **Our setup:** The storefront is hosted on **Lovable**. Traffic is routed via **DNS** (e.g. GoDaddy), not via Shopify’s internal routing.
- **Action:** Leave the domain target as **Online Store** in Shopify. Do not change it to Hydrogen.

---

## 2. How targeting actually works (headless)

| What you control | Where |
|------------------|--------|
| **Storefront (main site)** | DNS at your registrar (e.g. GoDaddy): CNAME or A record for `www.asperbeautyshop.com` → **Lovable** host. |
| **Checkout** | Optional: subdomain (e.g. `checkout.asperbeautyshop.com`) pointed to Shopify for branded checkout. |
| **API / emails** | Shopify Domains: add the domain in **Settings → Domains** so checkout links and API/emails use your brand. |

You do **not** point the main storefront domain to Shopify in this architecture.

---

## 3. What to select in Shopify Domains

If you add `asperbeautyshop.com` (or a subdomain) in **Settings → Domains**:

- **Target:** Leave on **Online Store**.
- **Primary domain:** Can stay on the `.myshopify.com` domain or a checkout subdomain so API emails and notifications work as expected.

---

## Quick reference

- **Change target** → Ignore; not used for Lovable/React headless.
- **Storefront traffic** → DNS (registrar) points to Lovable.
- **Shopify Domains** → Used for branded checkout and API; target = Online Store.
