# Advantages & Platforms — Single Source

**Last updated:** January 2026\
**Purpose:** One place for “Our Advantages” and where they appear across all
platforms.\
**Source of truth (app):** `src/lib/advantagesContent.ts`

---

## Our advantages (why shop with us)

These three points are shown on the website and should stay consistent
everywhere.

| # | English                                             | Arabic                                    | Short tag     |
| - | --------------------------------------------------- | ----------------------------------------- | ------------- |
| 1 | **Guaranteed Authentic** — We compete against fakes | **أصالة مضمونة** — نحارب المنتجات المقلدة | Authentic     |
| 2 | **Pharmacist Verified** — We are experts            | **معتمد من الصيدلي** — خبراء متخصصون      | Expert        |
| 3 | **Amman Concierge Delivery** — We are fast          | **توصيل سريع في عمّان** — سرعة فائقة       | Fast delivery |

**Where they appear**

- **Website:** Home page → “Trust” strip (below Newsletter), component:
  `TrustBanner.tsx`
- **Content source:** `src/lib/advantagesContent.ts` (single source; TrustBanner
  imports it)
- **Docs:** This file, README “Our advantages”, NEXT_STEPS

---

## Platforms we use

### Website & app

| Platform          | Role                | URL / ref                                                          |
| ----------------- | ------------------- | ------------------------------------------------------------------ |
| **Production**    | Live site           | [www.asperbeautyshop.com](https://www.asperbeautyshop.com)         |
| **Dev / preview** | Lovable             | [asperbeautyshop.lovable.app](https://asperbeautyshop.lovable.app) |
| **Shopify**       | E‑commerce          | lovable-project-milns.myshopify.com                                |
| **Supabase**      | Auth, DB, functions | rgehleqcubtmcwyipyvi.supabase.co                                   |

### Social (9 platforms)

| Platform    | Handle / link                                                      | Where on site                    |
| ----------- | ------------------------------------------------------------------ | -------------------------------- |
| Instagram   | [@asper.beauty.shop](https://www.instagram.com/asper.beauty.shop/) | Footer, FloatingSocials, Contact |
| Facebook    | Asper Beauty Shop                                                  | Footer, FloatingSocials, Contact |
| TikTok      | @asper.beauty.shop                                                 | Footer, FloatingSocials, Contact |
| WhatsApp    | [+962 79 065 6666](https://wa.me/962790656666)                     | Footer, FloatingSocials, Contact |
| X (Twitter) | @asperbeautyshop                                                   | Footer, FloatingSocials, Contact |
| YouTube     | Asper Beauty Shop                                                  | Footer, FloatingSocials, Contact |
| LinkedIn    | company/asper-beauty-shop                                          | Footer, FloatingSocials, Contact |
| Snapchat    | @asperbeautyshop                                                   | Footer, FloatingSocials, Contact |
| Pinterest   | asperbeautyshop                                                    | Footer, FloatingSocials, Contact |

Details: [SOCIAL_MEDIA_INTEGRATION.md](../SOCIAL_MEDIA_INTEGRATION.md).

---

## What we have to do now

Same 5 priorities as in [NEXT_STEPS.md](../NEXT_STEPS.md). For full deployment
steps (health checks, PR, DNS, verify), see [NEXT_STEPS.md](../NEXT_STEPS.md).

| Priority | Task                                                                 | Status |
| -------- | -------------------------------------------------------------------- | ------ |
| 1        | Merge PR to `main` (auto-deploys)                                    | [ ]    |
| 2        | (Optional) DNS: CNAME www → asperbeautyshop.lovable.app              | [ ]    |
| 3        | Verify site: homepage, advantages strip, 9 social links, cart, EN/AR | [ ]    |
| 4        | Submit sitemap (Google, Bing)                                        | [ ]    |
| 5        | (Optional) PageSpeed, Analytics                                      | [ ]    |

### Before / at launch

- [ ] Merge open PR to `main` (Lovable deploys automatically).
- [ ] (Optional) Configure DNS for www.asperbeautyshop.com: CNAME `www` →
      `asperbeautyshop.lovable.app`.

### After launch — verify

- [ ] Homepage loads; advantages (TrustBanner) and all 9 social links visible.
- [ ] Products, cart, checkout (Shopify), Arabic/English switch, mobile layout.
- [ ] Test all 9 social links from Footer / Contact / FloatingSocials.

### After launch — SEO & growth

- [ ] Submit sitemap:
      [Google Search Console](https://search.google.com/search-console),
      [Bing Webmaster](https://www.bing.com/webmasters) — URL:
      `https://www.asperbeautyshop.com/sitemap.xml`.
- [ ] (Optional) PageSpeed Insights, Core Web Vitals, Google Analytics.

### Optional later

- [ ] Email notifications for orders.
- [ ] Code splitting (if bundle size becomes an issue).
- [ ] Two-factor authentication for admins.
- [ ] Category audit (if/when Shopify access allows).

---

## Updating advantages everywhere

1. **Edit once:** `src/lib/advantagesContent.ts` — add/change titles and
   descriptions (EN/AR).
2. **Icons:** In `TrustBanner.tsx`, keep `ICON_MAP` in sync with `iconKey` in
   `advantagesContent.ts`.
3. **Docs:** Update the “Our advantages” table at the top of this file and any
   “Why shop with us” text in README or NEXT_STEPS.

No other code changes are required for the home page; TrustBanner already reads
from `advantagesContent.ts`.
