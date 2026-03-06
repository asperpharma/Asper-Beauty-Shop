# Asper Beauty Shop: Operational Launch Plan

This plan integrates your **Lovable frontend** (the "Gold Stitch" / Soft Ivory
design) with the **Shopify backend** (the 5,000-product engine). Account:
**asperpharma**.

**Related checklists:** [Master Launch Checklist](MASTER_LAUNCH_CHECKLIST.md) ·
[Shopify Setup Checklist](../SHOPIFY_SETUP_CHECKLIST.md) ·
[Pre-launch Checklist](PRE_LAUNCH_CHECKLIST.md) ·
[One-page printable checklist](LAUNCH_CHECKLIST_ONE_PAGE.md)

---

## 1. Shopify store setup

**Goal:** Establish the secure backend foundation for the business.

| Role             | Tool                                     |
| ---------------- | ---------------------------------------- |
| **Primary**      | **Shopify Admin** (Account: asperpharma) |
| **Alternatives** | BigCommerce, Wix eCommerce               |

**Asper note:** Enable **2-Factor Authentication** on the Shopify account. This
is the "Vault" for your customer data. Storefront is the Lovable app; Shopify is
your backend for products, cart, and checkout. See
[SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md).

---

## 2. Bulk product import (the 5,000 SKUs)

**Goal:** Upload your catalog (Vichy, Maybelline, etc.) with correct images and
tags.

| Role            | Tool                                                                 |
| --------------- | -------------------------------------------------------------------- |
| **Primary**     | **Matrixify** (best for complex image links and preventing timeouts) |
| **Alternative** | Shopify native CSV import (good for small updates)                   |

