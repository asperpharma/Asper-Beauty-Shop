# Ezabila Beauty & Health Care — Implementation Roadmap

This roadmap establishes the technical foundation for **one brain, two personalities** (Dr. Sami + Ms. Zain) and the premium omnichannel experience.

---

## Step 1: The Shared Brain & Core Knowledge Base

**Principle:** You are not building two separate bots. You are building **one intelligent system** that "switches masks" based on the user's question.

### Technical goal

- **Centralized Brain:** Single LLM (Gemini) behind one API (`beauty-assistant`), with one system prompt that defines both personas.
- **Knowledge Base (vector DB):** Store and retrieve:
  - **Shopify product data** (names, metafields, purpose e.g. "Good for Oily Skin," "Rich in Zinc").
  - **Mineral/vitamin ratio charts** (clinical reference for Dr. Sami).
  - **Skincare treatment protocols** (ingredients, skin types, layering) for Ms. Zain.

### Brain choice

Use **Google Gemini 1.5 Pro** or **2.0 Flash**. Both support long context so they can use thousands of products and reference charts in the same conversation without losing track. Configure via `GEMINI_MODEL` in Edge Function secrets.

---

## Recommended AI Tool Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **The Brain (LLM)** | Google Gemini 2.0 Flash (or 1.5 Pro) | Reasoning, medical/supplement guidance, beauty advice, persona switch. |
| **The Heart (Backend)** | Supabase | User data, medical report references, blood test history, "Digital Log" memory, RAG vectors (pgvector). |
| **The Store (Data)** | Shopify Storefront API | Live product descriptions, prices, stock. Feed metafields (purpose, skin type, ingredients). |
| **The Voice (Omnichannel)** | Gorgias + ManyChat | Unified inbox: WhatsApp, Instagram, Facebook. All call the same `beauty-assistant` endpoint. |
| **Voice Interaction (Premium)** | ElevenLabs + Whisper | "Real Voices" for Dr. Sami and Ms. Zain in the premium tier. |

---

## Phase A: Data Ingestion ("Feeding" the Brain)

### 1. Shopify synchronization

- Connect the store via **Storefront API** (e.g. `lovable-project-milns.myshopify.com`).
- Feed the system **product metafields**, not just names: purpose ("Good for Oily Skin"), key ingredients ("Rich in Zinc"), skin type tags.
- Options: (a) Call Storefront API from the Edge Function at request time and inject a summary into the prompt; (b) Sync products into Supabase and optionally embed for RAG so the brain "looks up" relevant products instead of holding the full catalog in context.

### 2. Clinical reference data (Dr. Sami)

- Upload **PDFs or CSVs** with optimal mineral/vitamin blood ratios and reference ranges.
- Store in Supabase (e.g. as text chunks or in a `clinical_reference` table). Optionally embed and use **RAG**: when the user shares a blood report or asks about deficiencies, the bot searches these charts and grounds the answer in your facts so Dr. Sami does not guess.

### 3. The "Beauty Bible" (Ms. Zain)

- Build a **structured database** of skincare ingredients (Retinol, Vitamin C, Niacinamide, etc.) and their effects by skin type (oily, dry, sensitive, combination).
- Feed this into the brain (inline in prompt for small sets, or via RAG for large sets) so Ms. Zain can give specialist-level advice on layering, contraindications, and product matching.

---

## Phase B: Intent Detection (Persona Switch)

**Current implementation:** The system prompt instructs the LLM to analyze the user's input and choose Dr. Sami vs Ms. Zain. No separate "logic gate" is required for basic behavior.

**Optional fast path (code-level gate):** In your Edge Function you can add a lightweight pre-step:

- If the user message contains keywords like **"blood," "iron," "supplements," "health," "dose," "pregnancy"** → bias or route to **Dr. Sami** (clinical, precise).
- If the user message contains **"cream," "makeup," "skin type," "glow," "lipstick," "routine"** → bias or route to **Ms. Zain** (empathetic, luxury, aesthetic).

You can pass this as a hint in the prompt (e.g. "Detected topic: wellness") or keep full intent detection inside the LLM. Same endpoint either way.

---

## Efficiency & Active Service: Three Protocols

### 1. RAG (Retrieval-Augmented Generation)

The bot should **look up** instead of "remember" everything.

- **Flow:** User shares a blood report or asks about a deficiency → bot searches your **clinical charts** (vector or keyword search) → finds discrepancies → searches **Shopify / product DB** for the exact supplement that addresses that deficiency → generates a grounded reply (Dr. Sami).
- **Implementation:** Store clinical reference and product snippets in Supabase (pgvector or full-text). In the Edge Function, run a retrieval step before calling Gemini and inject the retrieved chunks into the system or user message.

### 2. Proactive usage monitoring (WhatsApp automation)

- **Depletion trigger:** In your database, track purchases (e.g. "30-day supply of Vitamin D"). Schedule a job or webhook that checks "days since purchase" or "estimated runout date."
- **Action:** On Day 25 (or your chosen lead time), trigger a WhatsApp message via ManyChat (or your automation): *"Hi, Dr. Sami here. Your Vitamin D is running low—shall I add a refill to your cart to keep your levels optimal?"*
- **Implementation:** Supabase table for orders/line items + estimated depletion date; cron or Edge Function that calls ManyChat/WhatsApp API when a user crosses the threshold.

### 3. "Honor of Service" consultative sales

Program the agents so they **never just answer the question**; they **offer a solution** and, where relevant, suggest the next best step (cross-sell, layering).

- **Bad:** "Yes, we have Vitamin C."
- **Ezabila (Ms. Zain):** "We have a highly active Vitamin C serum that is perfect for your brightening goals. Based on your previous purchase of our cleanser, this will double your results. Would you like to see how to layer them?"

This behavior is encoded in the **system prompt** (see `supabase/functions/beauty-assistant/index.ts`): both personas are instructed to respond in a consultative, solution-oriented way and to direct users to the Digital Tray or next step where appropriate.

---

## Implementation checklist (high level)

| # | Item | Status / Note |
|---|------|----------------|
| 1 | Central Brain (Gemini + Edge Function) | Implemented in `beauty-assistant` |
| 2 | Dual-persona system prompt (Sami + Zain) | In `beauty-assistant/index.ts` |
| 3 | Shared memory (`messages` array) | Supported in request body |
| 4 | Shopify sync (products + metafields) | Use Storefront API; optional sync to Supabase |
| 5 | Clinical reference data (mineral/vitamin charts) | Ingest PDFs/CSVs; optional RAG with pgvector |
| 6 | Beauty Bible (ingredients × skin type) | Structured data or RAG |
| 7 | Intent detection (persona switch) | In-prompt; optional keyword pre-step |
| 8 | RAG for clinical + product lookup | Add retrieval step before Gemini call |
| 9 | Depletion triggers + WhatsApp reminders | DB + cron/Edge Function + ManyChat |
| 10 | Honor of Service (consultative replies) | In system prompt |

---

## References

- **Brain implementation:** `supabase/functions/beauty-assistant/index.ts`
- **Step 1 (tools, data, efficiency):** `docs/EZABILA_STEP1_AI_SETUP_AND_DATA.md`
- **Architecture (nervous system, omnichannel):** `docs/ASPER_AI_PROTOCOL_ARCHITECTURE.md`
