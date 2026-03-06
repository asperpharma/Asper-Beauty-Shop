# Matrixify Sheet: Product Brain Headers

Use these **exact headers** in your Matrixify export/import so the "Product
Brain" and Prescription Bridge work correctly. The **Tags** column is the
"brain" (Concern__, Step__). The **Ghost** columns are for future medical
features.

---

## 1. Required headers (copy into your spreadsheet)

| Column                                     | Description                                                                         | Example                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| **Handle**                                 | Shopify product handle (unique)                                                     | `vichy-normaderm-gel`                        |
| **Title**                                  | Product title                                                                       | `Vichy Normaderm Phytosolution`              |
| **Tags (The "Brain")**                     | Comma-separated tags: `Concern_*`, `Step_*`, optional `Texture_*`, `Barrier_Repair` | `Concern_Acne, Step_1_Cleanser, Texture_Gel` |
| **Variant Inventory Qty**                  | Stock quantity                                                                      | `150`                                        |
| **Metafield: custom.bestseller_rank**      | Bestseller order (1 = top)                                                          | `1`                                          |
| **Metafield: custom.biomarker_indication** | Ghost: biomarker(s) this product supports                                           | `Biomarker_Low_Hydration`                    |
| **Metafield: custom.contraindication**     | Ghost: e.g. pregnancy warning                                                       | `Pregnancy_Warning`                          |

---

## 2. Tag conventions (the "brain")

- **Concern_** — Primary skin concern (one per product for primary; multiple
  allowed):\
  `Concern_Acne`, `Concern_Hydration`, `Concern_Aging`, `Concern_Sensitivity`,
  etc.
- **Step_** — Regimen step:\
  `Step_1_Cleanser`, `Step_2_Treatment`, `Step_3_Protection`
- Optional: `Texture_Gel`, `Barrier_Repair`, and any custom tags.

---

## 3. Example rows (paste into Matrixify template)

```csv
Handle,Title,Tags (The "Brain"),Variant Inventory Qty,Metafield: custom.bestseller_rank,Metafield: custom.biomarker_indication,Metafield: custom.contraindication
vichy-normaderm-gel,Vichy Normaderm Phytosolution,"Concern_Acne, Step_1_Cleanser, Texture_Gel",150,1,,
lrp-hyalu-b5,La Roche-Posay Hyalu B5 Serum,"Concern_Hydration, Concern_Aging, Step_2_Treatment",85,3,Biomarker_Low_Hydration,
cerave-pm-lotion,CeraVe PM Facial Moisturizer,"Concern_Sensitivity, Step_3_Protection, Barrier_Repair",300,5,,
vichy-liftactiv-cream,Vichy LiftActiv Collagen,"Concern_Aging, Step_3_Protection",42,2,Biomarker_Low_Collagen,Pregnancy_Warning
```

---

## 4. Ghost columns (future medical features)

- **Metafield: custom.bestseller_rank** — Used for tie-breaking and "bestseller"
  ordering in `product_catalog.bestseller_rank`.
- **Metafield: custom.biomarker_indication** — Maps to
  `product_catalog.biomarker_target` for future "Ghost" / clinical matching.
- **Metafield: custom.contraindication** — Maps to
  `product_catalog.contraindications` for safety (e.g. pregnancy).

Ensure your Matrixify sheet uses these headers so the sync (webhook or scheduled
function) can populate the Supabase **product_catalog** and keep the 3-Click /
Prescription Bridge in sync with Shopify.
