# Copilot instructions for Asper-Beauty-Shop

Purpose: Give AI coding agents the minimum context to be immediately productive in this repo.

## Quick Start
- **Dev**: `npm run dev` (port 8080) • **Build**: `npm run build` • **Preview**: `npm run preview`
- **Stack**: React 18 + TypeScript + Vite, Tailwind CSS, shadcn/ui (Radix primitives), Zustand, TanStack Query
- **Production**: https://www.asperbeautyshop.com (custom domain)
- **Lovable Dev**: https://asperbeautyshop.lovable.app (integrated with Lovable platform for hot reload)

## Architecture (Big Picture)

**Frontend-only SPA** that talks to:
1. **Shopify Storefront API** (`lovable-project-milns.myshopify.com`) — product catalog, checkout
2. **Supabase** (`rgehleqcubtmcwyipyvi.supabase.co`) — auth, serverless functions (beauty-assistant AI, bulk-product-upload)

**Provider hierarchy** (see `src/App.tsx`):
```
QueryClientProvider → LanguageProvider → TooltipProvider → BrowserRouter → Routes
```

**Data flow**: Pages call `src/lib/shopify.ts` functions (fetchProducts, fetchProductsPaginated, searchProducts, createStorefrontCheckout) which hit Shopify GraphQL. Products are categorized via `src/lib/categoryMapping.ts` (maps Shopify products to 6 primary collections: skin-care, hair-care, make-up, body-care, fragrances, tools-devices). Pages use plain useEffect/useState (no TanStack Query in practice despite provider setup).

**State management**: Zustand stores with localStorage persistence:
- `src/stores/cartStore.ts` — shopping cart (items, checkout URL, quantities)
- `src/stores/wishlistStore.ts` — saved products

## Key Patterns & Conventions

**Routing**: `src/pages/*` map to routes via React Router v6 (see `src/App.tsx` for all routes). Examples: `/`, `/product/:handle`, `/collections/:slug`, `/brands`.
- **Admin routes**: `/admin/bulk-upload` and `/admin/orders` are protected by `<RequireAdmin>` wrapper which checks `useAuth().isAdmin` (requires Supabase auth session with admin role).

**Components**:
- **Pages**: `src/pages/*` (Index, Collections, ProductDetail, Brands, Auth, Account, etc.)
- **Reusable UI**: `src/components/*` (Header, Footer, ProductCard, CartDrawer, BeautyAssistant, etc.)
- **Design system**: `src/components/ui/*` (shadcn/ui primitives — Button, Dialog, Drawer, Toast, etc.)

**Hooks**: `src/hooks/` — custom hooks use `useX` naming (useAuth, useToast, useMobile, useScrollAnimation).

**i18n (bilingual EN/AR)**:
- Language context: `src/contexts/LanguageContext.tsx` provides `{ language, setLanguage, t }` hook.
- Persisted in localStorage as `'asper-language'`.
- RTL layout auto-applied when `language === 'ar'` (CSS via Tailwind `rtl:` variants).
- Product titles/descriptions translated via `src/lib/productUtils.ts` (translateTitle, translateDescription — maps English terms to Arabic).

