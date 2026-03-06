# Theme & Platform: Answers for “Full Theme” Requests

This doc answers common questions from theme/design proposals and locks in our **single source of truth** so any “full theme” (website + app) stays aligned with **Authentic Quality / Medical Luxury**.

---

## 1. Platform choices (answers to “who builds what”)

| Question | Answer for Asper Beauty |
|----------|-------------------------|
| **Shopify Online Store 2.0 vs custom frontend?** | **Custom frontend.** The main storefront is this React (Vite) app. Shopify is used as headless commerce (products, cart/checkout, orders) and for admin/back office. |
| **App theme: React/Vue, and which framework?** | **React**, with **Vite** (no Next.js). Same codebase for “website” and “app” — one SPA. |
| **Theme ZIP for Shopify or full React app repo?** | **This repo is the full theme.** We do not ship a separate Shopify Liquid theme ZIP as the primary storefront. Shopify theme (if any) is for fallback or specific landing pages; the main experience is this app. |

---

## 2. Brand colors and fonts (do not override)

We **do** have fixed brand requirements. Any “full theme” must use these; the proposal’s example palette (e.g. rose pink `#ec4899`) is **not** our brand.

| Role | Token | Value | Usage |
|------|--------|-------|--------|
| Background | Soft Ivory | `#F8F8FF` | Page/canvas; reduces eye strain |
| Surface | Pure White | `#FFFFFF` | Cards, modals |
| Primary / Action | Maroon | `#800020` | Buttons (e.g. “Quick Add”), CTAs, key links |
| Accent / Seal | Shiny Gold | `#C5A028` | Midas Touch border on hover, focus rings |
| Text | Dark Charcoal | `#333333` | Body and headings (avoid pure black) |

**Typography:**

- **Headings / “Voice of Luxury”:** Playfair Display (serif).
- **Body / “Voice of Science”:** Montserrat (sans-serif).
- **RTL / Arabic:** Tajawal.

Defined in: `tailwind.config.ts`, `src/index.css`, and [BRAND_STRATEGY_MEDICAL_LUXURY.md](./BRAND_STRATEGY_MEDICAL_LUXURY.md).

---

## 3. Full theme structure (website + app = this repo)

- **“Website”** = this React SPA (Vite), deployed (e.g. Netlify).
- **“Application”** = same SPA; no separate native app theme yet. If we add React Native later, we will reuse the same design tokens (palette + typography).

### Where the theme lives

| Piece | Location |
|-------|----------|
| Palette & design tokens | `tailwind.config.ts`, `src/index.css` (CSS variables) |
| Global layout, background | `src/App.tsx`, `src/index.css` (e.g. `body` → Soft Ivory) |
| Product cards (Midas Touch) | `src/components/product/ProductCard.tsx` |
| Buttons, forms, UI | `src/components/` + Tailwind + shadcn/ui |
| Brand and behavior rules | `docs/BRAND_STRATEGY_MEDICAL_LUXURY.md` |

### Shared “theme” values (for handoff or config)

Use these in any external theme/config (e.g. Shopify section settings or a future design-token export):

```css
:root {
  --color-bg: #F8F8FF;        /* Soft Ivory */
  --color-surface: #FFFFFF;   /* Pure White */
  --color-primary: #800020;   /* Maroon */
  --color-accent: #C5A028;    /* Shiny Gold */
  --color-text: #333333;     /* Dark Charcoal */
  --font-heading: "Playfair Display", serif;
  --font-body: "Montserrat", sans-serif;
  --radius: 0.5rem;
}
```

Product card hover (Midas Touch): `border: 1px solid #C5A028`, transition `400ms ease-in-out`, optional shadow `0 10px 30px -10px rgba(197, 160, 40, 0.15)`.

---

## 4. Design goals (already aligned)

- Modern, clean, professional → **Authentic Quality / Clean Science.**
- Brand-colored → **Soft Ivory, Maroon, Shiny Gold, Dark Charcoal** (see above).
- Mobile-responsive, touch-friendly → Target; audit as needed.
- Visual, conversion-focused → Product grids, clear price, “Quick Add,” 3-Click Solution (Analyze → Recommend → Regimen).
- Speed & accessibility → Ongoing (contrast, focus states, performance).
- Extensible → TypeScript, Tailwind, section-friendly structure where applicable.

---

## 5. What we don’t want

- A **different** primary palette (e.g. rose pink, different gold) for the main app.
- A **Liquid-only** Shopify theme as the main storefront (Shopify is headless for this project).
- Duplicate “theme” docs that conflict with `BRAND_STRATEGY_MEDICAL_LUXURY.md` or `tailwind.config.ts`.

---

## 6. Summary for external partners / AI

- **Platform:** Custom React (Vite) SPA; Shopify headless.
- **Theme:** This repo; design system in `tailwind.config.ts` + `src/index.css` + `BRAND_STRATEGY_MEDICAL_LUXURY.md`.
- **Colors/fonts:** Fixed (Soft Ivory, Maroon, Shiny Gold, Dark Charcoal; Playfair + Montserrat).
- **No theme ZIP** as primary deliverable; “full theme” = this codebase + the above tokens and rules.
