# Asper AI Protocol: Architecture & "Nervous System"

**One brain, two voices.** This document summarises the technical blueprint and where it lives in the codebase.

---

## The Nervous System (Backend)

**Supabase Edge Functions** act as the **Connector** between channels and intelligence. The Connector connects to **The Brain** (Google Gemini 2.5 Flash via API), **The Memory** (Shopify Storefront API for real-time inventory and product details [Source 21, 171]; shared context via `messages` array), and **The Frontend** (React/Vite via HTTP). They bridge chat apps (WhatsApp, Instagram, website) and your data:

- **Single endpoint:** `supabase/functions/beauty-assistant` — one codebase for all channels.
- **Inventory:** 5,000+ SKUs via Shopify Storefront API; real-time stock so the AI never recommends out-of-stock items.
- **The Memory:** Shared user context. The `messages` array is sent with each request so that if a customer asks Ms. Zain for a lipstick, Dr. Sami still “remembers” that product when they later ask about pregnancy safety.

---

## Dual-Persona Brain

Dr. Sami and Ms. Zain are **not** two separate bots. A central **"Director"** logic in the `beauty-assistant` Edge Function (hardcoded system prompt) analyses **every** user message to decide who responds. If the input contains **medical keywords**, the Director activates Dr. Sami; otherwise the aesthetic voice (Ms. Zain) responds. Both share the same Brain (Google Gemini 2.5 Flash) and context, so hand-offs are seamless.

| Persona | Role | Triggers | Signature |
|--------|------|----------|-----------|
| **Dr. Sami** | Clinical Authority / Pharmacist | Supplements (Rigenforte, vitamins), dosage, pregnancy safety, skin pathology (eczema, rosacea), medical devices (Omron, Pic Solution), logistics (shipping/COD) | `"- Dr. Sami, Asper Clinical Support"` |
| **Ms. Zain** | Beauty Advisor / Concierge | Makeup shades, “Glow,” skincare routines, gifts, trends, 3-Click Solution | `"- Ms. Zain, Your Beauty Concierge"` |

- **Intent detection:** The model analyses the user’s latest input and switches to the correct persona (Clinical/Wellness → Sami; Aesthetic/Beauty → Zain).
- **Guardrail (Dr. Sami):** When discussing symptoms or safety, the reply must include: *"I provide wellness guidance, not medical diagnosis."*
- **Action (Ms. Zain):** 3-Click Solution: Analyze skin concern → Recommend regimen (Cleanser + Serum + Moisturizer) → Direct to Digital Tray (Cart).

---

### 1. The "Director" logic (the switch)

- **Rule:** If the user's input contains **medical keywords** (e.g. pregnancy, dosage, side effects, eczema), the Director automatically activates **Dr. Sami**.
- **Hand-off:** If the user is chatting with Ms. Zain about lipstick shades and then asks *"Is this safe for pregnancy?"*, the system **immediately** switches to Dr. Sami. He keeps the context of the lipstick but answers with clinical authority.

---

### 2. Dr. Sami: the clinical authority

Dr. Sami is the **only** persona authorised to handle medical triggers. His responses follow a strict safety protocol.

- **Triggers:**
  - **Safety:** Pregnancy safety, dosage instructions, side effects.
  - **Pathology:** Skin conditions (e.g. eczema, rosacea).
  - **Clinical products:** Supplements (e.g. Rigenforte for hair loss, collagen), medical devices (e.g. Omron blood pressure monitors).
  - **Logistics:** Unlike Ms. Zain, Dr. Sami also handles "serious" inquiries: shipping, returns, COD (Cash on Delivery).
- **Mandatory disclaimer:** Every response from Dr. Sami regarding symptoms or treatment must include the hard-coded guardrail: *"I provide wellness guidance, not medical diagnosis."*
- **Tone:** "The Voice of Science" — precise, authoritative, reassuring. He focuses on ingredients and safety data, not "glow" or "luxury."

