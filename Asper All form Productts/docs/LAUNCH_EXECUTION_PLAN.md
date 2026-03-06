# Launch Execution Plan — Finalize Go-Live

Prioritized steps to finalize the Asper Beauty Shop launch: bulk import, Brain connection, and live-fire tests.

---

## ⚠️ Security note (if you pasted a token in chat)

If you previously shared a **Shopify Storefront API token** or any secret in a chat or doc:

1. **Rotate it immediately** in Shopify Admin (Settings → Apps and sales channels → your app → API credentials → regenerate Storefront API token).
2. **Do not commit** token values to the repo or put them in any file under version control.
3. Set the **new** token only in Supabase Edge Function secrets (Dashboard or `supabase secrets set`) and in local `.env` as `VITE_SHOPIFY_STOREFRONT_API_TOKEN` (or your app’s env name) if the frontend needs it. Never paste the new token into docs or chat.

---

## 1. ⚙️ Execute the bulk import (the engine)

Your catalog lives in CSV files. Push them into Shopify so the store and the Brain can “see” products.

### Source files (this repo)

| File | Location in repo |
|------|------------------|
| Part 1 | `Orgnized Products/shopify-import-part-1.csv` |
| Part 2 | `Orgnized Products/shopify-import-part-2.csv` |
| Part 3 | `Orgnized Products/shopify-import-part-3.csv` |
| Part 4 | `Orgnized Products/shopify-import-part-4.csv` |
| Single file | `Orgnized Products/shopify-import.csv` |

If you have a duplicate (e.g. `shopify-import-part-1(1).csv`) from another folder, use the same column mapping as below.

### Steps (Matrixify / Excel Export Import app)

1. **Open the app** in Shopify Admin (the Excel Export Import / Matrixify app you linked).
2. **Upload** — Select `shopify-import-part-1.csv` (or part 1 first, then repeat for 2–4 if the app requires separate runs).
3. **Map columns** — Ensure at least:
   - **Variant Inventory Qty** (or equivalent) is mapped so inventory is not empty.
   - Your CSVs already contain positive stock (e.g. Essence Mascara 300, Sebamed Baby Wash 490). If these columns are mapped correctly, Dr. Sami won’t block sales and Ms. Zain can recommend in-stock items.
4. **Run the import** — Start the job. This populates the store with the Medical Luxury catalog (Vichy, Sebamed, Essence, etc.).

### Why inventory matters

- **Empty or 0 stock:** The AI and storefront should not recommend out-of-stock items; Dr. Sami’s rules block prescribing unavailable products.
- **Positive stock:** Enables recommendations and “Add to Regimen” / Digital Tray flows.

---

## 2. 🔌 Verify the “Brain” connection

The AI (and any Edge Function that talks to Shopify) must have access to the store.

### Supabase project

- **Project ref:** `rgehleqcubtmcwyipyvi`  
- **Dashboard:** Supabase → Project → Edge Functions → Secrets.

### Secrets to set (do not paste values into this doc or chat)

| Secret | Used by | Purpose |
|--------|--------|--------|
| `SHOPIFY_STORE_DOMAIN` | bulk-product-upload, get-products-by-concern (if wired) | Your store domain (e.g. `your-store.myshopify.com`) |
| `SHOPIFY_ACCESS_TOKEN` or `SHOPIFY_STOREFRONT_TOKEN` | bulk-product-upload; Storefront API calls from Edge Functions | Shopify Storefront API token (create/regenerate in Shopify Admin) |

**Set via Dashboard:**  
Supabase → Project → Edge Functions → Secrets → Add `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN` per your code).

**Set via CLI (use a new token after rotating if one was exposed; never paste real tokens in docs or chat):**

```bash
# From project root; replace <value> with actual values. Use your Supabase project ref (e.g. rgehleqcubtmcwyipyvi or your other project).
npx supabase secrets set SHOPIFY_STORE_DOMAIN=<your-store.myshopify.com> SHOPIFY_ACCESS_TOKEN=<your_new_token> --project-ref <YOUR_PROJECT_REF>
```

Then deploy the function (same project ref):

```bash
npx supabase functions deploy beauty-assistant --project-ref <YOUR_PROJECT_REF>
```

- **Reference:** `docs/SHOPIFY_EDGE_FUNCTIONS_SECRETS.md`, `docs/NEXT_STEPS.md`, `docs/HEALTH-CHECK-PROTOCOL.md`.

### Verify connectivity

After setting secrets, confirm the “Brain” / pipeline can reach Shopify:

- **bulk-product-upload** must return **HTTP 200** (not 503):
  - URL: `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`
  - PowerShell: `Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"`
  - If 503: re-check `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN`) in Supabase secrets.

---

## 3. 🌐 Live-fire tests on asperbeautyshop.com

Run these on the live site after import and secrets are in place.

### Test A — Aesthetic trigger (Ms. Zain)

- **You ask (e.g. in chat or concierge):**  
  *“I want a routine for glowing skin.”*
- **Success:**
  - Bot responds in **Ms. Zain** tone (warm, editorial).
  - Recommends something like **Vichy Mineral 89** (in your feed) and can place it on the Digital Tray.

### Test B — Medical trigger (Dr. Sami)

- **You ask:**  
  *“Is Rigenforte safe for pregnancy?”*
- **Success:**
  - Bot switches to **Dr. Sami** (clinical tone).
  - References ingredients (e.g. Biotinax, Zinc) where relevant.
  - Includes the **mandatory disclaimer:**  
    *“I provide wellness guidance, not medical diagnosis.”*
  - Signs off with: *“- Dr. Sami, Asper Clinical Support”*.

### Test C — Visuals (Midas Touch)

- **Action:** Hover over a product card (e.g. Sebamed).
- **Success:**
  - A **1px gold border** (#C5A028) appears around the card.
  - Transition is smooth (~400ms ease-in-out) — “Seal of Authenticity.”

---

## Summary checklist

- [ ] **Import:** CSVs (e.g. `shopify-import-part-1.csv` through part-4 or single file) uploaded via Matrixify; **Variant Inventory Qty** mapped; import run successfully.
- [ ] **Secrets:** `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` (or `SHOPIFY_STOREFRONT_TOKEN`) set in Supabase Edge Function secrets; **bulk-product-upload** returns 200.
- [ ] **Live site:** Visit asperbeautyshop.com; run Test A (Ms. Zain / glowing skin), Test B (Dr. Sami / Rigenforte pregnancy), Test C (product card gold border on hover).

---

## Optional: High-value items for Dr. Sami

To have Dr. Sami prioritize specific “high value” or clinical products (e.g. Rigenforte, Omron, key Vichy/LRP items), you can:

- Tag or segment those SKUs in Shopify (e.g. via `SHOPIFY_TAGGING_PROTOCOL.md`).
- Add a short “priority product” or “clinical hero” list in the beauty-assistant system prompt or in a small config used by the recommendation logic.

If you have a **products_export.csv** (or similar) from Shopify, you can analyze it to list top-margin or key clinical SKUs and then align tags and prompts accordingly.

**Implemented:** The priority list lives in `supabase/functions/beauty-assistant/index.ts` as `PRIORITY_PRODUCTS` (clinical skincare handles, Rigenforte, Omron). It is injected into the system prompt as "HIGH-VALUE / CLINICAL PRIORITY." To add or edit items, update that constant and redeploy: `supabase functions deploy beauty-assistant`.
