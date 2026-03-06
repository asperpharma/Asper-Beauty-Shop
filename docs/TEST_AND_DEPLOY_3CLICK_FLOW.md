# Test & Deploy: 3-Click Flow (Analyze → Recommend → Regimen)

Use this checklist to test the flow locally, then deploy.

---

## 1. Test the flow locally

### 1.1 Start the app

```bash
cd c:\Users\C-R\Desktop\Asper-Beauty-Shop
npm run dev
```

Open **http://localhost:5173** (or the port Vite prints).

### 1.2 Sign in

- The beauty assistant requires an authenticated user.
- Go to **Auth** and sign in (or create an account).

### 1.3 Test Analyze → Recommend → “See My Regimen”

1. Click **“Ask the Pharmacist”** (stethoscope button) to open the chat.
2. **Option A:** Click a Smart Filter (e.g. **Hydration**, **Acne**,
   **Anti-Aging**).
3. **Option B:** Type e.g. _“My skin feels tight and dry”_ or _“I need help with
   acne.”_
4. **Check:**
   - First reply is **one** short confirmation + **one** regimen (no list of
     alternatives).
   - You see **Recommended Products** and **Digital Tray** if products exist.
   - A **“See My Regimen”** link appears.
5. Click **“See My Regimen”**:
   - Chat closes and the app navigates to the concern collection (e.g.
     `/concerns/hydration`).

### 1.4 Test ConcernCollection with Supabase

1. After clicking “See My Regimen”, you should land on e.g.
   `/concerns/hydration`.
2. **Check:** The page shows products from **Supabase**
   (get-products-by-concern) when the Edge Function returns data for that
   concern.
3. If no Supabase products exist for that slug, the page falls back to Shopify
   (if configured).

### 1.5 Test “Save My Routine”

1. In the chat, get a recommendation (Smart Filter or free text) so you see
   product cards and **“See My Regimen”**.
2. Click **“Save My Routine”**.
3. Enter **Email** and/or **WhatsApp**, then click **Send**.
4. **Check:** A success toast appears and the form closes (and the lead is
   stored in `bot_leads` in Supabase).

---

## 2. Deploy

### 2.1 Deploy Supabase Edge Functions

From the project root:

```bash
npx supabase functions deploy beauty-assistant
npx supabase functions deploy get-products-by-concern
npx supabase functions deploy capture-bot-lead
```

Or deploy all:

```bash
npx supabase functions deploy
```

**Env vars** (set in Supabase Dashboard → Project → Edge Functions → secrets):

- `LOVABLE_API_KEY` — for beauty-assistant (AI gateway).
- `SITE_URL` — optional; used for full `shop_routine_url` in
  get-products-by-concern.

### 2.2 Deploy frontend

- Build: `npm run build`
- Deploy the `dist/` output to your host (Vercel, Netlify, etc.).
- Ensure env in production:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

### 2.3 Post-deploy checks

1. Open the production site and sign in.
2. Run the same tests as in §1.3–1.5 against the live URL.
3. In Supabase → Table Editor → `bot_leads`, confirm new rows after “Save My
   Routine”.

---

## 3. Summary of what’s implemented

| Item                                      | Where                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| **Analyze** (concern detection + script)  | `BeautyAssistant.tsx`, `concernMapping.ts`, `beauty-assistant`                       |
| **Recommend** (single regimen + products) | `beauty-assistant` (prompt + `skin_concerns` query), stream `recommend` + `products` |
| **See My Regimen** link                   | `BeautyAssistant.tsx` (uses `shopRegimenPath` from stream)                           |
| **Concern collection with Supabase**      | `ConcernCollection.tsx` → `get-products-by-concern`, `LuxuryProductCard`             |
| **Save My Routine**                       | `BeautyAssistant.tsx` (form + `capture-bot-lead`), `bot_leads` table                 |

If something fails, check the browser console and Supabase → Edge Functions →
Logs for the relevant function.
