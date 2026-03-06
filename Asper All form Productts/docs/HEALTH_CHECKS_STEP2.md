# Health Checks — Step 2 (Master Deployment)

A professional overview of Git and NPM health, with validation against the Soft
Ivory / Maroon / Gold design system. Use this before merging
`docs/deployment-flow-and-health-check` into `main`.

---

## Quick Run

From project root (PowerShell):

```powershell
.\scripts\health-checks.ps1
```

Or run manually:

```powershell
npm run check
# Then: curl/browser check Supabase Edge Functions
```

---

## What Gets Checked

| Category     | Check               | Pass Condition                                    |
| ------------ | ------------------- | ------------------------------------------------- |
| **Git**      | Branch              | `docs/deployment-flow-and-health-check` or `main` |
| **Git**      | Working tree        | Clean (no uncommitted changes)                    |
| **NPM**      | Lint                | `npm run lint` exits 0                            |
| **NPM**      | Test                | `npm test` exits 0                                |
| **NPM**      | Build               | `npm run build` exits 0                           |
| **Supabase** | bulk-product-upload | HTTP 200                                          |
| **Supabase** | audit-24h           | HTTP 200                                          |

---

## Supabase URLs (Manual Check)

If the script can't reach them (e.g., no network), verify manually:

- **bulk-product-upload:**
  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload
- **audit-24h:** https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/audit-24h

- **200** = OK
- **503** = Set Supabase Edge Function secrets (see Master Launch Checklist)

---

## Next Step

When all checks pass:

1. Push the branch: `git push -u origin docs/deployment-flow-and-health-check`
2. Open the PR:
   [Compare & create PR](https://github.com/asperpharma/Asper-Beauty-Shop/compare/main...docs/deployment-flow-and-health-check)
3. Proceed to the Launch Checklist Technical View (Payment, Shipping, Theme)