**Design tokens** (Tailwind config):
- Colors: `--maroon` (#800020), `--soft-ivory` (#F8F8FF), `--shiny-gold` (#C5A028), `--dark-charcoal` (#333333)
- Fonts: Playfair Display (headings), Montserrat (body), Tajawal (Arabic)

## Integration Points

**Shopify** (`src/lib/shopify.ts`):
- API version: `2025-07`
- Storefront token: public read-only (safe for client-side)
- Functions: fetchProducts, fetchProductsPaginated (cursor-based for large catalogs), searchProducts (sanitizes input to prevent GraphQL injection), fetchProductByHandle, createStorefrontCheckout (returns Shopify-hosted checkout URL)
- All products are fetched via GraphQL queries; no REST API usage.

**Supabase** (`supabase/functions/`, `src/integrations/supabase/`):
- Functions: `beauty-assistant` (AI chatbot via Lovable AI Gateway at `ai.gateway.lovable.dev` using Gemini 2.5 Flash), `bulk-product-upload` (admin tool)
- Config: `supabase/config.toml` (verify_jwt = false for functions)
- Client: `src/integrations/supabase/client.ts` (auto-refresh sessions, persistent auth via localStorage)

**Product categorization** (`src/lib/categoryMapping.ts`):
- Maps products to 6 collections via keyword matching on title/productType/vendor.
- Categories: skin-care, hair-care, make-up, body-care, fragrances, tools-devices.
- Each category has slug, title, titleAr, description, descriptionAr, keywords array.

**Lovable integration** (`vite.config.ts`, `lovable.config.json`):
- Uses `lovable-tagger` plugin for hot reload component tagging.
- Dev server on port 8080 with IPv6 (`host: "::"`).
- Custom domain: www.asperbeautyshop.com (redirects from non-www, enforces HTTPS via `public/_redirects`)
- Lovable development URL: asperbeautyshop.lovable.app
- SPA redirects configured in `public/_redirects` (all routes → `/index.html` 200)

**Environment variables** (`.env` for dev, `.env.production` for prod):
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase connection
- `VITE_SHOPIFY_STORE_DOMAIN` / `VITE_SHOPIFY_STOREFRONT_TOKEN` / `VITE_SHOPIFY_API_VERSION` — Shopify config (hardcoded in `src/lib/shopify.ts` currently)
- `VITE_SITE_URL` / `VITE_LOVABLE_URL` — URLs for canonical/social meta tags (production only)

## Common Tasks

**Add a new component**:
1. Create file in `src/components/` (or `src/components/ui/` for design-system primitives)
2. Follow shadcn/ui patterns for UI components (import from `@/components/ui/*`)
3. Use `useLanguage()` hook for bilingual support

**Fetch/display products**:
1. Import functions from `src/lib/shopify.ts` (fetchProducts, fetchProductsPaginated, searchProducts)
2. Call in useEffect, store in useState (no TanStack Query hooks used in practice)
3. Map products to `<ProductCard>` components
4. Use `categorizeProduct()` from `src/lib/categoryMapping.ts` to filter by collection

**Add to cart**:
1. Import `useCartStore()` from `src/stores/cartStore.ts`
2. Call `addItem({ product, variantId, variantTitle, price, quantity, selectedOptions })`
3. Cart auto-persists to localStorage; drawer updates via Zustand re-render

**Checkout flow**:
1. User clicks "Checkout" in CartDrawer
2. Calls `cartStore.createCheckout()` which invokes `createStorefrontCheckout()` from `src/lib/shopify.ts`
3. Redirects to Shopify-hosted checkout URL (`window.location.href = checkoutUrl`)
4. Alternative: COD (Cash on Delivery) flow via `<CODCheckoutForm>` submits to Supabase for order processing

**Add serverless function**:
1. Create folder in `supabase/functions/` (e.g. `supabase/functions/my-function/`)
2. Add entry in `supabase/config.toml` (set `verify_jwt = false` if public)
3. Deploy via Supabase CLI: `supabase functions deploy my-function`

## Developer Workflows

**Local dev**: `npm install` → `npm run dev` (Vite dev server on http://localhost:8080)
**Lint**: `npm run lint` (ESLint with React hooks plugin, TypeScript ESLint)
**Build**: `npm run build` (production) → `npm run preview` (preview prod bundle locally)
**Build (dev mode)**: `npm run build:dev` — builds with dev environment variables
**Verify changes**: Run build and preview to validate (no unit tests in repo)
**Audit categories**: `npx tsx scripts/audit-categories.ts` — analyzes Shopify products, identifies category mismatches, generates report (useful after bulk uploads)

## Safety Notes

- No unit tests; validate via build + preview + manual testing.
- Shopify Storefront token is public (read-only access to products only).
- Lovable platform integration means changes may sync to hosted preview (see README).
- Search input sanitized in `shopify.ts` to prevent GraphQL injection.
- Product images loaded via `<OptimizedImage>` component (see `src/components/OptimizedImage.tsx`) for performance.

## Business Information

**Contact**: +962 79 065 6666 | asperpharma@gmail.com | Amman, Jordan
**Hours**: Sun-Thu 9 AM - 8 PM
**Company**: Asper Beauty Shop (part of Asper Pharma, est. 2024)
**Social**: 9 platforms (Instagram, Facebook, TikTok, WhatsApp, X, YouTube, LinkedIn, Snapchat, Pinterest)
**Shipping**: Free shipping over 50 JOD, standard shipping 3 JOD, delivery 2-4 business days across Jordan

For more detail on a specific area (routing, checkout flow, Supabase functions, category mapping), ask and I'll provide concrete file pointers and examples.
