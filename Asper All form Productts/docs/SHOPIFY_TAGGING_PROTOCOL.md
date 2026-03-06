# 🏷️ Shopify Tagging Protocol

**Purpose:** Bridge the gap between your 5,000 SKUs and the Concierge "Brain"
(`src/data/concierge_logic.json`).

For the 3-Click logic to work, products in Shopify **must** use these exact
tags. The React app and Gorgias filter by `shopify_tag` / product tags.

**Action:** Go to **Shopify Admin > Products** and apply these tags to the
relevant SKUs.

---

## Tag Mapping

| Concern Flow     | Required Product Tags                      | Brand Example                  |
| ---------------- | ------------------------------------------ | ------------------------------ |
| **Acne**         | `Concern_Acne`, `SkinType_Oily`            | Vichy Normaderm, LRP Effaclar  |
| **Anti-Aging**   | `Concern_AntiAging`, `Ingredient_VitaminC` | Vichy LiftActiv, LRP Redermic  |
| **Hydration**    | `Concern_Dryness`, `Ingredient_Hyaluronic` | Vichy Aqualia, CeraVe Cream    |
| **Sensitivity**  | `Concern_Sensitivity`, `Safe_Rosacea`      | LRP Toleriane, Avene Tolerance |
| **Authenticity** | `Authentic_Guarantee`                      | All Products                   |

---

## Tag Reference

| Tag                     | Use Case                       |
| ----------------------- | ------------------------------ |
| `Concern_Acne`          | Acne & Oil Control flow        |
| `Concern_AntiAging`     | Anti-Aging & Wrinkles flow     |
| `Concern_Dryness`       | Hydration & Glow flow          |
| `Concern_Sensitivity`   | Sensitivity & Redness flow     |
| `SkinType_Oily`         | Oily skin products             |
| `Ingredient_VitaminC`   | Vitamin C serums               |
| `Ingredient_Hyaluronic` | Hyaluronic acid products       |
| `Safe_Rosacea`          | Suitable for rosacea           |
| `Authentic_Guarantee`   | Mark all products as authentic |

---

## Step Tags (Bridge Logic)

For `getProductsByConcern` to return a 3-step regimen, each product must have
both a Concern tag and a Step tag:

| Step Tag            | Use Case          |
| ------------------- | ----------------- |
| `Step_1_Cleanser`   | Cleanse / Fortify |
| `Step_2_Treatment`  | Treat / Correct   |
| `Step_3_Protection` | Protect / Restore |

**Execution rule:** A product must have both a Concern tag and a Step tag to
appear in a tray.

---

## Matrixify / CSV Fields

Required fields for import and Bridge logic:

| Field                                     | Purpose                                            |
| ----------------------------------------- | -------------------------------------------------- |
| `handle`                                  | Shopify handle (URL slug)                          |
| `title`                                   | Product name                                       |
| `product_type`                            | Category                                           |
| `tags`                                    | Comma-separated; must include Concern_* and Step_* |
| `inventory_quantity` or `inventory_total` | Live stock check (do not prescribe out-of-stock)   |

Optional (for tie-breakers):

| Field             | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `bestseller_rank` | Higher = preferred when multiple for step |
| `hero`            | Hero tag = highest priority               |

---

## Tie-Breaker Rules

When multiple products match the same Concern + Step:

1. **Hero tag** (if present) — highest priority
2. **Bestseller rank** — higher rank preferred
3. **Fallback** — `created_at DESC`, then `handle ASC`

---

## Inventory

- **Scope:** Single global inventory (no per-location logic)
- **In stock:** `inventory_total > 0` (or equivalent)

---

## Consistency Rule

Tag names must match **exactly** (case-sensitive). The Concierge filters Shopify
collections by `shopify_tag` in `concierge_logic.json`.
