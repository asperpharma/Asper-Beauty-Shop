# Connect all channels to the chatbot

One backend (Beauty Assistant) for website, Gorgias, and ManyChat (Instagram, Messenger, WhatsApp).

---

## 1. Website (already on)

- Chat is on every page: floating “Ask the Pharmacist”, Header icon, Footer “Digital Consult”.
- Deep links open the site and pre-fill a concern (use in bios/posts):

  - Acne: `https://https-www-asperbeautyshop-com.lovable.app/?intent=acne&source=ig`
  - Anti-aging: `?intent=anti-aging&source=ig`
  - Hydration: `?intent=hydration&source=ig`
  - Sensitivity: `?intent=sensitivity&source=ig`
  - Dark spots: `?intent=dark%20spots&source=ig`

---

## 2. Gorgias

1. Gorgias → **Settings** → **Integrations** → **HTTP Integrations** → Add.
2. **URL:**  
   `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias`  
   **Method:** POST  
3. Trigger: e.g. new message. Map request body (message text) into the POST body; map response **`reply`** to “Reply to customer”.

---

## 3. ManyChat (Instagram, Messenger, WhatsApp)

1. ManyChat → **Automation** / **Flows** → add **Webhook** step.
2. **URL:**  
   `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat`  
   **Method:** POST  
3. Body: include `data.text`, `text`, or `message` with the user message.
4. Next step: send the webhook response field **`reply`** as the reply.

---

## 4. Supabase (required for webhooks)

**Supabase Dashboard** → **Edge Functions** → **beauty-assistant** → **Secrets:**

- Set **`GEMINI_API_KEY`** (from [aistudio.google.com/apikey](https://aistudio.google.com/apikey))  
  or **`LOVABLE_API_KEY`** (for Lovable AI gateway).

Deploy if you changed the function:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

Health check:

```bash
curl "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"
```

Expected: `{"status":"active", ...}`

---

## 5. Test webhooks

**Gorgias-style:**

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=gorgias" -H "Content-Type: application/json" -d "{\"message\": \"What do you recommend for dry skin?\"}"
```

**ManyChat-style:**

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?route=manychat" -H "Content-Type: application/json" -d "{\"data\": {\"text\": \"I have acne, what should I use?\"}}"
```

Both should return `{"reply":"..."}`.

---

Full details: [CHATBOT_SOCIAL_MEDIA_SETUP.md](CHATBOT_SOCIAL_MEDIA_SETUP.md).
