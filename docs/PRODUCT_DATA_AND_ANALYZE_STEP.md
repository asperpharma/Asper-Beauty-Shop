# Step 1: Product Data & Analyze Step (3-Click Foundation)

**Goal:** Ensure the bot can retrieve relevant products by concern or brand—the
foundation of personalized sales and the 3-Click flow. This doc confirms your
catalog, schema, and how the **Analyze** step is implemented.

---

## 1. Catalog Status: Ready in Supabase

Your product catalog lives in **Supabase** in the **`public.products`** table.

### Current schema (authoritative)

| Column              | Type        | Notes                                                                |
| ------------------- | ----------- | -------------------------------------------------------------------- |
| `id`                | uuid        | PK, default gen_random_uuid()                                        |
| `title`             | text        | NOT NULL                                                             |
| `price`             | numeric     | NOT NULL                                                             |
| `description`       | text        | nullable                                                             |
| `category`          | text        | NOT NULL, default 'Featured'                                         |
| `image_url`         | text        | nullable                                                             |
| `brand`             | text        | nullable                                                             |
| `subcategory`       | text        | nullable (e.g. Face, Sun Protection)                                 |
| **`skin_concerns`** | **text[]**  | **nullable — e.g. ['acne','oily-skin'], ['hydration','anti-aging']** |
| `tags`              | text[]      | nullable                                                             |
| `volume_ml`         | text        | nullable                                                             |
| `is_on_sale`        | boolean     | default false                                                        |
| `original_price`    | numeric     | nullable                                                             |
| `discount_percent`  | integer     | default 0                                                            |
| `texture`           | text        | nullable                                                             |
| `scent`             | text        | nullable                                                             |
| `source_url`        | text        | nullable                                                             |
| `created_at`        | timestamptz | default now()                                                        |
| `updated_at`        | timestamptz | default now()                                                        |

**Concern tagging:** Products are matched to the 3-Click flow via
**`skin_concerns`** (array of slugs: `acne`, `anti-aging`, `hydration`,
`sensitivity`, `dark-spots`, `sun-protection`, `redness`, `cleansing`,
`wrinkles`, `oily-skin`, `dry-skin`) and by **`title` / `description`** for
keyword search.

### Sample row (conceptual)

```text
id: uuid
title: "Vichy Minéral 89 Hyaluronic Acid Serum"
price: 24.500
brand: "Vichy"
category: "Featured"
subcategory: "Face"
skin_concerns: ["hydration", "anti-aging"]
description: "Intensive hydration..."
image_url: "https://..."
```

No migration needed for Step 1—the table and concern-related columns already
exist. If you add a dedicated **`concern_tag`** (single text) later, you can
derive it from `skin_concerns[1]` or keep using the array.

---

## 2. How the Bot Gets Products

| Piece                                     | Role                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **beauty-assistant** Edge Function        | Reads last user message, extracts keywords (skin + brand), queries `products` with `title.ilike`, `brand.ilike`, `category.ilike`, `description.ilike`, and (where applicable) `skin_concerns`. Injects the resulting product list into the system prompt and streams it as a `products` event so the UI can show the Digital Tray. |
| **get-products-by-concern** Edge Function | Returns products filtered by **concern** (via `skin_concerns` array) or **brand**, plus optional cross-sell add-ons and `shop_routine_path` for "Shop This Routine" links. Used by the frontend when building regimen deep links.                                                                                                   |

So: **product data is in Supabase; the bot and the app both use the same
`products` table and `skin_concerns` for concern-based recommendations.**

---

## 3. The Analyze Step (Click 1 — The Diagnostic)

**Goal:** Capture the user’s "Medical Metadata" (skin concern) and confirm it
before moving to Recommend → Regimen.

### User action

- **Smart Filter:** User clicks a concern button (e.g. Acne, Anti-Aging,
  Hydration).
