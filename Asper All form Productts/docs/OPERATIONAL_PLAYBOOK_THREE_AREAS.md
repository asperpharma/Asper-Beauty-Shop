> **Strategic Context:** This operational guide executes the vision defined in the [Brand Strategy Manual](BRAND_STRATEGY_MEDICAL_LUXURY.md). Refer to that document for all visual standards (Hex codes) and AI persona definitions.

# Asper Strategic Playbook — Three Operational Areas

This document captures the three operational areas from the Asper Strategic
Playbooks and technical architecture: Medical Safety (Ghost Protocol), Clinical
Science Photography, and Digital Tray & Out-of-Stock Logic.

---

## 1. Triggering the Automated Medical Safety Check (Ghost Protocol)

**Owner:** Digital Concierge (AI Employee). **No code changes** — logic lives in
the AI/conversation layer.

### Trigger

The check is initiated by the **"Ghost Protocol"** the moment a user mentions:

- An internal health issue, or
- A specific deficiency

**Examples:** _"I'm feeling anemic"_, _"I have low iron"_.

### Logic

1. The AI **tags the conversation** with a specific **Biomarker** (e.g.
   `[Biomarker: Iron_Deficiency]`).
2. It **cross-references** this against **product tags** for
   **contraindications** (e.g. `Pregnancy_Warning`).
3. The **3-Click Solution** must **not recommend** any product that could
   interfere with the user’s health profile.

### Implementation notes

- Biomarker tagging and contraindication checks are part of the Concierge / AI
  prompt and product metadata (tags), not front-end UI.
- Ensure product catalog and Concierge logic keep biomarker and contraindication
  tags in sync.

---

## 2. Rules for Clinical Science Photography

We use a **"Clean Science"** aesthetic instead of typical lifestyle shots.

### Do

| Rule          | Specification                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Lighting**  | **High-Key Lighting** for "Clinical Brightness"; incorporate **natural morning sunlight** for a "Morning Spa" feel. |
| **Textures**  | **Macro textures** and **"Suspended Gold"** (e.g. individual serum drops, cream swirls).                            |
| **Grounding** | **Marble** and **organic textures** to ground the luxury elements.                                                  |

### No-Go Zone

- No **artificial neon**.
- No **heavy shadows** that hide labels.
- No **cluttered frames**.

Everything must follow **"Pharmacist’s Logic"**: clear, accurate, trustworthy.

### Implementation notes

- Use these rules when commissioning or generating assets (e.g.
  `generate_all_product_images.py` prompts, briefs for photographers, or AI
  image tools).
- Product imagery in the app should align with this spec (see also
  [UI-UX-CHANGES-GUIDE.md](UI-UX-CHANGES-GUIDE.md)).

---

## 3. Digital Tray & Out-of-Stock Logic

The **Digital Tray** is a mini **"Consultation Room"** UI component.

### Display

- Products appear on **Pure White** card components.
- Background: **Ivory** (Soft Ivory / design tokens).
- Aligns with design: _"Product Cards: Pure White base"_ (see
  [UI-UX-CHANGES-GUIDE.md](UI-UX-CHANGES-GUIDE.md)).

### Out-of-Stock (OOS) Handling

- The tray uses the logic embedded in the **Product Card** component.
- If an item is **out of stock**:
  - The primary action button (e.g. **"Quick Add"** / **"Add to Regimen"**)
    transitions to an **"Out of Stock"** state.
  - The button is **grayed out** and non-clickable.
- **Goal:** Even if one or more items are OOS, the tray **still renders the full
  routine** so the 3-Click flow is visible; the user can **Quick Add** only the
  **available** items.

### Implementation (current)

- **Digital Tray:** `src/components/tray/DigitalTray.tsx` — passes
  `isAvailable={slot.inventory_total > 0}` to each `ProductCard`.
- **Product Card:** `src/components/product/ProductCard.tsx` — accepts
  `isAvailable`; when `false`, shows **"Out of Stock"** and disables the button
  (gray style).
- Slots with no product show **"Consult Pharmacist"** (fallback card); OOS
  products still show the card with the OOS state.

---

## References

- [UI-UX-CHANGES-GUIDE.md](UI-UX-CHANGES-GUIDE.md) — Design tokens, Soft Ivory,
  Pure White cards.
- [TRAY_API.md](TRAY_API.md) — Tray Edge Function and product/slot data.
- Product tagging / biomarkers — Concierge and catalog (e.g. contraindications,
  biomarker tags).
