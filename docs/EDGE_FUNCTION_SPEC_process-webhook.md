# Edge Function Spec: process-webhook

Reusable spec format for Supabase Edge Functions. This document describes **process-webhook** and can be copied for other functions.

---

## 1. Function name (URL-safe)

- **Name:** `process-webhook`
- **URL path:** `/functions/v1/process-webhook`
- **Full URL example:** `https://<PROJECT_REF>.supabase.co/functions/v1/process-webhook`

---

## 2. What it should do

### Purpose

Receive incoming webhook payloads from **Gorgias**, **ManyChat** (Instagram, Messenger, WhatsApp), or other configured sources; validate and normalize the payload; optionally log to DB; call the Beauty Assistant AI (or another handler) and return a reply for the channel.

### Inputs

| Source   | How it's identified              | Body shape (examples) |
|----------|-----------------------------------|------------------------|
| Gorgias  | `?route=gorgias` or `x-webhook-route: gorgias` | `{ "message": "..." }` or `{ "messages": [{ "body_text": "..." }] }` |
| ManyChat | `?route=manychat` or `x-webhook-route: manychat` | `{ "data": { "text": "..." } }` or `{ "message": "..." }` |
| Generic  | `?route=generic` (optional)      | `{ "message": "..." }` |

- **Content-Type:** `application/json` (required for POST).
- **Optional headers:** `x-webhook-signature`, `x-webhook-source` for verification.

### Validations

1. **Method:** POST for processing; GET allowed only for health.
2. **Body:** Must be valid JSON; must contain a non-empty message string (after extraction per route).
3. **Size:** Reject body larger than 256 KB.
4. **Signature (optional):** If `WEBHOOK_SECRET` is set, validate `x-webhook-signature` (e.g. HMAC-SHA256 of body) and return 401 on mismatch.
5. **Rate limit (optional):** Per IP or per `x-forwarded-for` (e.g. 60 req/min) to avoid abuse.

### DB reads/writes

- **Reads (optional):**
  - `public.concierge_conversations` or similar — fetch last N messages for context by `channel_id` / `external_id`.
- **Writes:**
  - **Incoming:** Insert one row per webhook (e.g. `webhook_events`: `source`, `route`, `raw_payload`, `message_extracted`, `created_at`) for audit; use **service role**.
  - **Outgoing:** Optionally store the AI reply in the same conversation table for follow-up context.

### External API calls

- **Beauty Assistant:** HTTP POST to same project’s `beauty-assistant` with normalized `{ "message": "...", "route": "gorgias"|"manychat" }` and read `reply` from JSON response.  
  - **Alternative:** Inline the same AI logic (shared code) to avoid a second HTTP hop and reduce latency.
- **No other external APIs** required unless you add (e.g. Gorgias API to send the reply; here we only return the reply in the response so the channel sends it).

---

## 3. Routes

| Method | Path / query | Purpose |
|--------|----------------|--------|
| GET    | `/functions/v1/process-webhook` or `?health=true` | Health check; no auth. Returns `{ "status": "ok", "function": "process-webhook", "ts": "ISO8601" }`. |
| POST   | `/functions/v1/process-webhook` | Process webhook. Query `route=gorgias|manychat|generic` or header `x-webhook-route`. |
| OPTIONS| (any) | CORS preflight; return 204 with CORS headers. |

No subpaths (e.g. no `/process-webhook/process`). Single entrypoint; behavior depends on method and query/body.

---

## 4. Auth model

| Route   | Auth |
|---------|------|
| GET `?health=true` | **Public** — no header required. |
| POST (process)     | **Secret-based:** require header `x-webhook-secret` (or `Authorization: Bearer <WEBHOOK_SECRET>`) matching env `WEBHOOK_SECRET`. If `WEBHOOK_SECRET` is not set, POST can be **public** (rely on rate limit + signature if you add it). |

- **DB access:** Use **service role** key (e.g. `SUPABASE_SERVICE_ROLE_KEY` from Supabase) for inserts/reads so the function can write to `webhook_events` and conversation tables without RLS.
- **No JWT required** for webhook callers (Gorgias/ManyChat don’t send Supabase JWTs).

---

## 5. Environment variables and secrets

