# 24-Hour Clinical Audit

**Objective:** Verify the "Morning Spa" environment is performing with
**medical-grade precision** and that the "Authentic Quality" promise is
technically and visually intact. This protocol is rooted in the **Asper Beauty
DNA**.

**Audit Date:** _________________\
**Audit Window:** _________________ (e.g. Launch Day 1, Post-Launch Week 1)

> **Automated data:** Run
> `curl "https://YOUR_PROJECT.supabase.co/functions/v1/audit-24h"` to fetch
> aggregated telemetry for the last 24 hours. See
> [CLINICAL_SENSORS_IMPLEMENTATION.md](../CLINICAL_SENSORS_IMPLEMENTATION.md).

---

## 1. The Technical Spine (Backend & Infrastructure)

Verify that the headless architecture handles 5,000 SKUs and that the "Brain"
(Supabase) communicates correctly with Shopify.

| Check                           | Status | Notes                                                                                                                |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| **Supabase Edge Function Logs** | [ ]    | Review bulk-product-upload and sanitization logs. Ensure no timeouts during mass ingestion of Vichy/Maybelline data. |
| **API Latency**                 | [ ]    | Measure Shopify Storefront API response time. Product cards should load within **<200ms** for a seamless feel.       |
| **SSL & Redirect Health**       | [ ]    | Confirm all http → https. Domain asperbeauty.com resolves globally with no "Insecure" warnings.                      |

---

## 2. The Visual Diagnostic (DNA & UI Integrity)

Verify CSS tokens and **brand DNA** are consistent across different hardware and
brightness settings.

| Check                         | Status | Notes                                                                                                        |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| **Background**                | [ ]    | Soft Ivory (#F8F8FF) renders correctly (not gray or pure white) on OLED (e.g. iPhone) vs LCD (e.g. Android). |
| **Action Elements**           | [ ]    | Maroon (#800020) buttons have sufficient contrast for accessibility.                                         |
| **The Midas Touch**           | [ ]    | 1px Shiny Gold (#C5A028) border appears on hover for product cards.                                          |
| **Typography**                | [ ]    | Playfair Display (headlines) and Montserrat (UI) load via Google Fonts; no unintended system serif fallback. |
| **Image Clinical Brightness** | [ ]    | Audit 20 random product images. High-key lighting and white "Digital Tray" backgrounds are uniform.          |

---

## 3. The Concierge Performance (Logic Audit)

Audit conversation logs to ensure the AI is not "hallucinating" and is
recommending the correct regimens.

| Check                     | Status | Notes                                                                                                                                              |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intent Accuracy**       | [ ]    | Bot correctly identified "Acne" vs "Aging". Audit 10 transcripts where users used local Jordanian dialects or keywords like "pimple" or "wrinkle." |
| **3-Click Flow**          | [ ]    | Check for drop-off points. If users leave after Click 2, the question logic may be too technical or the options unclear.                           |
| **Authenticity Triggers** | [ ]    | "Gold Standard Guarantee" script triggered at least once. Tone was authoritative and reassuring.                                                   |

---

## 4. Fulfillment & Trust Pulse (Operations)

This section audits the transition from a digital click to a physical delivery
**in the Jordanian market**.

| Check                   | Status | Notes                                                                                                                                 |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **COD Confirmation**    | [ ]    | Verify that the "COD Verification" email/SMS was sent for every order.                                                                |
| **Shipping Tier Check** | [ ]    | Confirm the system correctly applied 3.00 JOD for orders under 50 JOD and 0.00 JOD for those above.                                   |
| **Tagging Integrity**   | [ ]    | Check the Shopify "Orders" dashboard. Ensure tags like Concern_Acne are captured in order metadata for future personalized marketing. |

---

## 5. The Pharmacist's Summary (Report Card)

At the end of the 24 hours, complete this summary to decide whether to move from
"Soft Opening" to "Full Public Launch."

| Diagnostic Area       | Status      | Critical Fix Required? |
| --------------------- | ----------- | ---------------------- |
| **Visual DNA**        | Pass / Fail | _(Describe if Fail)_   |
| **API Connectivity**  | Pass / Fail | _(Describe if Fail)_   |
| **Concierge Logic**   | Pass / Fail | _(Describe if Fail)_   |
| **Trust / COD Setup** | Pass / Fail | _(Describe if Fail)_   |

**Strategic Directive:**

- [ ] **Proceed to Full Public Launch** (all areas Pass, no critical fixes).
- [ ] **Extend Soft Opening** (fixes required; re-run audit after changes).

**Auditor:** _________________\
**Date Completed:** _________________
