# Beauty Assistant — Webhook Routes

**Function:** `beauty-assistant`  
**Base URL:** `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant`

Gorgias and ManyChat both call the same endpoint. Use the `route` query param to route payloads correctly.

---

## Webhook URLs

| Platform   | Webhook URL |
|-----------|-------------|
| **Gorgias**  | `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **ManyChat** | `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=manychat` |

Alternative: use the header `X-Webhook-Route: gorgias` or `X-Webhook-Route: manychat` if your platform supports custom headers.

---

## Payload Handling

### Gorgias

Extracts the user message from:

- `messages[].body_text` (last message)
- `body_text` or `message`
- `body_html` (stripped of HTML)

### ManyChat

Extracts the user message from:

- `data.text`
- `text` or `message`

---

## Response

All routes return:

```json
{
  "reply": "Dr. Sami or Ms. Zain response text..."
}
```

Map `reply` to your platform's send-message API.

---

## Setup

1. **Deploy:** `supabase functions deploy beauty-assistant`
2. **Secrets:** Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in Supabase Dashboard → Edge Functions → beauty-assistant → Secrets
3. **Gorgias:** Settings → Integrations → HTTP Integrations → Add webhook with the Gorgias URL above
4. **ManyChat:** Webhook settings → Add the ManyChat URL above, select `message_sent` (or relevant events)

---

## Deploy

```bash
supabase functions deploy beauty-assistant
```
