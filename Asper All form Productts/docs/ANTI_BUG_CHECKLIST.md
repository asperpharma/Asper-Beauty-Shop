# Anti-Bug Checklist — Step by Step

Run these checks before pushing, merging, or deploying. Do them **in order**.

---

## Step 1: Lint

Finds syntax errors, React hooks issues, and style problems.

```powershell
npm run lint
```

- ✅ **Pass:** No output, or "0 problems"
- ❌ **Fail:** Fix reported errors before continuing

---

## Step 2: Test

Runs unit/smoke tests.

```powershell
npm test
```

- ✅ **Pass:** "Test Files X passed"
- ❌ **Fail:** Fix failing tests before continuing

---

## Step 3: Build

Verifies the app compiles and produces a production bundle.

```powershell
npm run build
```

- ✅ **Pass:** "built in Xms"
- ❌ **Fail:** Fix TypeScript/Vite errors before continuing

---

## Step 4: Supabase Edge Function Health

Checks the bulk-product-upload function is reachable.

**Option A — Browser:** Open:

```
https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload
```

**Option B — Terminal (PowerShell):**

```powershell
Invoke-WebRequest -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" -UseBasicParsing | Select-Object StatusCode
```

- ✅ **200:** Function is up
- ❌ **503:** Set Supabase Edge Function secrets (see Master Launch Checklist)

---

## Step 5: One-Command Run (All Checks)

Run lint, test, and build in sequence:

```powershell
npm run check
```

(Adds `check` script: `lint && npm test && npm run build`)

---

## Quick Reference

| Step | Command         | Purpose         |
| ---- | --------------- | --------------- |
| 1    | `npm run lint`  | ESLint          |
| 2    | `npm test`      | Vitest          |
| 3    | `npm run build` | Vite build      |
| 4    | curl / browser  | Supabase health |
| All  | `npm run check` | Steps 1–3       |

---

## Prerequisites

- **Node.js** installed ([nodejs.org](https://nodejs.org) LTS)
- **npm** available in your terminal (`npm -v`)
- Project dependencies installed (`npm install`)

If `npm` or `node` is not found, add Node to your PATH or open a new terminal
where Node works.
