# PageFly Configuration Guide: Section C - Featured Rituals

This guide provides the technical setup for your **"Mother's Day Edit"** product
grid in PageFly.

---

## 1. Element Placement

| Setting               | Value                                                 |
| --------------------- | ----------------------------------------------------- |
| **Element**           | Product List (under **Shopify Elements**)             |
| **Collection Source** | Select **"Collection"** from the data source dropdown |
| **Filter Query**      | Select the collection titled **Mothers Day 2024**     |
| **Product Limit**     | Set to **4** (to match the Tiered Strategy)           |

---

## 2. Layout & Grid (Styling Tab)

| Setting              | Value                                                |
| -------------------- | ---------------------------------------------------- |
| **Display Mode**     | Grid                                                 |
| **Items per Row**    | Desktop: **4** · Tablet: **2** · Mobile: **1**       |
| **Gutter (Spacing)** | **20px** (to maintain "Quiet Luxury" breathing room) |

---

## 3. Customizing the Product Card

Within the Product List, style the individual components as follows.

### A. Product Image

- **Hover Effect:** Set to **"Zoom In"** or **"Secondary Image"** to reveal the
  Macro Texture Shot.
- **Border:** Add a **1px solid** border in **#F7F3F1 (Cream)** as a subtle
  frame.

### B. Product Title

- **Font:** Playfair Display
- **Size:** 18px
- **Color:** #4A0E19 (Deep Burgundy)

### C. Price

- **Font:** Lato or Inter
- **Color:** #C9AA88 (Antique Gold)
- **Weight:** Bold

### D. Add to Ritual Button (CTA)

- **Text:** `Gift this Ritual` (A/B test winning variant)
- **Class Attribute:** Add **`asper-primary-btn`**
- **Interaction:** Ensure the button triggers the **"Stardust"** cursor trail on
  hover.

---

## 4. Automation Note

By using the **Mothers Day 2024** collection filter, PageFly will automatically
pull any new bundles you add to Shopify, provided they are tagged correctly.
This keeps your "Digital Concierge" inventory live without manual updates.

---

## Design Tokens Reference (Section C)

| Use                   | Value            |
| --------------------- | ---------------- |
| Cream (image frame)   | #F7F3F1          |
| Deep Burgundy (title) | #4A0E19          |
| Antique Gold (price)  | #C9AA88          |
| Display font          | Playfair Display |
| Body / price font     | Lato or Inter    |

_For the main React storefront (Authentic Quality), primary CTAs use Deep Maroon
#800020 and accents use Shiny Gold #C5A028._
