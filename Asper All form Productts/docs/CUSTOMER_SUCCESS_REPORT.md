# Asper Digital Pharmacy Rounds

**Frequency:** Weekly\
**Purpose:** Track how well the 3-Click Solution is selling products during the
Soft Opening.

---

## Report Template (Google Sheet / Notion)

Copy these columns into a spreadsheet to track your weekly "Pharmacist Rounds."

| Metric                      | "Pharmacist" Insight                                   | Target         |
| --------------------------- | ------------------------------------------------------ | -------------- |
| **Top Skin Concern**        | e.g., 60% of users clicked "Acne & Blemishes"          | Monitor Trends |
| **Most Prescribed SKU**     | e.g., Vichy Normaderm Phytosolution                    | Stock Check    |
| **Consultation Completion** | % of users who finished the 3-Click Quiz               | > 40%          |
| **Prescription Conversion** | % of users who added the recommended item to cart      | > 15%          |
| **Trust Signal**            | Number of "Is this authentic?" queries answered by bot | Track Trust    |
| **COD Rate**                | % of orders using Cash on Delivery                     | Expect > 70%   |

---

## How to Use

1. Create a Google Sheet or Notion database with the columns above.
2. Add a row per week (e.g., Week 1, Week 2).
3. Pull data from:
   - **Supabase** (`as_concierge_events`, `consultations`) for intent and
     completion rates
   - **Shopify** Orders dashboard for COD rate and top SKUs
   - **Gorgias** for trust/authenticity query counts
4. Compare "Pharmacist Insight" against Target to adjust messaging, stock, or
   flow.

---

## Sample Weekly Entry

| Week | Top Concern | Most Prescribed SKU | Completion % | Conversion % | Trust Queries | COD Rate |
| ---- | ----------- | ------------------- | ------------ | ------------ | ------------- | -------- |
| 1    | Acne (58%)  | Vichy Normaderm     | 42%          | 18%          | 12            | 72%      |
