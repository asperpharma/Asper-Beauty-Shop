# Asper Beauty Shop - AI Coding Agent Instructions

## Project Overview
Luxury e-commerce storefront for premium beauty products built with React 18 + TypeScript, Vite, Tailwind CSS, and Shopify Storefront API. Supports bilingual (English/Arabic) with RTL layout for Arabic. Built with [Lovable](https://lovable.dev) - changes sync automatically between Lovable and GitHub.

## Architecture & Key Design Decisions

### State Management Pattern
- **Zustand stores** (not Redux/Context API): `src/stores/cartStore.ts`, `wishlistStore.ts`
- Stores use `persist` middleware with `localStorage` for cart/wishlist persistence
- Access via hooks: `useCartStore()`, `useWishlistStore()`

### Shopify Integration (`src/lib/shopify.ts`)
- Uses **Shopify Storefront API** (GraphQL) - NOT Admin API or REST
- Storefront token is client-safe (read-only public data)
- All products fetched via `storefrontApiRequest()` wrapper
- **Critical**: Sanitize search inputs with `sanitizeSearchTerm()` to prevent GraphQL injection
- Product interface: `ShopifyProduct` - includes `tags?: string[]` and `createdAt?: string` for filtering

### Product Categorization (`src/lib/categoryMapping.ts`)
- Six primary categories: `skin-care`, `hair-care`, `make-up`, `body-care`, `fragrances`, `tools-devices`
- `CATEGORIES` constant defines slug, titles (EN/AR), descriptions, and keyword matchers
- Use `categorizeProduct(title, productType, vendor)` to map products to categories
- **Important**: Keywords array drives product-to-category classification

### Internationalization (`src/contexts/LanguageContext.tsx`)
- Two languages: English (LTR) and Arabic (RTL)
- Access via `useLanguage()` hook: `{ language, setLanguage, t, isArabic }`
- All translations stored in `Translations` interface - extend this when adding new strings
- **Convention**: Use `isArabic` for conditional rendering, `t('key')` for translations
- RTL handled automatically by Tailwind directives in `index.css`

### UI Component Library
- **shadcn/ui** (Radix UI primitives) in `src/components/ui/`
- Installed via `components.json` config - DO NOT manually edit UI components
- Use `cn()` utility from `src/lib/utils.ts` for className merging
- Custom luxury design tokens in `tailwind.config.ts`: `--maroon`, `--soft-ivory`, `--shiny-gold`, `--dark-charcoal`

### Data Fetching
- TanStack Query (React Query) for async state - NOT raw `useEffect`
- Wrapped in `QueryClientProvider` in `App.tsx`
- Example: `useQuery({ queryKey: ['products'], queryFn: fetchProducts })`

### Routing Structure
- React Router v6 - routes defined in `App.tsx`
- Key patterns:
  - `/collections/:slug` - dynamic collection pages
  - `/product/:handle` - product detail with Shopify handle
  - `/brands/vichy` - brand-specific page (only Vichy implemented)
  - Admin routes wrapped in `<RequireAdmin>` component

## Development Workflow

### Essential Commands
```bash
npm run dev          # Start dev server (Vite, typically port 5173)
npm run build        # Production build (outputs to dist/)
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

### Type Safety Rules
- **Never use `any` type** in core shopping components (ProductCard, Cart, Checkout, etc.)
- Extend `ShopifyProduct` interface in `shopify.ts` if new product fields needed
- Use `unknown` for error catches, not `any`: `catch (error: unknown)`
- Empty interfaces are anti-pattern - use type aliases: `type Props = BaseProps`

### React Patterns to Follow
- **React Hooks**: Always call unconditionally - NO early returns before hooks
  ```typescript
  // ❌ WRONG - violates Rules of Hooks
  if (!data) return null;
  useEffect(() => { ... }, [deps]);

  // ✅ CORRECT
  useEffect(() => {
    if (!data) return;
    // ...
  }, [deps]);
  if (!data) return null;
  ```
- Wrap callbacks in `useCallback` when passed to dependency arrays
- Use `useMemo` for expensive category/product filtering operations

### Styling Conventions
- Tailwind utility-first - NO custom CSS files except `index.css` for globals
- Luxury brand colors: `bg-maroon`, `text-gold`, `border-gold`
- Typography: `font-display` (Playfair Display for headings), `font-body` (Montserrat)
- Arabic font: `font-arabic` (Tajawal) - auto-applies in RTL mode
- Responsive: Mobile-first breakpoints (`md:`, `lg:`)

### Security Practices
- **GraphQL injection**: Always use `sanitizeSearchTerm()` for user search inputs
- Shopify Storefront token is public-safe but DO NOT expose Admin API keys
- COD orders stored in Supabase `cod_orders` table - validate user inputs server-side
- Run `npm audit fix` to patch dependency vulnerabilities (especially react-router-dom)

## Common Tasks

### Adding a New Product Category
1. Add entry to `CATEGORIES` in `src/lib/categoryMapping.ts` with keywords
2. Update `Translations` interface in `LanguageContext.tsx` with EN/AR names
3. Add route in `App.tsx`: `<Route path="/collections/:slug" />`
4. Create collection image in `src/assets/categories/`

### Extending ShopifyProduct Interface
1. Update `ShopifyProduct` interface in `src/lib/shopify.ts`
2. Add field to GraphQL queries: `STOREFRONT_PRODUCTS_QUERY` and `STOREFRONT_PRODUCTS_PAGINATED_QUERY`
3. Update components using product data (e.g., `ProductCard.tsx`)

### Adding Translation Strings
1. Extend `Translations` interface in `LanguageContext.tsx`
2. Add English value to `englishTranslations`
3. Add Arabic value to `arabicTranslations`
4. Use via `t('newKey')` in components

### Debugging Shopify Integration
- Check browser Network tab for GraphQL requests to `myshopify.com/api/*/graphql.json`
- Common errors:
  - 402: Shopify store needs paid plan upgrade
  - GraphQL syntax errors: Validate query structure
  - Missing products: Check product availability and published status in Shopify admin

## File Organization
```
src/
├── components/        # Reusable UI (ProductCard, Header, Footer, etc.)
│   └── ui/           # shadcn/ui primitives (Button, Dialog, etc.)
├── contexts/         # React Context providers (LanguageContext only)
├── hooks/            # Custom hooks
├── lib/              # Core utilities
│   ├── shopify.ts    # Shopify API integration
│   ├── categoryMapping.ts  # Product categorization logic
│   └── utils.ts      # Helper functions (cn, etc.)
├── pages/            # Route components (Index, ProductDetail, etc.)
├── stores/           # Zustand stores (cart, wishlist)
└── integrations/     # External service integrations (Supabase)
```

## Testing & Validation
- **Before committing**: Run `npm run lint` and fix all errors
- **After TypeScript changes**: Verify `npm run build` succeeds
- **UI changes**: Test in both English and Arabic (RTL) modes
- **Shopify changes**: Test with real Shopify store or use mock data

## Build Configuration
- Vite config: `vite.config.ts` - uses SWC for fast compilation
- TypeScript: Strict mode enabled - all type errors must be resolved
- ESLint: Rules in `eslint.config.js` - enforce React Hooks rules and no `any` types
- Tailwind: Config in `tailwind.config.ts` with luxury color palette and custom plugins
