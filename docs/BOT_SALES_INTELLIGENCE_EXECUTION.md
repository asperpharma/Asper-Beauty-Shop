# Sales Intelligence Bot — Execution Plan (Asper Beauty Shop)

This doc maps the **7-step Sales Intelligence configuration plan** to what’s
implemented in this repo (Supabase Edge Functions, migrations, playbooks) and to
**Gorgias** where applicable.

---

## 1. Load the "Pharmacist Logic" Playbook

**Action:** Import consultation logic (step-based routines, trigger keywords,
product recommendations by concern) into the bot’s backend or logic layer.

| Where              | What’s done                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase / App** | **Playbook in code + prompt:** `docs/SALES_INTELLIGENCE_AND_PHARMACIST_PLAYBOOKS.md` defines the 3-Click flow, Pharmacist Logic tone, and playbook-by-concern. The **beauty-assistant** Edge Function injects this into the system prompt (`salesIntelligence` block in `supabase/functions/beauty-assistant/index.ts`). No separate DB table for playbook steps yet—editing the doc or the prompt string updates behavior. |
| **Gorgias**        | If you use Gorgias for live chat, create **macros** that mirror the same steps (e.g. “Ask concern” → “Ask skin type” → “Send routine link”) and **automation rules** that trigger on keywords (acne, anti-aging, etc.).                                                                                                                                                                                                     |

**Optional:** Store playbook steps in a table (e.g. `playbook_steps`:
trigger_keywords, next_step, message_template) and have the Edge Function or a
separate “next step” API read from it.

---

## 2. Connect to Real-Time Product Data

**Action:** Wire the bot to filter the catalog so that when a user selects a
concern or brand, it returns the relevant product set (3-Click style).

| Where             | What’s done                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase**      | **beauty-assistant** already queries `products` by keywords from the last user message (title, brand, category, description, `skin_concerns`). It returns matched products in the stream as product cards. |
| **Edge Function** | **`get-products-by-concern`** — call it to get products (and optional cross-sell add-ons) by concern or brand for “Shop This Routine” links.                                                               |

**API: get-products-by-concern**

- **GET** `?concern=acne` or `?brand=vichy`
- **POST** `{ "concern": "acne", "brand": "" }`

Returns: `{ products, add_ons, shop_routine_path, shop_routine_url }`.

**Example (frontend):**

```ts
const res = await fetch(
  `${SUPABASE_URL}/functions/v1/get-products-by-concern?concern=acne`,
  { headers: { "apikey": SUPABASE_ANON_KEY } },
);
const { products, shop_routine_path } = await res.json();
// Link "Shop This Routine" to shop_routine_path (e.g. /skin-concerns?concern=acne)
```

**SQL (for reference):** Products are filtered by `skin_concerns` array
containing the concern slug, or by title/description ilike. No raw SQL needed in
the app; the Edge Function does the query.

---

## 3. Dynamic Up-Sell / Cross-Sell Logic

**Action:** After the bot recommends a product, offer optional add-ons (e.g.
“Would you like to add a gentle cleanser with your anti-aging serum?”).

| Where             | What’s done                                                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase**      | Table **`cross_sell_rules`**: `trigger_concern`, `add_on_product_ids` (uuid[]), `label_en`, `label_ar`, `sort_order`. Migration: `20260207140000_bot_sales_intelligence.sql`. |
| **Edge Function** | **get-products-by-concern** reads `cross_sell_rules` for the given concern and returns `add_ons` (product rows) in the response.                                              |
| **Bot prompt**    | **beauty-assistant** system prompt includes: “After your first product recommendation, optionally offer one add-on (e.g. gentle cleanser with that serum).”                   |

**Example: insert a cross-sell rule (SQL Editor or admin)**

```sql
INSERT INTO public.cross_sell_rules (trigger_concern, add_on_product_ids, label_en, label_ar)
VALUES (
  'acne',
  ARRAY['<uuid-of-gentle-cleanser>']::uuid[],
  'Complete your routine',
  'أكملي روتينك'
);
```

---

## 4. Direct Checkout Links & Lead Capture

**Action:** When the bot recommends a routine, include a “Shop This Routine”
link (filtered collection or pre-filled cart). If the customer isn’t ready to
buy, capture email/WhatsApp for follow-up.

| Where                 | What’s done                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shop This Routine** | **get-products-by-concern** returns `shop_routine_path` (e.g. `/skin-concerns?concern=acne`) and `shop_routine_url` (full URL if `SITE_URL` is set). The chat UI can show a button that links to this path.         |
| **Lead capture**      | Table **`bot_leads`**: `contact_email`, `contact_whatsapp`, `concern`, `skin_type`, `recommended_product_ids`, `source`, `converted`. Edge Function **`capture-bot-lead`** inserts into `bot_leads` (service role). |

