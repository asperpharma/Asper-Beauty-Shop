# Digital Tray & Dual-Persona AI (Dr. Sami / Ms. Zain)

Based on the Asper Beauty Shop Strategic Playbooks and Authentic Quality framework.

---

## The Digital Tray Concept

The Digital Tray reframes online shopping from "consuming products" to "receiving a professional prescription." It addresses:

- **Decision paralysis** — Too many choices; the tray curates a complete regimen.
- **Counterfeit anxiety** — Visual cues signal vetted, safe, original products.

### Three Key Mechanisms

#### 1. Solving Decision Paralysis: "Prescription" vs. "Browsing"

- **Standard retail:** Endless scrolling through thousands of items.
- **Digital Tray:** Final step of the 3-Click Solution (Analyze → Recommend → Regimen).
- **Improvement:** The AI Concierge curates a complete regimen (cleanser, serum, moisturizer) and presents it on the tray instead of forcing the user to hunt for each item.
- **Result:** Replaces cognitive load with acceptance, mimicking a pharmacist presenting a tray at the counter.

#### 2. Building Trust: Visual Semiotics of Authority

- **Midas Touch:** 1px gold border on hover acts as the "Pharmacist's Seal of Authenticity," signaling certified original.
- **Clinical Clarity:** Pure white cards on Soft Ivory (#F8F8FF) background. High-contrast "Clean Science" design evokes a clinic or spa.

#### 3. Elevating Value: The "Morning Spa" Vibe

- Shifts emotional context from "transactional purchase" to "investment in self-care."
- Positions the brand as Pharmacist-Curated Authority.
- "We dispense beauty through intelligence."

---

## Dual-Persona AI Architecture

Dr. Sami and Ms. Zain are two distinct "voices" from a single Centralised Brain (Google Gemini). The system acts as a "Director," analyzing user intent to switch between them instantly. They share the same memory.

### Dr. Sami: The "Voice of Science" (Clinical Authority)

| Attribute | Description |
|-----------|-------------|
| **Role** | Ensure clinical safety; provide wellness guidance (not medical diagnosis). |
| **Triggers** | Pregnancy safety, dosage, contraindications, supplements (Rigenforte, Vitamins), medical devices (Omron), pathology (Eczema, Rosacea), Shipping/Returns/COD. |
| **Tone** | Authoritative, precise, reassuring, safety-focused. |
| **Signature** | "- Dr. Sami, Asper Clinical Support" |

### Ms. Zain: The "Voice of Luxury" (Aesthetic Guide)

| Attribute | Description |
|-----------|-------------|
| **Role** | Drive sales via 3-Click Solution; provide editorial advice. |
| **Triggers** | Makeup shades, "Glass Skin," "Glow" routines, luxury fragrance, gift ideas, cosmetic bundles. |
| **Tone** | Warm, editorial, enthusiastic; "Morning Spa" vocabulary (Radiance, Ritual). |
| **Signature** | "- Ms. Zain, Your Beauty Concierge" |

### The "Hand-Off"

Because they share memory:

- Ask Ms. Zain for a lipstick → she recommends a shade.
- Ask "Is this safe while pregnant?" → Director switches to Dr. Sami. He recalls the lipstick, checks ingredients, and gives a clinical answer.

---

## Where It Lives in Code

| Piece | Location |
|-------|----------|
| Digital Tray UI | `DigitalTray.tsx`, `RegimenPage.tsx`, `ConcernRegimenPage.tsx` |
| 3-Click Flow | `AnalyzePage.tsx` → `RecommendPage.tsx` → `RegimenPage.tsx` |
| Tray API | `useDigitalTray` hook (`src/hooks/useDigitalTray.ts`), `tray` Edge Function |
| Personas | `beauty-assistant` Edge Function (system prompt) |
| Supabase client | `src/lib/supabase.ts` (Notes, optional; uses `VITE_SUPABASE_PUBLISHABLE_KEY`) |

---

## Related docs

- **docs/BRAND_STRATEGY_MEDICAL_LUXURY.md** — Authentic Quality, Midas Touch, dual-persona strategy.
- **docs/DESIGN_SYSTEM.md** — Design tokens, app structure, product card (Midas Touch).
- **docs/THEME_AND_PLATFORM_ANSWERS.md** — Platform (custom React/Vite, headless Shopify) and theme handoff.
