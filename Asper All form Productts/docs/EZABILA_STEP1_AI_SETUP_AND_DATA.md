# Ezabila AI — Step 1: Tools, Agent Setup, Data Feeding & Efficiency

**Project Vision:** Ezabila Beauty & Health Care AI (Dual-Core: Dr. Sami + Ms. Zain)  
This document is **Step 1** of the implementation roadmap: which AI tools to use, how to set up and feed the agents, and how to make the system efficient.

---

## 1. AI Tools to Use

| Layer | Tool | Purpose |
|-------|------|--------|
| **Brain (LLM)** | **Google Gemini** (e.g. Gemini 2.0 Flash or 2.5 Flash) | Single “brain” for both personas; runs in `beauty-assistant` Supabase Edge Function. Handles intent detection (Sami vs Zain) and reply generation. |
| **Orchestration** | **Supabase Edge Functions** (Deno) | Hosts the assistant API; injects system prompt, calls Gemini, optional product/health lookup. |
| **Product & inventory** | **Shopify Storefront API** (existing) | Real-time catalog (5,000+ SKU), stock, descriptions. Can be called from Edge Function or synced into your DB. |
| **Structured data (optional)** | **Supabase Postgres + pgvector** | Store product embeddings, health/supplement knowledge chunks for RAG so the LLM gets “live” catalog and scientific data without putting everything in the prompt. |
| **Embeddings (optional)** | **Gemini Embedding API** or **OpenAI text-embedding-3-small** | Turn product descriptions and knowledge docs into vectors for retrieval. |
| **Channels** | **ManyChat / Gorgias / your frontend** | WhatsApp, Instagram, website; all call the same `beauty-assistant` endpoint so one brain serves all channels. |

**Recommended minimum for Step 1:**  
Gemini (LLM) + Supabase Edge Function + Shopify (product data). Add pgvector + embeddings when you need RAG for large catalogs or long health documents.

---

## 2. Steps to Set Up the Agents (Dr. Sami & Ms. Zain)

You have one brain and two personas; setup is one pipeline with a single system prompt that defines both.

### 2.1 Deploy the Central Brain

1. **Code:** `supabase/functions/beauty-assistant/index.ts` already contains the dual-persona system prompt (Dr. Sami + Ms. Zain).
2. **Deploy:**
   ```bash
   supabase functions deploy beauty-assistant
   ```
3. **Secrets (Supabase Dashboard → Edge Functions → beauty-assistant → Secrets):**
   - `GEMINI_API_KEY` — required for Gemini.
   - Optional: `GEMINI_MODEL` (e.g. `gemini-2.0-flash` or `gemini-2.5-flash` when available).

### 2.2 Request Format (so channels can “feed” the agent)

- **Endpoint:** `POST https://<PROJECT_REF>.supabase.co/functions/v1/beauty-assistant`
- **Headers:** `Authorization: Bearer <ANON_OR_SERVICE_KEY>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "message": "User's latest message",
    "messages": [
      { "role": "user", "text": "Previous user message" },
      { "role": "model", "text": "Previous bot reply" }
    ]
  }
  ```
- **Response:** `{ "reply": "Dr. Sami or Ms. Zain reply with signature" }`

Use the same endpoint from your website, ManyChat, Gorgias, or a mobile app so all channels share one brain and one memory (via `messages`).

### 2.3 No Separate “Two Agents” Setup

- You do **not** train or deploy two different bots.
- One Edge Function, one Gemini model, one system prompt that defines both personas and instructs the model to “direct” to Dr. Sami or Ms. Zain based on intent.

---

## 3. Feeding Data Into the Agents

Data improves accuracy and relevance; the agents don’t “learn” at runtime—you feed context at request time (and optionally via RAG).

### 3.1 Product Catalog (for Ms. Zain and stock-aware Dr. Sami)

**Option A — Call Shopify at request time (simplest for Step 1)**  
- In `beauty-assistant`, before calling Gemini, call Shopify Storefront API (e.g. products by tag/category, or search).
- Put a short summary (e.g. “Available: Product A, B, C; out of stock: D”) into the system prompt or a single “context” user message so the model never recommends out-of-stock items.

**Option B — Sync Shopify → Supabase, then inject**  
- Use your existing `bulk-product-upload` or a scheduled job to sync products into a `products` table (title, handle, description, tags, stock).
- In the Edge Function, query Supabase for “current in-stock products” (or by concern/tag) and inject that text into the prompt.

**Option C — RAG with embeddings (efficient for 5,000+ SKUs)**  
- Sync products to Postgres; generate embeddings (e.g. Gemini embedding) for title + description; store in `pgvector`.
- On each user message, run a vector search for relevant products, then inject only the top 10–20 into the prompt. Reduces token use and keeps answers product-accurate.

