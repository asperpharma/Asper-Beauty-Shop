# Launch Final Sequence — Digital Tray, Omnichannel, Pharmacist Persona

This doc captures the **final sequence** before the Asper Beauty Shop goes from
vision to revenue-generating AI ecosystem: the **Digital Tray** as conversion
engine, **omnichannel** deep links (Instagram → web), and the **Pharmacist
Persona** system prompt.

---

## 1. The "Digital Tray" Integration

The Digital Tray is the conversion engine: it lets users **Quick Add** a full
routine (e.g. $150+) in one click, mirroring a pharmacist handing a curated
selection on a white linen cloth.

### Implemented

- **Component:** `src/components/chat/DigitalTray.tsx`
  - Uses **Framer Motion** for a high-end slide-in animation.
  - Shows "Your Prescription" with product image, name, brand, price per item
    and approx. total.
  - **"Quick Add Routine to Cart"** button calls
    `addMultipleFromPrescription(products)` (Zustand cart store), then opens the
    cart and shows a toast.
  - Footer line: _"Clinical formulation by Asper Digital Pharmacist"_ (EN/AR).
- **Cart store:** `src/stores/cartStore.ts`
  - **`PrescriptionProduct`** type and
    **`addMultipleFromPrescription(products)`** that map each product to the
    existing Shopify-style cart item and add them in sequence; cart drawer opens
    after add.
- **Chat:** When the assistant message includes **products** (from the
  beauty-assistant stream), the **Digital Tray** is rendered below the
  recommended product cards so the user can one-click add the full routine.

### Dependency

- **framer-motion** added to `package.json`. Run `npm install` if you haven’t.

---

## 2. Omnichannel Loop (Instagram → Web)

Automated path: user comments "Acne help" on Instagram → ManyChat (or similar)
DMs a deep link → site loads with chat open and the AI already introducing the
Acne routine.

### Implemented

- **Deep link URL:**
  `https://asperbeauty.lovable.app/chat?intent=acne&source=ig` (or your
  production domain).
- **Route:** `/chat` renders the same home layout as `/` so the chat pill and
  panel are available (`App.tsx`: `<Route path="/chat" element={<Index />} />`).
- **Intent handling** in `BeautyAssistant.tsx`:
  - On load, `useSearchParams()` reads `intent` and `source`.
  - If `intent` is present (e.g. `acne`, `anti-aging`, `hydration`,
    `sensitivity`, `dark spots`):
    - Chat panel opens (`setIsOpen(true)`).
    - Welcome message is shown.
    - A first user message is auto-sent (e.g. "What's your best skincare routine
      for acne-prone skin?" for `intent=acne`).
    - The bot streams the response (routine + products).
    - URL is cleaned (intent/source removed) so refreshing doesn’t re-trigger.
  - **`getIntentMessage(intent, language)`** maps intent to EN/AR first message.

### ManyChat / automation

- Configure ManyChat so that when a user comments "Acne help" (or a keyword), it
  sends a DM with:\
  `https://<your-domain>/chat?intent=acne&source=ig`
- Other intents: `anti-aging`, `hydration`, `sensitivity`, `dark spots` (use
  same `intent` and `source=ig`).

---

## 3. "Pharmacist Persona" System Prompt

The AI Employee speaks with **"Authentic Quality"** and drives the 3-Click
Solution. The system prompt is the brain of the AI Employee.

### Implemented (Supabase Edge Function)

The system prompt in **`supabase/functions/beauty-assistant/index.ts`** uses the
**4-Stage Intelligence** (see **`docs/INTELLIGENCE_PHASE_4_STAGES.md`**):

- **Stage 1 — Persona:** Digital Pharmacist, "Medical Luxury" tone; key phrases
  (Clinical Necessity, Barrier Repair, Seal of Authenticity); ivory-and-gold spa
  vibe.
- **Stage 2 — Logic:** Strict 3-step protocol: Analyze (diagnostic questions) →
  Recommend (match concern to product metadata) → Regimen (always a **Digital
  Tray**: Cleanser + Treatment + Moisturizer/SPF); closing: "Shall I add this
  tray to your cart?"
- **Stage 3 — Sales Intelligence:** Authenticity Hook when user hesitates;
  Cross-Sell (warn if they only want one product; advise full pairing for
  barrier safety).
- **Stage 4 — Ghost Protocol:** Clinical Awareness; Medical Mode when user
  mentions internal health (e.g. low iron, low Vitamin D)—acknowledge, tag
  context, recommend topical + note on oral supplementation.

Also see `docs/SALES_INTELLIGENCE_AND_PHARMACIST_PLAYBOOKS.md` for
playbook-by-concern and script fragments.

---

## 4. Status: Ready for Launch

| Item                   | Status                                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| Infrastructure         | Shopify store connected; GoDaddy (or current DNS).                         |
| Catalog                | 5,000 products prepared for Matrixify.                                     |
| Design                 | Ivory & Gold tokens verified (DNA Guard).                                  |
| **Digital Tray**       | Implemented; Quick Add Routine to Cart in chat.                            |
| **Omnichannel**        | `/chat?intent=...&source=ig` opens chat and sends intent message.          |
| **Pharmacist Persona** | System prompt updated in beauty-assistant Edge Function.                   |
| Automation             | AI Employee voice and mic protocols drafted; ManyChat can send deep links. |

### Deploy

1. **Frontend:** Build and deploy (e.g. Vercel/Lovable). Ensure `framer-motion`
   is installed (`npm install`).
2. **Edge Function:** `supabase functions deploy beauty-assistant`
3. **ManyChat:** Set up keyword → DM with
   `https://<domain>/chat?intent=acne&source=ig` (and other intents as needed).

### Test

1. Open `https://<your-domain>/chat?intent=acne&source=ig` in a browser (signed
   in).
2. Confirm the chat opens and the bot sends an Acne routine message (and
   products if available).
3. Confirm the Digital Tray appears and "Quick Add Routine to Cart" adds all
   items and opens the cart.
