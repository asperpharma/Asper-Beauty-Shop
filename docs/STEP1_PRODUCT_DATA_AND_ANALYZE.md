# Step 1: Product Data & Analyze (3-Click Flow)

This doc confirms your **product catalog** is ready and how the **Analyze** step
(Click 1) is implemented for the "Analyze → Recommend → Regimen" script.

---

## 1. Product catalog (Supabase)

Your catalog lives in Supabase in the **`public.products`** table.

### Table: `public.products`

| Column              | Type        | Notes                                                        |
| ------------------- | ----------- | ------------------------------------------------------------ |
| `id`                | uuid        | PK, default `gen_random_uuid()`                              |
| `title`             | text        | Required                                                     |
| `price`             | numeric     | Required                                                     |
| `description`       | text        | HTML allowed                                                 |
| `category`          | text        | e.g. Featured, skin-care, makeup                             |
| `image_url`         | text        | Product image URL                                            |
| `brand`             | text        | e.g. Vichy, Eucerin                                          |
| `subcategory`       | text        | e.g. Face, Sun Protection                                    |
| **`skin_concerns`** | **text[]**  | **e.g. `['acne','hydration']` — used for concern filtering** |
| `volume_ml`         | text        | Optional                                                     |
| `is_on_sale`        | boolean     | Default false                                                |
| `original_price`    | numeric     | Optional                                                     |
| `discount_percent`  | integer     | Default 0                                                    |
| `source_url`        | text        | For enrichment/scraping                                      |
| `texture`           | text        | e.g. Silky serum                                             |
| `scent`             | text        | e.g. Fragrance-free                                          |
| `created_at`        | timestamptz | Auto                                                         |
| `updated_at`        | timestamptz | Auto                                                         |

**Relevant for the bot / 3-Click flow:**

- **`skin_concerns`** — Array of slugs (e.g. `acne`, `hydration`, `anti-aging`,
  `sensitivity`, `dark-spots`, `sun-protection`, `redness`, `cleansing`,
  `wrinkles`, `oily-skin`, `dry-skin`). Used by:
  - **Edge Function `get-products-by-concern`** — returns products filtered by
    concern (and optional brand) plus cross-sell add-ons and `shop_routine_url`.
  - **Edge Function `beauty-assistant`** — uses keyword extraction + product
    search to recommend regimens.

### Related tables

- **`cross_sell_rules`** — `trigger_concern`, `add_on_product_ids`; used by
  `get-products-by-concern` for add-ons.
- **`bot_leads`** — Captures contact when user says "save my routine"
  (conversion tracking).

---

## 2. Backend: products by concern

- **Function:** `get-products-by-concern` (Supabase Edge Function).
- **Input:** `concern` (and optional `brand`) via GET query or POST body.
- **Output:**
  `{ concern, brand, products, add_ons, shop_routine_path, shop_routine_url }`.
- **Logic:** Queries `products` where `skin_concerns` contains the concern slug;
  falls back to `title`/`description` text match; applies `cross_sell_rules` for
  add-ons.

Concern slugs supported (aligned with frontend):\
`acne`, `anti-aging`, `hydration`, `sensitivity`, `dark-spots`, `pigmentation`,
`sun-protection`, `redness`, `cleansing`, `wrinkles`, `oily-skin`, `dry-skin`.

---

## 3. Analyze step (Click 1) — implementation

**Goal:** Capture the user’s skin concern (Medical Metadata) in one interaction
and confirm it before moving to Recommend.

### User actions

1. **Smart Filter (buttons):** User clicks a concern chip (e.g. Acne,
   Anti-Aging, Hydration).\
   → Sends a pre-written message (e.g. “My skin feels tight and dry” for
   Hydration) and starts the stream.
2. **Free text:** User types something like “My skin feels tight and dry”.\
   → Frontend detects concern via **keyword → concern** mapping
   (`detectConcernFromText` in `src/lib/concernMapping.ts`).

### AI script (persona)

- **Tone:** Polite, professional, receptive.
- **Script:**\
  _“I am honored to serve. Based on your description, it appears you are
  experiencing [Detected Concern]. May I recommend a regimen tailored to this
  concern?”_

### UI behavior

- **Smart Filter:** Quick prompt buttons (from `SKIN_CONCERNS`) that send the
  corresponding message.
- **Free text:** While the user types:
  - Show **“Detected concern: [Label]”** chip.
  - Show the **diagnostic sentence** with the detected concern name.
  - Show **“See My Regimen”** button — on click, sends the message and streams
    the AI recommendation (Recommend → Regimen).

### Where it lives

- **Frontend:** `src/components/BeautyAssistant.tsx` — Smart Filter buttons,
  input, `detectConcernFromText`, diagnostic copy, “See My Regimen” CTA.
- **Concern detection:** `src/lib/concernMapping.ts` — `detectConcernFromText()`
  (keyword → slug).
- **Concern labels:** `src/lib/categoryHierarchy.ts` — `SKIN_CONCERNS` (id,
  labelEn, labelAr).
- **Backend:** `supabase/functions/beauty-assistant/index.ts` — 3-step prompt
  (Analyze → Recommend → Regimen) and product search by keywords /
  `skin_concerns`.

---

## 4. Step 2 (Recommend) — implemented

- **Backend (`beauty-assistant`):** Detects concern from the user message via
  `detectConcernSlug()`. Prefers products by `skin_concerns` array when a
  concern is detected. First reply is **one sentence confirmation + one
  authoritative regimen only** (no alternatives). Stream starts with a
  `recommend` event:
  `{ type: "recommend", detected_concern, shop_routine_path: "/concerns/{slug}" }`.
- **`get-products-by-concern`:** Returns
  `shop_routine_path: /concerns/{concernSlug}` so the collection page matches
  the app route `/concerns/:concernSlug`.
- **Frontend:** Parses `recommend` and attaches `shopRegimenPath` to the
  assistant message. Shows a **“See My Regimen”** link that navigates to the
  concern collection (e.g. `/concerns/hydration`), closing the chat.

## 5. Step 3 (Regimen / Save My Routine) — implemented

- **See My Regimen:** Link to `/concerns/{slug}` (Supabase-powered collection
  when products exist).
- **Save My Routine:** In the chat, a “Save My Routine” button opens a form
  (email and/or WhatsApp). On submit, the frontend calls the
  **capture-bot-lead** Edge Function, which inserts into **`bot_leads`**
  (concern, recommended_product_ids, source). Success/error feedback via toast.

**Testing and deploy:** See **`docs/TEST_AND_DEPLOY_3CLICK_FLOW.md`** for a full
test checklist and deploy steps.

If you need a **SQL migration** for the products table (e.g. for a new env), use
the migrations under `supabase/migrations/` (e.g. `20260117084922_*` for base
table, then the ALTERs for `skin_concerns`, `brand`, etc.).
