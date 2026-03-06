# 24-Hour Clinical Audit — Asper Beauty Shop

**Audit Date:** [YYYY-MM-DD]\
**Period Covered:** First 24 hours post go-live\
**Prepared By:** [Name/Role]

---

This protocol is the final diagnostic layer of launch. It ensures the **"Morning
Spa"** environment is performing with medical-grade precision and that the
**"Authentic Quality"** promise is technically and visually intact. Rooted in
the Asper Beauty DNA.

---

## 1. The Technical Spine (Backend & Infrastructure)

**Goal:** Verify the headless architecture handles the load of 5,000 SKUs and
that the "Brain" (Supabase) is communicating correctly with Shopify.

| # | Check                           | Action                                                                                                                              | Pass |
| - | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1 | **Supabase Edge Function Logs** | Review `bulk-product-upload` and sanitization logs. Ensure no timeouts during mass ingestion of Vichy and Maybelline data.          | [ ]  |
| 2 | **API Latency Check**           | Measure Shopify Storefront API response time. Product cards should load within **< 200 ms** to maintain the "seamless" luxury feel. | [ ]  |
| 3 | **SSL & Redirect Health**       | Confirm all `http` traffic is forced to `https`. Domain **asperbeauty.com** resolves globally with no "Insecure" warnings.          | [ ]  |

**Pharmacist note:** If the audit shows **Fail** on **API Latency** (e.g. > 200
ms), do **not** move to Public Launch. A laggy experience breaks the "Morning
Spa" serenity. Fix Supabase edge function caching (or API/network bottlenecks)
first, then re-audit.

**Notes:**

---

---

---

## 2. The Visual Diagnostic (DNA & UI Integrity)

**Goal:** Verify CSS tokens and brand DNA are consistent across different
hardware and brightness settings.

| # | Check                               | Action                                                                                                                   | Pass |
| - | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---- |
| 1 | **Token Verification — Background** | **Soft Ivory** (`#F8F8FF`) renders correctly (not gray or pure white) on OLED (e.g. iPhone) vs. LCD (e.g. Android).      | [ ]  |
| 2 | **Token Verification — Actions**    | **Maroon** (`#800020`) buttons have sufficient contrast for accessibility.                                               | [ ]  |
| 3 | **The Midas Touch**                 | **1px Shiny Gold** (`#C5A028`) border appears on hover for product cards (sample across catalog).                        | [ ]  |
| 4 | **Typography Consistency**          | **Playfair Display** (headlines) and **Montserrat** (UI) load via Google Fonts; no unintended fallback to system serifs. | [ ]  |
| 5 | **Image "Clinical Brightness"**     | Audit 20 random product images. High-key lighting and white "Digital Tray" backgrounds are uniform.                      | [ ]  |

**Notes:**

---

---

---

## 3. The Concierge Performance (Logic Audit)

**Goal:** Audit the first 24 hours of conversation logs so the AI is not
"hallucinating" or recommending wrong regimens.

| # | Check                     | Action                                                                                                                                            | Pass |
| - | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1 | **Intent Accuracy**       | Bot correctly distinguishes "Acne" vs. "Aging." Review 10 transcripts where users used Jordanian dialects or keywords like "pimple" or "wrinkle." | [ ]  |
| 2 | **The 3-Click Flow**      | Identify drop-off points. If users leave after Click 2, question logic may be too technical or options unclear.                                   | [ ]  |
| 3 | **Authenticity Triggers** | "Gold Standard Guarantee" script was triggered at least once. Tone was authoritative and reassuring.                                              | [ ]  |

**Notes:**

---

---

---

## 4. Fulfillment & Trust Pulse (Operations)

**Goal:** Audit the path from digital click to physical delivery in the
Jordanian market.

| # | Check                   | Action                                                                                                                         | Pass |
| - | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---- |
| 1 | **COD Confirmation**    | "COD Verification" email/SMS was sent for every COD order.                                                                     | [ ]  |
| 2 | **Shipping Tier Check** | System applied **3.00 JOD** for orders under 50 JOD and **0.00 JOD** (free) for orders 50 JOD and above.                       | [ ]  |
| 3 | **Tagging Integrity**   | In Shopify **Orders** dashboard, tags such as `Concern_Acne` are captured in order metadata for future personalized marketing. | [ ]  |

**Notes:**

---

---

---

## 5. The "Pharmacist's Summary" (Report Card)

Fill this at the end of the 24 hours to decide whether to move from **Soft
Opening** to **Full Public Launch.**

| Diagnostic Area       | Status            | Critical Fix Required? |
| --------------------- | ----------------- | ---------------------- |
| **Visual DNA**        | ( ) Pass ( ) Fail | (Describe if Fail)     |
| **API Connectivity**  | ( ) Pass ( ) Fail | (Describe if Fail)     |
| **Concierge Logic**   | ( ) Pass ( ) Fail | (Describe if Fail)     |
| **Trust / COD Setup** | ( ) Pass ( ) Fail | (Describe if Fail)     |

**Strategic directive:**

- If all four areas **Pass** → Proceed to **Full Public Launch.**
- If any **Fail** → Address critical fixes; re-run the affected section before
  scaling traffic.

**Signoff (Pharmacist Lead or Tech Owner):**\
_________________________ **Date:** __________

---

_Save this report in `docs/audits/` as `YYYY-MM-DD_24h_audit.md` to build the
storefront "Medical History."_