**What to feed:**  
- Product title, handle, short description, tags (e.g. “Acne”, “Vitamin C”), availability.  
- For Ms. Zain: focus on categories like Makeup, Skincare, Fragrance. For Dr. Sami: Supplements, Medical Devices, Dermocosmetics (Vichy, LRP, CeraVe).

### 3.2 Dr. Sami: Health & Supplement Knowledge

**Purpose:** Scientific accuracy (mineral/vitamin ranges, supplement protocols, safety).

**Ways to feed:**

1. **Curated knowledge docs (best for Step 1)**  
   - Write (or export) short documents: “Vitamin/mineral reference ranges”, “Rigenforte usage”, “Pregnancy-safe supplements”, “Omron device usage”.  
   - Store as markdown or text in your repo or Supabase (e.g. `knowledge` table or files).  
   - In the Edge Function: for Dr. Sami-style queries, fetch the relevant doc(s) and append to the system prompt or as a context block. No embedding required for small sets.

2. **RAG for large or many documents**  
   - Chunk the docs, embed with Gemini (or another embedding model), store in pgvector.  
   - On “clinical” or “supplement” questions, run vector search and inject only the retrieved chunks into the prompt.  
   - Ensures Dr. Sami’s answers are grounded in your approved content.

**What to feed:**  
- Normal ranges for key vitamins/minerals, supplement dosing, contraindications (e.g. pregnancy), device instructions. Never raw medical reports in the prompt; use only aggregated, anonymized guidance.

### 3.3 Ms. Zain: Beauty & Skincare Expertise

**Purpose:** Product efficacy, skin types, ingredients, application.

**Ways to feed:**

1. **Shopify catalog (above)** — product descriptions, tags, benefits.  
2. **Ingredient/skin-type rules (optional)** — e.g. “Oily + Acne → salicylic acid, niacinamide”; “Dry → hyaluronic acid, ceramides”. Small tables or markdown; inject when the query is about skin type or routine.  
3. **3-Click flows** — your existing `get-products-by-concern` / regimen logic; the Edge Function can call it and inject “Recommended regimen: Cleanser X, Serum Y, Moisturizer Z” into the prompt so Ms. Zain’s answers match the Digital Tray.

**What to feed:**  
- Current in-stock products, regimen templates, ingredient/skin-type snippets. Keep each context block short (e.g. 200–500 tokens per block) so the model stays focused.

---

## 4. Making the Services More Efficient

| Area | Approach |
|------|----------|
| **Latency** | Use a fast model (e.g. Gemini 2.0 Flash). For very low latency, add a tiny “intent” step (e.g. “Sami vs Zain” or “product vs health”) with a smaller/faster model or rule-based keywords, then call the full brain only for the reply. |
| **Token use** | Inject only relevant data: e.g. 10–20 products for the current query, not the full catalog. Use RAG so the prompt contains only retrieved chunks. |
| **Cost** | Cache repeated or similar questions (e.g. “What’s in Rigenforte?”) in Redis or Supabase; return cached reply when the question is close enough. Limit `maxOutputTokens` (you already use 1024). |
| **Accuracy** | Always inject stock status so the model never recommends out-of-stock items. For Dr. Sami, ground answers in your knowledge base or RAG chunks; add a line in the system prompt: “Only use the provided context for health/supplement answers.” |
| **Reliability** | Add retries and timeouts for Gemini and Shopify calls in the Edge Function. Log failures (e.g. to Supabase or your monitoring tool) for debugging. |
| **Omnichannel** | One endpoint, one brain. ManyChat/Gorgias send the same `message` + `messages` format; no duplicate training or separate agents. |

---

## 5. Step 1 Checklist (Concrete)

- [ ] **Deploy** `beauty-assistant` and set `GEMINI_API_KEY` (and optional `GEMINI_MODEL`).
- [ ] **Verify** request/response from website or Postman: send `{"message": "I need a red lipstick"}` and get a Ms. Zain-style reply; send `{"message": "Is Rigenforte safe in pregnancy?"}` and get Dr. Sami with disclaimer.
- [ ] **Feed products:** Implement either Option A (Shopify call from Edge Function) or Option B (sync to Supabase + inject). Ensure “out of stock” is visible in context so the model never recommends unavailable items.
- [ ] **Feed Dr. Sami knowledge:** Add at least one small document (e.g. “Supplement safety and dosing”) and inject it for clinical queries (e.g. when user message contains “pregnancy”, “dose”, “vitamin”).
- [ ] **Connect one channel:** e.g. your website chat or ManyChat so the same endpoint is used in production.
- [ ] **Optional:** Add response caching for frequent questions and a simple intent classifier to reduce tokens and latency.

Once this is stable, Step 2 can add RAG (pgvector + embeddings), voice, and the “Digital Log” / premium features from your vision document.