- **Free text:** User types/speaks a concern (e.g. "My skin feels tight and
  dry").

### AI script (persona)

- **Tone:** Polite, professional, receptive.
- **Script:** _"I am honored to serve. Based on your description, it appears you
  are experiencing [Detected Concern]. May I recommend a regimen tailored to
  this concern?"_

### How it’s implemented

| Part                         | Where                       | How                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Smart Filter buttons**     | `BeautyAssistant.tsx`       | **Quick Prompts** = concern buttons (e.g. "Routine for Acne", "Safe for Pregnancy?", "Compare Serums"). You can replace or extend these with a full set from **`SKIN_CONCERNS`** in `src/lib/categoryHierarchy.ts` (Acne, Anti-Aging, Hydration, Sensitivity, Dark Spots, etc.) so the UI is a true "Smart Filter" bar.      |
| **Free text**                | Same chat input             | User types freely; the **beauty-assistant** Edge Function runs **keyword → concern** logic (e.g. "tight", "dry", "dehydrated" → hydration). Keywords are in `extractKeywords()` in the Edge Function; no separate API needed for Analyze.                                                                                    |
| **Backend concern matching** | `beauty-assistant/index.ts` | `extractKeywords()` uses a fixed list of skin/brand keywords and maps the last user message to product search; the LLM then follows the 4-stage prompt (Analyze → Recommend → Regimen). So "Analyze" is: user sends concern (button or text) → backend matches to products + drives the diagnostic reply and next question.  |
| **Diagnostic reply text**    | System prompt (Stage 1 & 2) | The model is instructed to acknowledge the concern and ask 1–2 clarifying questions (e.g. skin type, cystic vs surface acne). The exact line _"I am honored to serve. Based on your description, it appears you are experiencing [Concern]..."_ is part of the Persona and Logic stages in `INTELLIGENCE_PHASE_4_STAGES.md`. |

### Optional: concern-matching helper (frontend)

If you want to show a **"Detected: Hydration"** chip when the user types (before
or after send), you can use a small **keyword → concern** map on the client. A
shared helper is in **`src/lib/concernMapping.ts`** (see below) so both the chat
and any other UI can map free text to a concern id for display or analytics.

### Optional: "See My Regimen" button

After the AI’s diagnostic reply, the next step is **Recommend → Regimen**
(Digital Tray). The bot already ends with a CTA like _"Shall I add this tray to
your cart?"_ when it returns products. If you want an explicit **"See My
Regimen"** button in the UI, it can either: (a) auto-send a follow-up message
like "Yes, show my regimen", or (b) scroll to the product list + Digital Tray
when the assistant message contains products. Currently (b) is in place: when
the stream includes products, the Digital Tray is shown with "Quick Add Routine
to Cart".

---

## 4. Summary Checklist

- [x] **Catalog:** In Supabase, `public.products`, with `skin_concerns`,
      `brand`, `title`, `description`, `price`, `image_url`, etc.
- [x] **Schema:** No change required for Step 1; `skin_concerns` (text[]) is the
      concern tag for the bot.
- [x] **Bot retrieval:** beauty-assistant queries `products` by keywords +
      optional `skin_concerns`; get-products-by-concern returns by concern/brand
      for "Shop This Routine".
- [x] **Analyze step:** Smart Filter = Quick Prompts (expandable with
      SKIN_CONCERNS); free text = same input, backend does keyword/concern
      matching; script = "I am honored to serve..." in system prompt.
- [ ] **Optional:** Expand Quick Prompts to a full Smart Filter from
      `SKIN_CONCERNS`; add client-side `detectConcernFromText()` and "Detected:
      X" chip; add explicit "See My Regimen" button if desired.

---

## 5. Reference: CREATE TABLE (for copy-paste or new envs)

If you ever need to recreate the products table from scratch (e.g. a new
Supabase project), the following matches the current design. **Do not run this
on an existing DB** without checking for conflicts.

```sql
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Featured',
  image_url text,
  brand text,
  subcategory text,
  skin_concerns text[],
  tags text[],
  volume_ml text,
  is_on_sale boolean DEFAULT false,
  original_price numeric,
  discount_percent integer DEFAULT 0,
  texture text,
  scent text,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_skin_concerns ON public.products USING GIN (skin_concerns);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
```

---

**Next:** Step 2 (Recommend) and Step 3 (Regimen / Digital Tray) are already
implemented: the 4-stage prompt in the beauty-assistant drives Analyze →
Recommend → Regimen, and the UI shows the Digital Tray with "Quick Add Routine
to Cart" when the bot returns products.
