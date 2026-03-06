# 📋 Asper Beauty: Operational Launch Plan (The 11-Point Protocol)

**Objective:** Execute a "Clean Science" launch for 5,000 SKUs with zero
friction. **Philosophy:** "Pharmacist Logic"—every step must be transparent,
secure, and verified.

---

## 🏗️ Phase 1: The Clinical Foundation (Data & Structure)

### 1. Shopify Store Setup

- **Goal:** Establish the "backend brain" of the operation.
- **Action:** Configure General Settings (Store Details).
  - **Currency:** JOD (Jordanian Dinar).
  - **Timezone:** (GMT+03:00) Amman.
  - **Language:** English (Default) + Arabic (Schema).
- **Primary Tool:** Shopify Admin.
- **Asper Note:** Ensure "Taxes" are configured for Jordan (16% Sales Tax if
  applicable, or included in price).

### 2. Bulk Product Import (The Catalog)

- **Goal:** Ingest 5,000+ items (Vichy, LRP, CeraVe) with accurate metadata.
- **Action:** Map CSV columns to Shopify handles (Title, Description, Price,
  SKU, Image URL, Tags).
- **Primary Tool:** **Matrixify (Excelify)**.
- **Alternative:** Custom Supabase Edge Function (for ongoing sync).
- **Asper Note:** Ensure tags like `dermocosmetic`, `skin-concern:acne`, and
  `brand:vichy` are strictly formatted for the React frontend filters.

### 3. Domain Connection & SSL

- **Goal:** Secure the digital storefront `asperbeauty.com`.
- **Action:** Update DNS records (A Record, CNAME) to point to Shopify/Vercel
  (if Headless).
- **Primary Tool:** Godaddy / Namecheap.
- **Status Check:** Ensure the "Padlock" icon (SSL) is active.
- **Asper Note:** The domain must resolve to the **Lovable/Vercel** app for the
  frontend, while `checkout.asperbeauty.com` handles the Shopify secure
  checkout.

---

## 📦 Phase 2: Logistics & Finance (The "Trust" Layer)

### 4. Payment Gateway (COD Focus)

- **Goal:** Enable transactions that match Jordanian consumer behavior.
- **Action:** Activate "Cash on Delivery (COD)" as the primary manual payment
  method.
- **Primary Tool:** Shopify Payments (Manual Payment Settings).
- **Alternative:** Stripe (if accepting international cards), TAP Payments.
- **Asper Note:** Rename the COD label to: _"Cash on Delivery (Verified by
  Asper)"_ to add trust.

### 5. Shipping & Fulfillment

- **Goal:** Define the "Promise of Arrival."
- **Action:** Configure Shipping Zones.
  - **Zone 1 (Amman):** 3.00 JOD (Standard) / Free > 50 JOD.
  - **Zone 2 (Governorates):** 3.00 JOD (Standard) / Free > 50 JOD.
- **Primary Tool:** Shopify Shipping Profiles.
- **Alternative:** Easyship integration.
- **Asper Note:** Ensure the "Free Shipping" logic syncs with the React Cart
  component (e.g., "Add 12 JOD for Free Shipping").

### 6. Legal & Trust Pages (The "Pharmacist's Handshake")

- **Goal:** protect the business and reassure the customer.
- **Action:** Generate and customize standard policies.
  - **Privacy Policy:** (GDPR/Jordan Data Protection compliant).
  - **Refund Policy:** (Strict hygiene rules for open skincare).
  - **Terms of Service:** (User conduct).
- **Primary Tool:** Shopify Policy Generator.
- **Alternative:** Termly, GetTerms.
- **Asper Note:** Add the "Reaction Clause" (Consult doctor if irritation
  occurs).

---

## 🎨 Phase 3: The "Morning Spa" Experience (Frontend)

### 7. Theme & Branding (Headless Execution)

- **Goal:** Visual dominance of the "Ivory & Maroon" aesthetic.
- **Primary Tool:** **Lovable App (React 18)**.
- **Secondary Tool:** Shopify "Dawn" Theme (Fallback/Checkout styling).
- **Action:**
  - Deploy React App to Netlify/Vercel.
  - Sync `STOREFRONT_ACCESS_TOKEN` in `.env`.
- **Asper Note:** Ensure the checkout page (`checkout.liquid` or settings)
  uploads the Asper Logo to maintain brand continuity during payment.

### 8. Live Chat / Digital Concierge

- **Goal:** Replicate the in-store pharmacist consultation.
- **Action:** Embed the AI Chat widget.
- **Primary Tool:** **Supabase + OpenAI (Custom Asper Concierge)**.
- **Alternative:** Gorgias, Tidio, WhatsApp Widget.
- **Asper Note:** The chat must have access to the `products` table to recommend
  specific SKUs (e.g., "For dry skin, I recommend Vichy Minéral 89").

### 9. Checkout & Trust Badges

- **Goal:** Reduce cart abandonment at the critical moment.
- **Action:** Add visual security cues near the "Place Order" button.
- **Primary Tool:** Ultimate Trust Badges app.
- **Alternative:** Custom React Component in Cart Drawer.
- **Asper Note:** Badges to display: _100% Authentic_, _Pharmacist Verified_,
  _Secure COD_.

---

## 🚀 Phase 4: Launch Sequence

### 10. Domain & SSL Final Check

- **Goal:** Technical green light.
- **Action:**
  - Verify `https://` redirect works.
  - Verify `www.` vs non-www resolution.
  - Test load speeds on 3G/4G networks (mobile optimization).

### 11. Test & Launch (The "Soft Opening")

- **Goal:** Validate the flow from "Concern" to "Cash".
- **Action:**
  1. Create a "User Account" (Supabase Auth).
  2. Take the Skin Quiz.
  3. Add recommendation to Cart.
  4. Complete Checkout via COD.
  5. Verify Email Confirmation + SMS.
- **Asper Note:** Only remove the "Password Page" after a successful end-to-end
  COD test order.

---

## 🛠️ Appendix: Direct Tool Links

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

**Other**

- **Termly:** [termly.io](https://termly.io)
