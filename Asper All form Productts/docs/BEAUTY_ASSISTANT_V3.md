# Beauty Assistant v3.0 — Production Setup

**Persistent Memory** is implemented via the `chat_logs` table. Supabase Client (service role) writes each user/assistant turn to `chat_logs` so the system has a "Digital Log."

---

## 1. Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/functions/v1/beauty-assistant` or `?health=true` | Returns `{ "status": "active", "version": "3.0" }` for uptime monitoring |
| POST | `/functions/v1/beauty-assistant` | Main AI conversation entry point |

---

## 2. POST Payload

```json
{
  "query": "Do you have a Vitamin C serum for dull skin?",
  "history": [],
  "budget": "50 JOD",
  "skin_type": "Dry",
  "session_id": "optional-session-uuid"
}
```

- **query** (required): Current user message.
- **history**: Prior turns for context (e.g. `[{ "role": "user", "text": "..." }, { "role": "model", "text": "..." }]`).
- **budget**, **skin_type**: Optional; passed into the system prompt.
- **session_id**: Optional; used to group rows in `chat_logs`. If omitted, uses `external_user_id` (Gorgias/ManyChat) or `"anonymous"`.

---

## 3. Response

```json
{
  "reply": "...",
  "response": "...",
  "persona": "Dr. Sami" | "Ms. Zain",
  "recommended_products": [
    { "id": "...", "handle": "...", "title": "...", "price": "...", "currency": "JOD", "image": "..." }
  ]
}
```

---

## 4. Required Secrets

Set in Supabase Dashboard → **Project** → **Edge Functions** → **Secrets**, or via CLI:

```bash
npx supabase secrets set --project-ref YOUR_PROJECT_REF \
  GEMINI_API_KEY="YOUR_GEMINI_KEY" \
  SHOPIFY_STOREFRONT_API_TOKEN="YOUR_STOREFRONT_TOKEN" \
  SHOPIFY_STORE_DOMAIN="your-store.myshopify.com" \
  SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
```

Replace `YOUR_PROJECT_REF`, `YOUR_GEMINI_KEY`, and `YOUR_SERVICE_ROLE_KEY` with your values. **SUPABASE_SERVICE_ROLE_KEY** is required for writing to `chat_logs` and `beauty_assistant_audit`.

---

## 5. Database: chat_logs

After running migrations, the table `public.chat_logs` exists with:

- **session_id**: Groups messages (from payload or anonymous).
- **role**: `user` | `assistant`.
- **content**: Message text.
- **metadata**: Optional JSON (e.g. budget, skin_type, persona, recommended_handles).

Run migrations: `supabase db push` or run the migration SQL in the Supabase SQL Editor.

---

## 6. Deploy

```bash
supabase functions deploy beauty-assistant
```

Then verify:

- **Health:** `curl "https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?health=true"`
- **POST:** Send a test JSON body with `query` and confirm `response`, `persona`, and optional `recommended_products` in the response, and new rows in `chat_logs`.
