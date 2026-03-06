# Gorgias Omnichannel — Order of Operations & Macros

This doc ties your **Shopify store**, **social channels**, and **AI Concierge** into one "Command Center" using Gorgias as the single inbox. Follow the order below so the system works as one.

---

## 1. Order of Operations ("The Rope")

### Step 1: The Hub — Connect Everything to Shopify

Shopify is the central system. Connect sales channels first.

- **Action:** Shopify Admin → **Sales Channels**
- **Install:** "Facebook & Instagram" (Meta) and "TikTok" apps
- **Verify:** Product catalog syncs; a price change in Shopify updates on Instagram Shop

### Step 2: The Brain — Activate Gorgias (One Inbox)

Do not check DMs on Instagram, WhatsApp, and Email separately. Gorgias unifies them.

- **Step A:** Install **Gorgias** from the Shopify App Store
- **Step B:** In Gorgias: **Settings → Integrations**
- **Step C:** Connect:
  - **Instagram & Facebook:** Asper Beauty Shop business pages
  - **WhatsApp:** Business number (+962 79 065 6666)
  - **Email:** asperpharma@gmail.com
- **Result:** Questions like "Price?" from Instagram or WhatsApp appear in one dashboard; your AI Agent can answer from one place.

### Step 3: The Visuals — Social Links on the Frontend

The site footer must link to your real channels.

- **In codebase:** `src/components/Footer.tsx` already links to:
  - **Instagram:** instagram.com/asper.beauty.shop
  - **WhatsApp:** wa.me/962790656666
  - **Facebook:** facebook.com/AsperBeautyShop
- **Gold Stitch:** Social icon hovers use brand colors (Maroon #800020 / Gold #C5A028) per design system.

### Step 4: "Follow-Me" AI Logic

Make the system intelligent across channels.

- **Rule:** If a user starts a "Skin Quiz" on Instagram and leaves, the bot can follow up on WhatsApp if the phone number was captured.
- **Test:** Send a DM to your Instagram: "I need help with acne." The AI should reply with the Dr. Sami persona logic.

---

## 2. Gorgias Macros (Copy-Paste)

Use these in **Gorgias → Settings → Macros**. They are written in your brand voice (Dr. Sami for clinical/safety, Ms. Zain for aesthetics/care).

---

### Macro 1: Auto-Reply — Where is my Order? (WISMO)

- **Trigger:** Customer asks "Where is my stuff?" or "Status"
- **Persona:** Dr. Sami (Clinical Authority & Reassurance)

**Subject:**  
`Update on your Asper Ritual (Order {{ticket.order.name}})`

**Body:**

```
Hello {{ticket.customer.first_name}},

Dr. Sami here. I have personally pulled your file to check the status of your regimen. 🩺

Current Status: {{ticket.order.fulfillment_status_label}}
Tracking Number: {{ticket.order.tracking_url}}

Please rest assured that your products are currently in temperature-controlled transit to ensure their active ingredients remain potent upon arrival. ❄️

If the package does not arrive by {{ticket.order.created_at | date: '%d/%m/%Y' | plus_days: 3}}, please reply to this secure thread, and I will escalate this to our Logistics Director immediately.

Yours in health,
Dr. Sami
Head Pharmacist, Asper Beauty
```

---

### Macro 2: Inquiry — Authenticity / Fake?

- **Trigger:** Customer asks "Is this real?", "Original?", or mentions "Fake"
- **Persona:** Ms. Zain (Best Friend & Brand Guardian)

**Subject:**  
`Your Safety is Our "Gold Standard" 🛡️`

**Body:**

```
Dearest {{ticket.customer.first_name}},

I completely understand your caution! In a world of uncertainty, your skin deserves only the truth. ✨

At Asper, we do not just sell products; we prescribe Clinical Solutions.

Our Guarantee:
1. The Pharmacist's Stamp: Every item you see with the Gold Border on our site has been vetted by Dr. Sami for safety and provenance.
2. Direct Sourcing: We source strictly from authorized distributors (L'Oréal, Pierre Fabre, etc.), never from the gray market.
3. 100% Money-Back: If you find even a single flaw in the packaging, we will refund you instantly—no questions asked.

You are safe here. Are you ready to continue your journey to radiant skin? 🌿

Warmly,
Ms. Zain
Client Experience Director
```

---

### Macro 3: Auto-Reply — Out of Office (Night)

- **Trigger:** Messages received between **10:00 PM and 8:00 AM Amman time**
- **Persona:** "Morning Spa" voice (Calm & latency-reducing)

**Subject:**  
`We are currently recharging... 🌙`

**Body:**

```
Marhaba {{ticket.customer.first_name}},

Our digital pharmacy is currently closed for the night to allow our team to rest and recharge.

Your inquiry has been logged in our priority queue. 📝

Dr. Sami and I will review your message first thing tomorrow morning (starting at 9:00 AM Amman time). You do not need to send a new message—we have this one secured.

In the meantime, have you checked our AI Skin Analysis on the website? It might have the answer you need right now!

Sleep well,
The Asper Team
```

---

## 3. Live Fire Test

After pasting the macros:

1. Open Instagram or Website Chat.
2. Send as a customer: **"Is this stuff fake?"**
3. Confirm Gorgias suggests or sends the **Ms. Zain Authenticity** script.

---

## Related Docs

- **CONNECT_ALL_CHANNELS.md** — Webhook URLs, deep links, Supabase secrets for chatbot
- **monitor-checklist.md** — §6 Chatbot for health checks
- **src/lib/asperProtocol.ts** — In-app error copy (Concierge voice)