**Asper note:** Once products are in Shopify, trigger your **Supabase
`bulk-product-upload` Edge Function**. That syncs data to your "Digital
Concierge" so it knows what to recommend. Check image links and variants before
finalizing.\
**Tool link:** [Appendix A — Links to tools](#appendix-a-links-to-tools).

---

## 3. Domain connection

**Goal:** Professionalize the URL (remove .myshopify.com).

| Role             | Tool                                    |
| ---------------- | --------------------------------------- |
| **Primary**      | **GoDaddy** (your current provider)     |
| **Alternatives** | Namecheap, Google Domains (Squarespace) |

**Action:** Update DNS records to point to your store/app. For the Lovable app:
CNAME `www` → `asperbeautyshop.lovable.app` (or your production URL). See
[NEXT_STEPS.md § Step 2](../NEXT_STEPS.md).

---

## 4. Payment gateway configuration

**Goal:** Capture revenue securely.

| Role             | Tool                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Primary**      | **Cash on Delivery (COD)** (critical for local trust) + **Shopify Payments** (credit cards) |
| **Alternatives** | Stripe, Checkout.com (if Shopify Payments is unavailable in your region)                    |

**Asper note:** Ensure the **"Thank You" page for COD orders** explicitly says
**"Your order is confirmed."** In-app COD is already implemented (cart → Cash on
delivery → Supabase Edge Function). See
[MASTER_LAUNCH_CHECKLIST.md § Payment](MASTER_LAUNCH_CHECKLIST.md#1-payment-gateway).

---

## 5. Shipping & fulfillment

**Goal:** Profitable logistics.

| Role             | Tool                                                 |
| ---------------- | ---------------------------------------------------- |
| **Primary**      | **Shopify Shipping Settings**                        |
| **Alternatives** | Easyship (international), Aramex (local integration) |

**Strategy:**

- **Flat rate:** 3 JOD (Standard Delivery).
- **Free shipping:** On orders over 50 JOD (incentivizes bundles).

**Asper note:** In-app COD uses the same logic: 50 JOD free-shipping threshold,
3 JOD below. Configure in **Shopify → Settings → Shipping and delivery**. See
[MASTER_LAUNCH_CHECKLIST.md § Shipping](MASTER_LAUNCH_CHECKLIST.md#2-shipping-zones-and-rates).

---

## 6. Legal & trust pages

**Goal:** Protect the business and build "Pharmacist Level" trust.

| Role             | Tool                                |
| ---------------- | ----------------------------------- |
| **Primary**      | **Shopify Policy Generator** (free) |
| **Alternatives** | Termly, GetTerms                    |

**Asper note:** Customize the **Refund Policy** to state: _"Due to health
standards, opened skincare products cannot be returned. We guarantee 100%
authenticity."_ Ready-to-paste wording:
[docs/POLICY_DRAFTS.md](POLICY_DRAFTS.md).

---

## 7. Theme & branding (the "Ivory & Gold" store)

**Goal:** Visual dominance — "Gold Stitch" & "Soft Ivory" frontend.

| Role          | Tool                                             |
| ------------- | ------------------------------------------------ |
| **Primary**   | **Lovable** (your custom frontend)               |
| **Secondary** | Shopify Dawn theme (backend/fallback storefront) |

**Asper note:** Ensure `tailwind.config.ts` has the exact hex codes: **Soft
Ivory `#F8F8FF`**, **Maroon `#800020`** (Premium Pharmacy palette). They are
already defined in this repo. Main storefront = Lovable app; Shopify theme only
if you use a Shopify-hosted storefront.

---

## 8. Live chat / Digital Concierge

**Goal:** The "3-Click Solution" for skin analysis.

| Role             | Tool                                            |
| ---------------- | ----------------------------------------------- |
| **Primary**      | **Gorgias** (best for Shopify integration)      |
| **Alternatives** | Tidio, ManyChat (Instagram/WhatsApp automation) |

**Asper note:** Script the bot to act as a **"Pharmacist,"** not a salesperson.\
**Tool link:** [Appendix A — Links to tools](#appendix-a-links-to-tools).

---

## 9. Checkout & trust badges

**Goal:** Reduce cart abandonment.

| Role            | Tool                                                        |
| --------------- | ----------------------------------------------------------- |
| **Primary**     | **Shopify Checkout** (native)                               |
| **Alternative** | Ultimate Trust Badges app (Visa/Mastercard logos in footer) |

**Asper note:** Add a custom line in the checkout footer: **"Guaranteed
Authentic & Temperature Controlled."** (Configure in Shopify Checkout settings
or theme if available.)

---

## 10. Domain & SSL check

**Goal:** Security verification.

| Where        | Action                                                                                |
| ------------ | ------------------------------------------------------------------------------------- |
| **Browser**  | Look for the **green padlock** (HTTPS).                                               |
| **Shopify**  | **Settings → Domains**: set custom domain as **Primary**; confirm **Secured** status. |
| **External** | **SSL Labs’ SSL Server Test** — verify certificate for your domain.                   |

**Action:** Verify SSL is active on **www.asperbeauty.com** (or your live
domain).

---

## 11. Test & launch (the "Stress Test")

**Goal:** Verify the flow before real traffic hits.

| Step | Action                                                                                     |
| ---- | ------------------------------------------------------------------------------------------ |
| 1    | Open an **Incognito** window.                                                              |
| 2    | Order a **low-cost item** (e.g. Essence Mascara).                                          |
| 3    | Select **COD**.                                                                            |
| 4    | Check the **confirmation email** for the Maroon logo and "Your order is confirmed."        |
| 5    | Confirm order appears in **Shopify Admin** and staff receive notification.                 |
| 6    | Browse storefront: load speed, mobile, product images, trust badges, footer legal/contact. |

See [NEXT_STEPS.md § Run these health checks](../NEXT_STEPS.md) for build, lint,
and Edge Function health.

---

## Quick reference mapping

| Step  | Focus                   | Doc / Status                                                              |
| ----- | ----------------------- | ------------------------------------------------------------------------- |
| 1–3   | Store, products, domain | [SHOPIFY_SETUP_CHECKLIST](../SHOPIFY_SETUP_CHECKLIST.md) — 🚧 In progress |
| 4–5   | Payments & shipping     | [MASTER_LAUNCH_CHECKLIST](MASTER_LAUNCH_CHECKLIST.md) — 📝 Drafted        |
| 6     | Legal & policies        | [POLICY_DRAFTS](POLICY_DRAFTS.md) — 📋 Ready to paste                     |
| 7     | Theme (Ivory & Gold)    | `tailwind.config.ts` (codebase) — ✅ Done                                 |
| 8–9   | Chat & badges           | This doc + [Appendix A](#appendix-a-links-to-tools)                       |
| 10–11 | SSL & launch test       | [OPERATIONAL_LAUNCH_PLAN](OPERATIONAL_LAUNCH_PLAN.md) — 📍 You are here   |

---

## Appendix A: Links to tools

Direct setup links for the main tools in this plan.

| Tool                         | Purpose                                            | Link                                                                                                                                                |
| ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shopify Admin**            | Store, products, payments, shipping                | [admin.shopify.com](https://admin.shopify.com) (store: asperpharma)                                                                                 |
| **Matrixify**                | Bulk product import with images                    | [Matrixify (Excelify) on Shopify App Store](https://apps.shopify.com/matrixify)                                                                     |
| **Shopify Policy Generator** | Privacy, Refund, Terms, Shipping policies          | **Shopify Admin → Settings → Policies** or [Shopify Help: Create policies](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos) |
| **Gorgias**                  | Live chat + e‑commerce support / Digital Concierge | [Gorgias for Shopify](https://www.gorgias.com/shopify)                                                                                              |
| **Ultimate Trust Badges**    | Trust seals / payment logos for footer             | [Shopify App Store: Ultimate Trust Badges](https://apps.shopify.com/ultimate-trust-badges)                                                          |
| **SSL Labs**                 | Verify SSL certificate                             | [SSL Server Test](https://www.ssllabs.com/ssltest/)                                                                                                 |

---

## 🛠️ Appendix B: Direct Tool Links

Quick access during launch. Tailored for **asperpharma** and **Ivory & Gold**
setup.

**Setup & Import**

- **Shopify Login:** [accounts.shopify.com](https://accounts.shopify.com) (User:
  asperpharma)
- **Matrixify (Bulk Import):**
  [apps.shopify.com/excel-export-import](https://apps.shopify.com/excel-export-import)
- **Supabase Dashboard:**
  [supabase.com/dashboard](https://supabase.com/dashboard) (For Edge Function
  logs)

**Operations & Legal**

- **GoDaddy DNS:**
  [dcc.godaddy.com/control/portfolio](https://dcc.godaddy.com/control/portfolio)
- **Shopify Shipping:**
  [admin.shopify.com/settings/shipping](https://admin.shopify.com/settings/shipping)
- **Policy Generator:**
  [admin.shopify.com/settings/legal](https://admin.shopify.com/settings/legal)

**Customer Experience**

- **Lovable (Frontend):** [lovable.dev/projects](https://lovable.dev/projects)
- **Gorgias (Concierge):**
  [apps.shopify.com/helpdesk](https://apps.shopify.com/helpdesk)
- **Ultimate Trust Badges:**
  [apps.shopify.com/trust-badge](https://apps.shopify.com/trust-badge)

---

**Next:** [One-page printable checklist](LAUNCH_CHECKLIST_ONE_PAGE.md) ·
[Pharmacist-vetted policy drafts](POLICY_DRAFTS.md)