---

### 3. Ms. Zain: the aesthetic guide

Ms. Zain is explicitly programmed **not** to answer medical questions.

- **Role:** She handles "Beauty & Aesthetics" triggers: makeup shades, routines, gifts, and the **3-Click Solution** (Analyze → Recommend → Cart).
- **Boundary:** If she detects a medical concern, she **yields the floor to Dr. Sami**. She does not offer medical advice, ensuring the brand avoids liability and misinformation.

---

### 4. Shared memory (context preservation)

Because both personas share the same Brain and database, the transition is seamless and context is preserved.

- **Example:** A customer asks Ms. Zain for a **Vichy serum** (aesthetic intent). Then they ask *"Can I use this with Retinol?"* (medical intent).
- **Result:** Dr. Sami steps in. He already knows which Vichy serum was recommended and immediately cross-references its ingredients with Retinol to give a safety assessment.

---

### Summary

- **Intent detection:** The Director (system prompt) analyses the user's latest input and switches to the correct persona (medical → Sami; aesthetic → Zain).
- **Guardrail (Dr. Sami):** When discussing symptoms or safety, the reply must include: *"I provide wellness guidance, not medical diagnosis."*
- **Action (Ms. Zain):** 3-Click Solution: Analyze skin concern → Recommend regimen (Cleanser + Serum + Moisturizer) → Direct to Digital Tray (Cart).

---

## Where It Lives in Code

| Piece | Location |
|-------|----------|
| System prompt (dual persona) | `supabase/functions/beauty-assistant/index.ts` — `systemPrompt` constant |
| Request format | POST body: `{ "message": "...", "messages": [{ "role": "user"|"model", "text": "..." }] }` |
| Response | `{ "reply": "..." }` — reply includes the active persona’s signature |
| Product/regimen APIs | `get-products-by-concern`, `tray`, etc. — can be called from the frontend or from the Edge Function to inject catalog/regimen into context |

---

## Channel Integrators

To connect the Brain to specific social platforms:

| Channel | Tool | Role [Source 26, 56, 191] |
|---------|------|---------------------------|
| **Instagram & support** | **Gorgias** | Manages the ticket system and integrates the AI into Instagram DMs and on-site chat. |
| **WhatsApp** | **ManyChat** | Automates the WhatsApp flow and routes complex queries back to the Supabase "Brain" (Edge Function). |
| **Web** | **React/Vite** | Frontend calls the same `beauty-assistant` endpoint via HTTP. |

All channels hit the **same** Supabase Edge Function. One brain, one memory, two voices — no duplicate bots or training.

---

## Summary of Data Flow

```
User Query (Instagram / WhatsApp / Web)
    → Gorgias / ManyChat / React
    → Supabase Edge Function (The Connector)
    → Google Gemini + Shopify Storefront API
    → Reply (Dr. Sami or Ms. Zain)
```

---

## Summary (for stakeholders)

The Asper AI Protocol uses a **centralised “one brain, two voices”** setup: a single system (Gemini + Supabase Edge Functions) powers two customer-facing personalities. Dr. Sami provides precise, safety-first clinical and wellness guidance; Ms. Zain provides warm, editorial beauty and skincare advice. Shared memory keeps the conversation consistent across topics (e.g. a lipstick recommended by Zain is known to Sami when the user asks about safety). Shopify supplies live inventory so recommendations stay accurate. The result is tailored expertise across WhatsApp, Instagram, and the web from one efficient codebase aligned with the “Medical Luxury” brand.

---

## References

- **Implementation detail:** `supabase/functions/beauty-assistant/index.ts`
- **Step 1 (tools, data, efficiency):** `docs/EZABILA_STEP1_AI_SETUP_AND_DATA.md`
- **Pre-launch checks:** `docs/NEXT_STEPS.md`, `.cursor/skills/asper-beauty-pre-launch/SKILL.md`
