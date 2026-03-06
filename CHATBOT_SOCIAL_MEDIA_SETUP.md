# Asper Beauty Shop — Connect Chatbot to Social Media

Your **Asper Digital Pharmacist** chatbot is now wired for social media. Use this guide to connect it to Gorgias, ManyChat, Instagram, Facebook Messenger, and WhatsApp.

---

## Quick links

| Platform | Webhook URL |
|----------|-------------|
| **Gorgias** | `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| **ManyChat** (Instagram, Messenger, WhatsApp) | `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat` |

**Main site:** https://https-www-asperbeautyshop-com.lovable.app

---

## 1. Prerequisites

### Supabase secrets

In **Supabase Dashboard** → **Edge Functions** → **beauty-assistant** → **Secrets**, ensure you have:

| Secret | Required for | Notes |
|--------|--------------|-------|
| `LOVABLE_API_KEY` | Website chat | Already used for site widget |
| `GEMINI_API_KEY` | Social webhooks | Get at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

For social media webhooks, `GEMINI_API_KEY` is preferred. If it’s missing, the function will use `LOVABLE_API_KEY` when available.

### Chatbot knowledge (database & products)

The chatbot is **trained on your live data**:

| Source | What it provides |
|--------|------------------|
| **`products` table** | Live catalog from Supabase — title, brand, price, category, skin_concerns, description |
| **`documents` table** | Richer product content for AI — populated from products via `generate-embeddings` |

**How it works:** For each message, the chatbot fetches relevant products by skin concern or keyword, injects them into the AI prompt, and instructs it to recommend **only** from that inventory.

**Keep knowledge fresh:**
1. **Products:** Bulk-upload from Shopify or sync products into the `products` table.
2. **Documents (optional):** Run the `generate-embeddings` Edge Function (admin only) to rebuild `documents` from `products` for better keyword matching.

### Deploy the function

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

### Health check

```powershell
curl "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"
```

Expected: `{"status":"active","version":"3.1","webhooks":["gorgias","manychat"],"uptime":"ok"}`

---

## 2. Gorgias (email, chat, social inbox)

Gorgias centralizes customer support. Use it to route DMs and chat messages to your chatbot.

### Setup

1. Log in to [Gorgias](https://app.gorgias.com).
2. Go to **Settings** → **Integrations** → **HTTP Integrations**.
3. Add a new integration:
   - **Name:** Asper Beauty Assistant
   - **URL:**  
     `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias`
   - **Method:** POST
4. Configure the trigger (e.g. new message received) and map:
   - **Request body** → payload with `messages`, `body_text`, or `message`
   - **Response** → read `reply` and send it back to the customer

### Response format

The webhook returns:

```json
{
  "reply": "I am honored to serve. Based on your concern, I recommend..."
}
```

Map `reply` to Gorgias’ “Reply to customer” action.

---

## 3. ManyChat (Instagram, Messenger, WhatsApp)

ManyChat connects Instagram DMs, Facebook Messenger, and WhatsApp to your chatbot.

### Setup

1. Log in to [ManyChat](https://manychat.com).
2. Connect your Instagram/Facebook/WhatsApp Business account.
3. Open **Automation** or **Flows**.
4. Add a **Webhook** step.
5. Use:
   - **URL:**  
     `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat`
   - **Method:** POST
   - **Body:** Include `data.text`, `text`, or `message` with the user’s message.
6. In the next step, read the webhook response and use `reply` as the message to send back.

### Trigger events

- **Instagram:** `message_sent` when a user sends a DM.
- **Messenger:** `message_received`.
- **WhatsApp:** `message_received` (via ManyChat’s WhatsApp integration).

### Example flow

1. Trigger: User sends a message.
2. Webhook: POST to beauty-assistant with `?route=manychat`.
3. Action: Send `reply` from the response as a message.

---

## 4. Instagram DMs

Connect via ManyChat or Gorgias.

### ManyChat

1. **Settings** → **Channels** → connect Instagram Business.
2. Create a flow triggered by “New message in Instagram DMs”.
3. Add the ManyChat webhook step as above.
4. Send the webhook `reply` as the DM reply.

### Gorgias

1. Connect Instagram under **Channels**.
2. Use the Gorgias webhook integration from section 2 to handle incoming DMs.

---

## 5. Facebook Messenger

Connect via ManyChat or Meta’s direct integration.

### ManyChat

1. **Settings** → **Channels** → connect Facebook Page.
2. Create a flow triggered by “New message in Messenger”.
3. Use the ManyChat webhook step and send `reply` back.

---

## 6. WhatsApp

### ManyChat (recommended)

1. Connect WhatsApp Business via ManyChat.
2. Create a flow for incoming messages.
3. Use the ManyChat webhook and send `reply` as the reply.

### WhatsApp Business API (alternative)

If you use the API directly (e.g. Twilio, MessageBird), call the same webhook:

- **URL:**  
  `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat`
- **Body:**  
  `{"message": "user message here"}` or `{"data":{"text":"user message here"}}`

---

## 7. Deep links from social to website chat

Add links in posts and bios so users open the site with a pre-filled concern:

| Concern | Link |
|---------|------|
| Acne | `https://https-www-asperbeautyshop-com.lovable.app/?intent=acne&source=ig` |
| Anti-aging | `https://https-www-asperbeautyshop-com.lovable.app/?intent=anti-aging&source=ig` |
| Hydration | `https://https-www-asperbeautyshop-com.lovable.app/?intent=hydration&source=ig` |
| Sensitivity | `https://https-www-asperbeautyshop-com.lovable.app/?intent=sensitivity&source=ig` |
| Dark spots | `https://https-www-asperbeautyshop-com.lovable.app/?intent=dark%20spots&source=ig` |

Replace `ig` with `wa`, `fb`, etc. for analytics.

---

## 8. Test webhooks

### Gorgias

```powershell
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"What do you recommend for dry skin?\"}'
```

### ManyChat

```powershell
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat" `
  -H "Content-Type: application/json" `
  -d '{\"data\": {\"text\": \"I have acne, what should I use?\"}}'
```

Expected: `{"reply":"..."}` with a skincare recommendation.

---

## 9. Summary

| Channel | How to connect |
|---------|----------------|
| **Website** | Already live via floating “Ask the Pharmacist” button |
| **Gorgias** | Add HTTP integration → beauty-assistant?route=gorgias |
| **Instagram DMs** | ManyChat flow → webhook ?route=manychat |
| **Facebook Messenger** | ManyChat flow → webhook ?route=manychat |
| **WhatsApp** | ManyChat or direct API → webhook ?route=manychat |
| **Deep links** | Add `?intent=acne&source=ig` etc. to main site URL |

---

*Last updated: Feb 2025*