| Variable | Required | Purpose |
|----------|----------|--------|
| `WEBHOOK_SECRET` | No (recommended for prod) | Shared secret for `x-webhook-secret` (or Bearer). If set, POST must send it. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (if DB write/read) | Writes to `webhook_events` / conversation table. |
| `BEAUTY_ASSISTANT_URL` or internal call | No | If calling beauty-assistant via HTTP: full URL or use same project’s internal URL. If logic is inlined, not needed. |
| `GEMINI_API_KEY` or `LOVABLE_API_KEY` | Yes (if AI inlined here) | Only if this function calls AI directly; else beauty-assistant has it. |
| `ALLOWED_ORIGIN` | No | CORS; same as beauty-assistant (e.g. your frontend origin). |

Set in **Supabase Dashboard → Edge Functions → process-webhook → Secrets**.

---

## 6. Expected response format

### GET (health)

- **Status:** 200  
- **Body:**  
  `{ "status": "ok", "function": "process-webhook", "ts": "2026-02-17T12:00:00.000Z" }`  
- **Headers:** `Content-Type: application/json` + CORS.

### POST (process) — success

- **Status:** 200  
- **Body:**  
  `{ "reply": "<AI reply text>", "concern_slug": "<slug or null>", "logged": true }`  
- **Headers:** `Content-Type: application/json` + CORS.

### POST — client error (validation, missing message, etc.)

- **Status:** 400  
- **Body:**  
  `{ "error": "Invalid JSON" }` or `{ "error": "message is required" }`  
- **Headers:** `Content-Type: application/json` + CORS.

### POST — auth error

- **Status:** 401  
- **Body:**  
  `{ "error": "Unauthorized" }`  
- **Headers:** `Content-Type: application/json` + CORS.

### POST — rate limit

- **Status:** 429  
- **Body:**  
  `{ "error": "Too many requests", "retry_after": 60 }`  
- **Headers:** `Content-Type: application/json`, `Retry-After: 60` + CORS.

### POST — server error (AI or DB failure)

- **Status:** 500  
- **Body:**  
  `{ "error": "Internal error", "reply": null }`  
- Optionally still return 200 with a fallback `reply` (e.g. Asper Protocol error message) so the channel can show something.

---

## 7. Performance

- **Timeout:** Supabase Edge Functions default (e.g. 60s). Keep webhook handler under ~25s so Gorgias/ManyChat don’t timeout (many expect < 15–30s).
- **Background work:** Use **`Deno.env.get("EDGE_RUNTIME")` and `EdgeRuntime.waitUntil`** (or equivalent in your runtime) only for non-blocking work that must not hold the response:
  - **Good:** Logging the raw webhook to `webhook_events` after you’ve already returned `{ "reply": "..." }` to the client.
  - **Bad:** Waiting for AI inside `waitUntil` — the reply must be sent in the main response.
- **Cold start:** First request may be slower; health check can be called periodically to keep the function warm if needed.
- **Idempotency:** If the same webhook is retried (e.g. Gorgias retry), consider storing `idempotency_key` (e.g. from header or hash of body) and returning the same cached reply for 24h to avoid duplicate AI calls.

---

## 8. Summary table

| Item | Value |
|------|--------|
| **Function name** | `process-webhook` |
| **Routes** | GET (health), POST (process), OPTIONS (CORS) |
| **Auth** | GET public; POST optional `WEBHOOK_SECRET` header |
| **DB** | Service role; optional `webhook_events` + conversation table |
| **External calls** | Optional: internal call to beauty-assistant for AI reply |
| **Response** | JSON: `reply`, `error`; status 200 / 400 / 401 / 429 / 500 |
| **Performance** | Respond < 25s; use `waitUntil` only for logging after response |

---

## 9. Relation to existing setup

- **beauty-assistant** already supports `?route=gorgias` and `?route=manychat` and returns `{ "reply": "..." }`.  
- **process-webhook** is useful if you want: (1) a single entrypoint that only does webhooks, (2) mandatory logging of every webhook to Supabase, (3) signature verification and rate limiting in one place, or (4) to add more sources (e.g. Telegram) without changing beauty-assistant.  
- If you don’t need separate logging or auth, you can keep using **beauty-assistant** with `?route=gorgias` / `?route=manychat` as in CONNECT_ALL_CHANNELS.md.
