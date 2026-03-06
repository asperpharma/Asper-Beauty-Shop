# Master Launch Checklist

Use this checklist **before deploying the new Premium Pharmacy look** so
payment, shipping, and health checks are correctly configured.

---

## 1. Payment gateway

Your app uses **Shopify Checkout** for card/online payments and **in-app COD**
for cash on delivery. No Stripe/PayPal integration in code — both are configured
in Shopify.

| Step                 | What to do                                                                                                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shopify Checkout** | **Shopify Admin** → **Settings** → **Payments**. Enable **Shopify Payments** (or PayPal / other methods) so “Checkout with Shopify” works. At least one method must be **Active**. |
| **COD in Shopify**   | Optional: **Payments** → **Manual payment methods** → add “Cash on delivery” so it appears on Shopify’s checkout page.                                                             |
| **In-app COD**       | Already works (cart → Cash on delivery → Edge Function). No extra config.                                                                                                          |

**Verify:** Add a test product, go to checkout (both “Checkout with Shopify” and
“Cash on delivery” if you use both), and confirm you can complete an order.

---

## 2. Shipping zones and rates

| Step                    | What to do                                                                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zones & rates**       | **Shopify Admin** → **Settings** → **Shipping and delivery**. Add zone(s) (e.g. Jordan) and rates (e.g. Standard 3 JOD, Express 5 JOD).                                            |
| **Free shipping**       | Add a “Free shipping” rate with **Conditions** (e.g. minimum order 50 JOD) so it only applies above your threshold.                                                                |
| **In-app COD shipping** | App uses **50 JOD** free-shipping threshold and **3 JOD** below that. To change: edit `FREE_SHIPPING_THRESHOLD` and `SHIPPING_COST` in `CartDrawer.tsx` and `CODCheckoutForm.tsx`. |

**Verify:** Create a cart above and below the free-shipping threshold and
confirm shipping cost and free shipping appear correctly at checkout.

---

## 3. Theme and design (Premium Pharmacy)

| Step              | What to check                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design tokens** | `tailwind.config.ts`: `maroon`, `soft-ivory`, `shiny-gold`, `dark-charcoal`; fonts `display` (Playfair), `body` (Montserrat), `arabic` (Tajawal). |
| **Global styles** | `src/index.css`: body `bg-soft-ivory text-dark-charcoal font-body`; headings `font-display text-maroon`; RTL `font-arabic`.                       |
| **Product cards** | White card, gold border on hover, “Verified” badge when tagged, “Add to Regimen” CTA.                                                             |

**Verify:** Open the storefront; confirm background is soft ivory, product cards
show the gold hover border and correct typography, and RTL (Arabic) uses
Tajawal.

---

## 4. Deploy & health (Edge secrets, commit/deploy, health checks, go-live)

| Step                              | What to do                                                                                                                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Edge Function secrets**         | Supabase → Edge Functions → Secrets: set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ACCESS_TOKEN` (and `LOVABLE_API_KEY` for Beauty Assistant if used). See **docs/PRE_LAUNCH_CHECKLIST.md** § 5.                                |
| **Commit and deploy flow**        | Branch, apply patches if needed, `git add`, commit, push, open PR, merge to `main`. See **docs/DEPLOY_COMMIT_AND_TEST.md**.                                                                                            |
| **Health checks**                 | Run GET bulk-product-upload (expect 200); optional POST with admin JWT. See **NEXT_STEPS.md** § Run these health checks and **docs/DEPLOY_COMMIT_AND_TEST.md** (Curl Examples).                                        |
| **Go live (plan + password off)** | **Shopify** → **Settings** → **Plan**: activate paid plan. **Online Store** → **Preferences** → **Password protection**: turn **off** so the store is public. See **SHOPIFY_SETUP_CHECKLIST.md** § Before you go live. |

---

## 5. Optional: Analytics and legal

| Step            | What to do                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics**   | Add Google Analytics / Meta Pixel (or your tool) in the app or via tag manager; verify events (page view, add to cart, purchase) if needed.   |
| **Legal pages** | Ensure **Privacy Policy**, **Terms of Service**, and **Refund/Shipping policy** exist (e.g. in Shopify or in-app) and are linked from footer. |

---

## Quick reference

- **Launch Day Protocol** (Hour 0–6, Domain Pulse, Velvet Rope, Marketing
  Tease): **docs/LAUNCH_DAY_PROTOCOL.md**.
- **Full 11-step operational plan** (Gold Stitch + Shopify, asperpharma):
  **docs/OPERATIONAL_LAUNCH_PLAN.md**. One-page printable:
  **docs/LAUNCH_CHECKLIST_ONE_PAGE.md**. Policy drafts (Refund/Shipping):
  **docs/POLICY_DRAFTS.md**.
- **Payments & shipping detail:** **SHOPIFY_SETUP_CHECKLIST.md** (§ Payments and
  shipping, § Before you go live).
- **Pre-launch (secrets, 503 fix):** **docs/PRE_LAUNCH_CHECKLIST.md**.
- **Deploy and test:** **docs/DEPLOY_COMMIT_AND_TEST.md**.

Once this checklist is done, you're ready to deploy the new Premium Pharmacy
look with payment and shipping correctly configured.

---

## One-page printable checklist

Copy or print this for a single-page run-through:

- [ ] **Payments:** Shopify Payments (or PayPal) active; COD configured if used.
- [ ] **Shipping:** Zones and rates set; free-shipping threshold (e.g. 50 JOD)
      if used.
- [ ] **Theme:** Soft ivory background, maroon/gold tokens, product cards and
      RTL checked.
- [ ] **Edge secrets:** SHOPIFY_STORE_DOMAIN, SHOPIFY_ACCESS_TOKEN (and
      LOVABLE_API_KEY if using chatbot) in Supabase.
- [ ] **Health:** GET bulk-product-upload returns 200.
- [ ] **Commit & deploy:** PR merged to `main`; deployment succeeded.
- [ ] **Go live:** Shopify paid plan on; store password protection **off**.
- [ ] **(Optional)** Analytics and legal pages in place.

Once this checklist is done, you’re ready to deploy the new Premium Pharmacy
look with payment and shipping correctly configured.
