# Tray API — Edge Function

**Route:** `GET /functions/v1/tray?concern=Concern_Hydration`

Returns JSON from `get_tray_by_concern` RPC. Powers the Digital Tray UI.

---

## Auth (headers)

The function accepts either:

- **Authorization:** `Bearer <anon_key>` (recommended; use your Supabase
  anon/publishable key)
- **apikey:** `<anon_key>` (alternative; same anon key as header value)

Use the **anon** (publishable) key for client-side or server-side calls. Do not
use the service_role key in the browser.

---

## Example requests

Replace `SUPABASE_URL` and `ANON_KEY` with your project URL and anon/publishable
key (e.g. from `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` or
`VITE_SUPABASE_ANON_KEY`).

**curl (Authorization Bearer):**

```bash
curl -s -H "Authorization: Bearer YOUR_ANON_KEY" \
  "https://YOUR_PROJECT_REF.supabase.co/functions/v1/tray?concern=Concern_Hydration"
```

**curl (apikey header):**

```bash
curl -s -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT_REF.supabase.co/functions/v1/tray?concern=Concern_Hydration"
```

**Node (fetch):**

```js
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const res = await fetch(
  `${SUPABASE_URL}/functions/v1/tray?concern=${
    encodeURIComponent("Concern_Hydration")
  }`,
  {
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      // or: apikey: ANON_KEY,
    },
  },
);
const data = await res.json();
```

**Browser:** The app uses `Authorization: Bearer <key>` in
`src/hooks/useDigitalTray.ts`, with key from **`VITE_SUPABASE_PUBLISHABLE_KEY`** (primary) or **`VITE_SUPABASE_ANON_KEY`** (fallback).

---

## Response

```json
{
  "concern_tag": "Concern_Hydration",
  "step_1": { "step_tag": "Step_1_Cleanser", "handle": "...", "title": "...", "brand": "...", "price": 0, "image_url": "...", "inventory_total": 1 },
  "step_2": { "step_tag": "Step_2_Treatment", "handle": "...", "title": "...", ... },
  "step_3": null
}
```

- Any step without a matching product returns `null`.
- UI renders "Consult Pharmacist" placeholder for null slots.

---

## Valid concern params

- `Concern_Acne`
- `Concern_AntiAging`
- `Concern_Hydration`
- `Concern_Dryness`
- `Concern_Sensitivity`

---

## Deploy

```bash
supabase functions deploy tray
```