**API: capture-bot-lead**

- **POST** body:
  `{ contact_email?, contact_whatsapp?, concern?, skin_type?, recommended_product_ids?, source? }`
- At least one of `contact_email` or `contact_whatsapp` required.
- Returns: `{ ok, id, message }`.

**Example (frontend):** When the user says “yes, save my routine” and enters
email or WhatsApp, call:

```ts
await fetch(`${SUPABASE_URL}/functions/v1/capture-bot-lead`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
  body: JSON.stringify({
    contact_email: "customer@example.com",
    concern: "acne",
    skin_type: "oily",
    recommended_product_ids: ["uuid1", "uuid2"],
    source: "chatbot",
  }),
});
```

**Gorgias:** For “Save My Routine,” use a macro that collects email/WhatsApp and
either calls your API (e.g. via Zapier/Make) or stores in a Gorgias custom field
for follow-up.

---

## 5. Track & Analyze Interactions

**Action:** Track which products/concerns the bot engages with; store in DB to
refine logic and measure conversion.

| Where         | What’s done                                                                                                                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase**  | **telemetry_events**: use source `concierge` and events `skin_concern_click`, `add_to_cart_from_prescription` (see `docs/ANALYTICS_TOP_SKIN_CONCERN_AND_PRESCRIPTION.md`). **bot_leads** table records lead + concern + recommended_product_ids; set `converted = true` when they purchase (e.g. via nightly job or webhook). |
| **Analytics** | **analytics_skin_concern_weekly** aggregates skin concern clicks. Prescription conversion = add_to_cart_from_prescription events vs. quiz/conversation starts.                                                                                                                                                                |

**Optional:** Add a row to `telemetry_events` or a dedicated `bot_interactions`
table when the bot returns a recommendation (e.g. from beauty-assistant: event
`bot_recommendation`, payload `{ concern, skin_type, product_ids }`). Then join
with `bot_leads` and orders to compute conversion by concern.

**SQL: count leads and conversions**

```sql
SELECT concern, count(*) AS leads, count(*) FILTER (WHERE converted) AS converted
FROM public.bot_leads
WHERE created_at > now() - interval '30 days'
GROUP BY concern
ORDER BY leads DESC;
```

---

## 6. Enable and Test in Sandbox Mode

**Action:** Run the sales logic on a staging or password-protected storefront;
validate the 3-Click experience with test accounts.

| Where         | What’s done                                                                                                                                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**       | Use a staging deployment (e.g. Vercel preview or a separate subdomain). Keep store password on if using Shopify.                                                                                                                                                                        |
| **Checklist** | `docs/LAUNCH_DAY_PROTOCOL.md` and `docs/LAUNCH_CHECKLIST_ONE_PAGE.md` include 3-Click and Pharmacist Logic checks. Test: open chat → state concern → state skin type → get recommendation → click “Add to cart” or “Shop This Routine” → (optional) “Save my routine” and submit email. |

---

## 7. Go Live & Monitor

**Action:** When satisfied, go live; monitor sales, abandoned sessions, and
leads.

| Where          | What’s done                                                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Metrics**    | **Customer Success Report** (`docs/CUSTOMER_SUCCESS_REPORT.md`): Section II “3-Click Solution Performance” (quiz → cart add, prescription conversion > 15%). Use **bot_leads** and **telemetry_events** to fill the report. |
| **Refinement** | Update **cross_sell_rules** and the **beauty-assistant** system prompt based on which concerns and add-ons convert. Mark **bot_leads.converted** when an order is tied to a lead (e.g. same email or session).              |

---

## Summary: What’s in This Repo

| Item                                                 | Location                                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Pharmacist Logic playbook                            | `docs/SALES_INTELLIGENCE_AND_PHARMACIST_PLAYBOOKS.md`                         |
| Bot system prompt (3-Click + upsell + lead capture)  | `supabase/functions/beauty-assistant/index.ts`                                |
| Products by concern/brand API                        | `supabase/functions/get-products-by-concern/index.ts`                         |
| Lead capture API                                     | `supabase/functions/capture-bot-lead/index.ts`                                |
| Cross-sell rules + bot_leads tables                  | `supabase/migrations/20260207140000_bot_sales_intelligence.sql`               |
| Tracking (concierge events, prescription conversion) | `docs/ANALYTICS_TOP_SKIN_CONCERN_AND_PRESCRIPTION.md`, `log-concierge-events` |

**Deploy:**

```bash
supabase db push
supabase functions deploy beauty-assistant
supabase functions deploy get-products-by-concern
supabase functions deploy capture-bot-lead
```

**Optional env:** `SITE_URL` on get-products-by-concern for full
`shop_routine_url`.
