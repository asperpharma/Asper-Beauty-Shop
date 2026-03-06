# Asper Beauty Shop — Design System & Headless Theme Structure

Based on the Asper Beauty Shop Strategic Brand & Execution Playbooks. This is a **Headless Commerce Application** using React 18, Vite, and Tailwind CSS, connected to the Shopify Storefront API — not a Shopify Liquid theme.

---

## 1. Brand & Design System: "Medical Luxury"

**Philosophy:** "We are dispensing beauty through intelligence." A shift from "Nightclub/Moody" to "Morning Spa/Clinical."

### Typography

| Use | Font | Role |
|-----|------|------|
| Headings | Playfair Display | The Voice of Luxury |
| Body | Montserrat | The Voice of Science |
| Arabic | Tajawal | Localization |

### Color Palette (Tailwind)

| Token | Hex | Role |
|-------|-----|------|
| canvas | `#F8F8FF` | Soft Ivory (Global Background) |
| action | `#800020` | Maroon (Primary Buttons/CTAs) |
| structure | `#C5A028` | Shiny Gold (Borders/Hover — "Midas Touch") |
| text | `#333333` | Dark Charcoal (Readability) |
| white | `#FFFFFF` | Pure White (Product Cards) |

---

## 2. Application Structure (React/Vite)

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui base components
│   ├── product/            # Product cards, Digital Tray
│   │   └── ProductCard.tsx
│   ├── layout/             # Header, Footer
│   └── tray/
│       └── DigitalTray.tsx # 3-Click Solution
├── hooks/
│   ├── useDigitalTray.ts   # Tray API
│   └── useCartStore        # Zustand
├── pages/
│   ├── ConcernsPage.tsx    # 3-Click Step 1
│   ├── ConcernRegimenPage  # 3-Click Step 2
│   └── CartPage.tsx
└── styles/
    └── index.css           # Global Ivory + typography
```

---

## 3. Key Component: "The Digital Tray" (Product Card)

- **Surface:** Pure white (`bg-white`) on Soft Ivory page
- **Hover:** 1px gold border (`border-shiny-gold` / `border-structure`) + subtle shadow
- **Transition:** 400ms ease-in-out ("Midas Touch")

---

## 4. Global CSS (Medical Luxury Base)

```css
body {
  background-color: #F8F8FF; /* Soft Ivory */
  color: #333333;            /* Dark Charcoal */
  font-family: 'Montserrat', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  color: #800020;            /* Maroon */
}
```

---

## 5. Platform & Framework

| Item | Value |
|------|-------|
| Platform | Custom Frontend (Headless) |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Deploy | Vercel / Lovable (Git push) |
| Data | Shopify Storefront API + Supabase |

---

## 6. Deliverable

You do **not** need a Theme ZIP. Push the repository to GitHub to trigger the Vercel/Lovable build pipeline.

---

## 7. Related docs (info structures)

| Doc | Purpose |
|-----|---------|
| **docs/BRAND_STRATEGY_MEDICAL_LUXURY.md** | Full brand pivot, visual identity, Midas Touch, dual-persona AI. |
| **docs/THEME_AND_PLATFORM_ANSWERS.md** | Platform answers (custom React/Vite, headless Shopify), shared CSS tokens, “full theme” handoff. |
| **docs/DIGITAL_TRAY_AND_PERSONAS.md** | Digital Tray concept, 3-Click Solution, Dr. Sami / Ms. Zain and where they live in code. |
