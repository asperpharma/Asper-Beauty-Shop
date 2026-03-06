# Asper Beauty Shop: Strategic & Technical Study Guide

A concise review of the "Authentic Quality" pivot, dual-persona AI architecture, and technical infrastructure for the 2025–2026 roadmap.

---

## Part 1: Short-Answer Quiz

1. What is the core concept behind the "Dual-Persona" Brain architecture?
2. How does the AI maintain "Shared Memory" between its two personas?
3. Describe the professional role and tone assigned to Character A, Dr. Sami.
4. Describe the professional role and tone assigned to Character B, Ms. Zain.
5. What is the "3-Click Solution" and what are its three steps?
6. Which specific Large Language Model (LLM) and hosting service power the Centralised Brain?
7. What visual transformation does the "Morning Spa" vibe represent compared to the "Old Moody Style"?
8. What mandatory safety disclaimer must the Dr. Sami persona include when discussing symptoms?
9. Explain the role of Matrixify within the data ingestion and integration flow.
10. What are the specific shipping and payment logistics for customers located in Jordan?

---

## Part 2: Quiz Answer Key

1. **Dual-Persona Brain:** A single **Centralised Brain** (Google Gemini 2.5 Flash) powers one conversation; it does **not** use two separate bots. A "Director" (system prompt in the Supabase Edge Function) analyzes each message and switches "masks" to Dr. Sami (medical authority) or Ms. Zain (beauty advisory) based on user intent.
2. **Shared Memory:** Same database and chat history for both personas ("perfect telepathy"). The LLM receives the full message context so, e.g., Dr. Sami already knows what Ms. Zain recommended (e.g. Vichy serum for dry skin) and can tailor supplements or safety advice accordingly.
3. **Dr. Sami:** Clinical Authority and Pharmacist; dermocosmetics, supplements, medical safety. Tone: authoritative, precise, safety-focused — "The Voice of Science."
4. **Ms. Zain:** Beauty Advisor and "Best Friend"; makeup, fragrances, aesthetic routines. Tone: elegant, warm, editorial — "Morning Spa" vocabulary (radiance, ritual, glow).
5. **3-Click Solution:** (1) Analyze — identify skin concern; (2) Recommend — suggest regimen; (3) Regimen — direct to Digital Tray/Cart.
6. **LLM & hosting:** Google Gemini 2.5 Flash; deployed and executed via **Supabase Edge Functions**.
7. **Morning Spa vs Old Moody:** From "intimidating" evening gala (maroon backgrounds, white/gold text) to "trustworthy" clinical look: soft ivory (#F8F8FF), charcoal/maroon text, transparency and cleanliness.
8. **Dr. Sami disclaimer:** Must state: "I provide wellness guidance, not medical diagnosis."
9. **Matrixify:** Middleware for bulk import and image mapping of the 5,000+ SKU catalog from CSV; moves data into Shopify with correct smart-filter metadata.
10. **Jordan logistics:** Payment: online (Shopify Payments/Stripe) or Cash on Delivery (COD). Shipping: free over 50 JOD; under 50 JOD = 3 JOD fee.

---

## Part 3: Essay Questions (no answers provided)

1. **Strategic Pivot:** Analyze the shift from "Exclusivity" to "Transparent Trust" and "Authentic Quality"; how color, typography, and imagery support the new identity.
2. **Technical Synergy:** How React 18, Supabase, and Shopify Storefront API form a production-ready stack; real-time inventory and performance.
3. **Persona Logic:** Compare triggers and knowledge bases for Dr. Sami vs Ms. Zain; how the dual-persona balances clinical authority with luxury beauty.
4. **UX Philosophy:** "Intelligent Prescription" vs "Endless Scrolling"; how the AI Concierge and 3-Click Solution redefine the digital beauty journey.
5. **Operational Scalability:** Data cleaning and bulk upload workflows for 5,000+ SKUs; why removing certain description/instruction rows during ingestion is critical.

---

## Part 4: Glossary

| Term | Definition |
|------|------------|
| **3-Click Solution** | Analyze (concern) → Recommend (routine) → Regimen (cart). |
| **Authentic Quality** | 2025–2026 pivot: trusted, original, effective products. |
| **Centralised Brain** | Single AI (Gemini 2.5 Flash) with one conversation; a "Director" system prompt switches masks (Dr. Sami / Ms. Zain) by user intent — not two bots chatting. |
| **Dermocosmetics** | Clinical-grade skincare (e.g. Vichy, La Roche-Posay, CeraVe). |
| **Digital Tray** | Cart UI; "The Midas Touch" gold borders. |
| **Dr. Sami** | "The Voice of Science"; pharmacist-vetted clinical authority. |
| **Ivory Style** | #F8F8FF soft ivory; clinical cleanliness. |
| **Matrixify** | Bulk imports, image mapping, metadata validation for Shopify. |
| **Morning Spa** | Primary vibe: "Daytime Clinical Precision." |
| **Ms. Zain** | "Your Beauty Concierge"; elegant, warm beauty advisor. |
| **Omnichannel** | AI logic across WhatsApp (ManyChat), Instagram (Gorgias), etc. |
| **Shopify Storefront API** | Headless commerce; real-time stock and product data. |
| **Supabase Edge Functions** | Where AI logic is hosted (e.g. `beauty-assistant`). |
| **Tajawal** | Font for full RTL support (Arabic). |

---

## Centralised Brain: How the personas interact

- **One brain, mask-switching:** Dr. Sami and Ms. Zain are not two bots chatting with each other. A single brain (Gemini 2.5 Flash) uses a **Director** (system prompt) to choose who responds to each message. Same database and chat history = "perfect telepathy"; same Shopify Storefront API = unified inventory (no recommending OOS items; Sami can suggest clinically equivalent alternatives).
- **Metaphor:** Like a Pharmacist and a Beauty Consultant behind the same counter: Zain leads the shopping experience and taps Sami whenever a medical or safety question arises.

## Centralised Brain: Supabase key and fallback

- **Primary:** `VITE_SUPABASE_PUBLISHABLE_KEY` is the main credential for the Centralised Brain (Edge Functions). It carries the JWT used to authenticate requests.
- **Fallback:** If that is missing, the app may use `VITE_SUPABASE_ANON_KEY` so the Brain still receives an `Authorization` header. Both keys are safe in the browser when RLS is correctly configured.
- **Action:** Prefer setting `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` (and in deployment env) so the strictest configuration is used and the fallback is not needed.

---

*Source context: Asper Strategic Execution Playbooks, Technical Architecture, Operational Launch & Integration Guide. Study guide for internal review and onboarding.*
