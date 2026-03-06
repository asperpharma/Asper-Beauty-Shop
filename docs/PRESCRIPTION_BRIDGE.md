# Prescription Bridge

The **Prescription Bridge** turns a skin concern (e.g. `acne`, `hydration`) into
a curated **3-step regimen** from the Shopify Storefront API using product tags.
It powers the "Digital Tray" with real-time inventory and clinical structure
(Preparation → Active → Protection).

---

## How it works

1. **Concern → Shopify tag**\
   A concern slug (e.g. `acne`) is mapped to a Shopify tag (e.g. `Concern_Acne`)
   via `concernMapping.ts` / `concernToShopifyTag()`.

2. **Storefront query**\
   The bridge queries Shopify products with that tag:\
   `products(first: 20, query: "tag:Concern_Acne")`.

3. **3-step regimen**\
   From those products it picks one per step using tags:
   - **Step_1_Cleanser** → Preparation
   - **Step_2_Treatment** → The Active
   - **Step_3_Protection** → Moisturizer/SPF

4. **Result**\
   Returns `{ cleanser, treatment, protection, allProducts }` so the UI can show
   a single authoritative regimen and never recommend out-of-stock items
   (Storefront API reflects current inventory).

---

## Where it lives

| Use case                   | Location                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Client (React)**         | `src/lib/prescriptionBridge.ts` — `getProductsByConcern(concern)`, `regimenToTrayProducts(regimen)`          |
| **Server (Edge Function)** | `supabase/functions/prescription-bridge/index.ts` — GET `?concern=acne` or POST `{ "concern": "hydration" }` |

---

## Client usage

```ts
import {
  getProductsByConcern,
  regimenToTrayProducts,
} from "@/lib/prescriptionBridge";

// By concern slug (uses concernMapping tags)
const regimen = await getProductsByConcern("acne");
if (regimen) {
  console.log(
    regimen.cleanser?.title,
    regimen.treatment?.title,
    regimen.protection?.title,
  );
  const trayProducts = regimenToTrayProducts(regimen); // for Digital Tray / cart
}
```

The client uses your existing Shopify Storefront config
(`VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`).

### Wired in the chat (Beauty Assistant)

When an assistant message has **shopRegimenPath** (e.g. `/concerns/acne`), the
chat automatically calls `getProductsByConcern(concern)` and uses
`regimenToTrayProducts(regimen)` for the **Digital Tray**. If the Shopify
regimen has at least one step (cleanser / treatment / protection), the tray
shows that 3-step routine; otherwise it falls back to the products returned by
the backend (Supabase). No extra code is required in the UI.

---

## Edge Function (prescription-bridge)

- **Invoke:**\
  `GET /functions/v1/prescription-bridge?concern=hydration`\
  or\
  `POST /functions/v1/prescription-bridge` with body `{ "concern": "acne" }`.

- **Secrets (Supabase → Edge Functions → Secrets):**
  - `SHOPIFY_STORE_DOMAIN` — e.g. `your-store.myshopify.com`
  - `SHOPIFY_STOREFRONT_TOKEN` — Storefront API access token (read-only, not
    Admin API)

- **Response:**\
  `{ concern, cleanser, treatment, protection, allProducts }` (each step is a
  product node or `null`).

---

## Shopify product tags (Matrixify / import)

For the bridge to build the 3-step regimen, products must be tagged in Shopify:

| Tag                                                            | Purpose                          |
| -------------------------------------------------------------- | -------------------------------- |
| `Concern_Acne`, `Concern_Hydration`, `Concern_AntiAging`, etc. | Which concern the product is for |
| `Step_1_Cleanser`                                              | Preparation / cleanser           |
| `Step_2_Treatment`                                             | Treatment / active               |
| `Step_3_Protection`                                            | Moisturizer / SPF                |

Tag mapping is in `src/lib/concernMapping.ts` (`CONCERN_CONFIG[slug].tag`). Add
or adjust tags there and in the Edge Function’s `CONCERN_TO_TAG` if you add new
concerns.

---

## Why use it

- **Automatic regimen building** — One concern → one 3-step routine from your
  catalog.
- **Real-time inventory** — Storefront API only returns available products.
- **Clinical accuracy** — Recommendations are driven by concern and step
  metadata, not just search.
- **Authentic quality** — Fits a pharmacist-led, “Digital Tray” experience.

You can call `getProductsByConcern(concern)` from the beauty assistant (or any
React code) when you have a detected concern, then pass
`regimenToTrayProducts(regimen)` into the Digital Tray component. The Edge
Function is for server-side or server-to-server use (e.g. from
`beauty-assistant` or analytics).
