# Brand Intelligence Dashboard – Integration Summary

This doc outlines the exact file moves and route changes used to integrate the Brand Intelligence admin dashboard into the Asper Beauty Shop app.

---

## 1. What was added

### New files

| File | Purpose |
|------|--------|
| `src/components/RequireAdmin.tsx` | Guard: requires Supabase session + `user_roles.role = 'admin'`. Redirects to `/auth` if not signed in, or `/` with toast if not admin. Shows loading spinner while checking. |
| `src/components/brand-intelligence/BrandIntelligenceLayout.tsx` | Dashboard shell: header (Asper Beauty · Brand Intelligence), Sign out + Admin link, and three tabs (Intelligence, Identity, Creative Studio). |
| `src/components/brand-intelligence/IntelligenceTab.tsx` | **Intelligence** tab: Visual Skin Diagnostic, Ingredient Safety Shield, Multimodal Shelfie Audit (placeholder cards; wire to Edge Functions). |
| `src/components/brand-intelligence/IdentityTab.tsx` | **Identity** tab: Brand Voice Validator, SKU Growth Engine, Multilingual Voice Mirror. |
| `src/components/brand-intelligence/CreativeStudioTab.tsx` | **Creative Studio** tab: Signature Packaging Studio, Product Photography Concepts. |
| `src/pages/BrandIntelligenceDashboard.tsx` | Page that renders `BrandIntelligenceLayout` (used as the route component). |
| `docs/BRAND_INTELLIGENCE_INTEGRATION.md` | This file. |

### Modified files

| File | Change |
|------|--------|
| `src/App.tsx` | 1) Import `BrandIntelligenceDashboard` and `RequireAdmin`. 2) New route: `/brand-intelligence` with `element={<RequireAdmin><BrandIntelligenceDashboard /></RequireAdmin>}`. |

---

## 2. Route changes (App.tsx)

- **New route:**  
  `GET /brand-intelligence` → protected by `RequireAdmin`; renders `BrandIntelligenceDashboard`.
- **Protection:**  
  `RequireAdmin` uses the same logic as existing admin pages: `supabase.auth.getUser()` then `user_roles` with `role = 'admin'`. No session → redirect to `/auth`. Session but not admin → redirect to `/` and toast “Access denied.”

Insert the route **before** the catch-all `path="*"` so it takes precedence:

```tsx
<Route
  path="/brand-intelligence"
  element={
    <RequireAdmin>
      <BrandIntelligenceDashboard />
    </RequireAdmin>
  }
/>
```

---

## 3. Design tokens (existing Tailwind config)

- **soft-ivory** – used for dashboard background (`bg-soft-ivory`).
- **maroon** – used for branding and active tab state (`text-maroon`, `border-maroon`, `hover:bg-maroon/10`).
- **shiny-gold** – available for future accents; not required for current layout.

No changes were made to `tailwind.config.ts`; the new components use these existing tokens and standard shadcn tokens (`border`, `background`, `muted-foreground`, etc.).

---

## 4. Optional: link from the rest of the app

To give admins a way to open the dashboard:

- **From Header/Footer:** add a link (e.g. “Brand Intelligence”) that only renders when the user is admin (same `user_roles` check or a small `useIsAdmin()` hook).
- **From existing admin pages:** add a nav link to `/brand-intelligence` next to “Products”, “Orders”, “Audit Logs”, etc.

---

## 5. Next steps (wiring Edge Functions)

Each tool card has an “Open (connect to Edge Function)” button. To finish integration:

1. Create or reuse Supabase Edge Functions for each tool (e.g. Visual Skin Diagnostic, Ingredient Safety Shield, etc.).
2. In each tab component, give the button an `onClick` (or link) that:
   - Opens a modal/drawer, or
   - Navigates to a dedicated page (e.g. `/brand-intelligence/skin-diagnostic`).
3. In that view, call the Edge Function (e.g. `fetch(`${SUPABASE_URL}/functions/v1/your-function`)` with auth headers) and display the result.

---

## 6. Summary checklist

- [x] `RequireAdmin` component added and used for `/brand-intelligence`.
- [x] Dashboard layout and three tabs added under `src/components/brand-intelligence/`.
- [x] `BrandIntelligenceDashboard` page added and routed in `App.tsx`.
- [x] Routes protected with Supabase Auth + `user_roles` admin check.
- [x] Design uses existing Tailwind tokens (soft-ivory, maroon).
- [ ] Optional: add nav link to `/brand-intelligence` in admin area or header.
- [ ] Wire each tool card to its Gemini 2.5 / Supabase Edge Function.
