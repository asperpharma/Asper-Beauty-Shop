# Asper Beauty Shop: Launch Day Protocol

Hour-by-hour schedule for bringing the "Digital Pharmacy" online safely. Use
this on go-live day; the **Domain Pulse** and **Gold Stitch** checks are visual
audits you run on your phone.

**Strategic decision:** After Phase 3, if 5/5 Inner Circle say "Smooth" →
proceed to Public Launch. If anyone reports "The image didn't load" → halt and
fix before going public.

---

## Phase 1: The "Silent" Go-Live (Hours 0–2)

**Goal:** Verify the store is functioning before telling anyone.

### Hour 0:00 – The Domain Pulse

- **Action:** Open **asperbeauty.com** (or your live domain) in a browser.
- **Check:**
  - Do you see the **Soft Ivory** background (`#F8F8FF`)?
  - Is the **green padlock (SSL)** visible in the URL bar?

_You must perform this visual audit yourself on your phone._

---

### Hour 0:30 – The "Gold Stitch" Audit

- **Action:** Scroll through the homepage on your phone.
- **Check:**
  - Do product cards look clean (white on ivory)?
  - Does the layout flow smoothly without "jumping"?

---

### Hour 1:00 – The Checkout Stress Test

- **Action:** Place a **Cash on Delivery (COD)** order for a low-cost item (e.g.
  3.00 JOD).
- **Check:**
  - Did you get the **confirmation email** quickly?
  - Does the email show the **Maroon logo** and "Your order is confirmed"?

---

## Phase 2: The Knowledge Injection (Hours 2–4)

**Goal:** Wake up the "Digital Pharmacist" and load inventory.

### Hour 2:00 – The Mass Import

- **Action:** Open Supabase Dashboard or call your **bulk-product-upload** Edge
  Function URL.
- **Monitor:** Watch products (e.g. 5,000 SKUs) populate in Shopify.
- **Critical check:** Search for **"Vichy Mineral 89"**. Does it appear with the
  correct price and image?

---

### Hour 3:00 – The Concierge Training

- **Action:** Open the **chatbot** on the live site.
- **Test:** Ask: _"I have acne."_
- **Verify:** Does it recommend the **La Roche-Posay Effaclar** routine (as
  scripted)? If it suggests anti-aging cream for acne, adjust the tags/script.

---

## Phase 3: The "Velvet Rope" Opening (Hours 4–6)

**Goal:** Invite the first wave of VIPs (family & friends) to test logistics.

### Hour 4:00 – The "Inner Circle" Link

- **Action:** Send the store link to **5 trusted people** via WhatsApp (use the
  script below).
- **Script:** See **Marketing Tease Assets** § 1.

---

### Hour 6:00 – Review & Refine

- **Action:** Check **Gorgias** and **Shopify** inbox.
- **Metric:** Any images failed to load? Did the bot get stuck? Fix before the
  public sees the site.

---

## Marketing Tease Assets (Phase 3)

Copy-paste ready for Hour 4:00 and for the Concierge stress test.

---

### 1. The "Inner Circle" WhatsApp (Family & Friends)

**Goal:** Get honest feedback on the 3-Click flow and visuals without risking
public reputation.\
**Tone:** Exclusive, personal, professional ("Pharmacist Logic").

**Subject:** Shh... The Pharmacy is Open 🤫

**Body:**

```
Hi [Name],

I am officially (but quietly) opening the digital doors to Asper Beauty Shop today.

Before we announce it to Jordan, I want my inner circle to experience the "Morning Spa" first. I need your honest feedback on our new Digital Pharmacist:

👉 Click here: https://asperbeauty.com

Tap "Find My Routine" (The Skin Quiz).

Let me know if the recommendation feels accurate for your skin type.

You are the first to see this. Enjoy the "Ivory & Gold" experience. ✨
```

---

### 2. The "Soft Launch" Instagram Story (For the Curious)

**Goal:** Build mystery and capture early leads (DMs) to test Gorgias
automation.

**Visual:** Soft Ivory background (`#F8F8FF`) with Maroon logo or text in the
center.

**Slide 1**

- **Text (Serif / Playfair):** _"Something clinical. Something luxurious."_
- **Text (Small / Sans):** _"The Digital Pharmacy is loading..."_

**Slide 2**

- **Visual:** Screenshot of the "3-Click Skin Quiz" on a mobile screen.
- **Text:** _"We are opening the doors for 10 people tonight to test our new AI
  Pharmacist."_
- **Sticker:** "I want access ✋" (link sticker to DM).

---

### 3. The "Concierge" Stress Test Script (Before Sending WhatsApp)

**Goal:** Confirm the "Brain" (Gorgias / Supabase) works before VIPs click.\
**Action:** Open the site in **Incognito** and act as a difficult customer. ~30
seconds.

| Test            | Action                                   | Pass condition                                                                  |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| **"Fake" Test** | Type _"Is this authentic?"_ in the chat. | Bot replies with the "Gold Standard Guarantee" macro.                           |
| **"Acne" Test** | Click the **Acne** option in the quiz.   | Bot recommends **Vichy Normaderm** (or Effaclar routine), not anti-aging cream. |
| **"COD" Test**  | Add an item to cart and go to checkout.  | "Cash on Delivery" is selectable and clearly labeled.                           |

---

## Phase 4: The 24-Hour Post-Launch Audit

**When:** 24 hours after you complete Phase 3 (Velvet Rope) and remove the store
password.\
**Goal:** Final diagnostic layer—ensure the "Morning Spa" runs with
medical-grade precision and the "Authentic Quality" promise is technically and
visually intact.

**Full checklist:** Use the detailed
[24-Hour Clinical Audit](audits/24_HOUR_CLINICAL_AUDIT.md) in **docs/audits/**.
It covers:

1. **Technical Spine** — Supabase/Edge Function logs, API latency (< 200 ms),
   SSL & redirect health.
2. **Visual Diagnostic** — Token verification (Soft Ivory, Maroon, Shiny Gold),
   typography (Playfair/Montserrat), image "Clinical Brightness."
3. **Concierge Performance** — Intent accuracy (Acne vs. Aging, local/dialect
   keywords), 3-Click drop-off points, Authenticity trigger.
4. **Fulfillment & Trust Pulse** — COD confirmation email/SMS, shipping tiers (3
   JOD / Free >50 JOD), order tagging (e.g. Concern_Acne).
5. **Pharmacist's Summary** — Report card (Visual DNA, API, Concierge,
   Trust/COD) and strategic directive: Pass → Full Public Launch; Fail → fix and
   re-audit.

**Saving reports:** Copy the audit template for each run and save in
**docs/audits/** as `YYYY-MM-DD_24h_audit.md`. This builds a "Medical History"
for the storefront as you scale. See [docs/audits/README.md](audits/README.md).

**Quick pass (same day):** If you need a short list first, run these six, then
complete the full audit:

| # | Check                                                                     | Pass |
| - | ------------------------------------------------------------------------- | ---- |
| 1 | Domain Pulse (mobile: Soft Ivory, SSL, Maroon)                            | [ ]  |
| 2 | 3-Click flow (Concern → Cart; Acne path correct)                          | [ ]  |
| 3 | COD end-to-end (test order, email, Shopify)                               | [ ]  |
| 4 | Concierge ("Is this authentic?" + Acne → Normaderm/Effaclar)              | [ ]  |
| 5 | Catalog (e.g. "Vichy Mineral 89" + no broken images)                      | [ ]  |
| 6 | First [Customer Success Report](CUSTOMER_SUCCESS_REPORT.md) Sections I–II | [ ]  |

---

## Hour 25: Final Checklist (After All Passes)

Once your [24-Hour Clinical Audit](audits/24_HOUR_CLINICAL_AUDIT.md) shows **All
Passes**, you are cleared for:

| # | Action                                                       | Done |
| - | ------------------------------------------------------------ | ---- |
| 1 | Remove the "Beta" or store password from Shopify (if any).   | [ ]  |
| 2 | Post the **"Hour 25"** announcement to Instagram.            | [ ]  |
| 3 | Switch the WhatsApp bot from **Test Mode** to **Live Mode**. | [ ]  |

**Asper DNA status: 100% deployed**

- **Visuals:** Soft Ivory, Maroon, and Gold are locked via the
  [Clinical Verification](../src/lib/verifyBrandDNA.ts) script.
- **Intelligence:** 3-Click Solution is mapped to 5,000 SKUs; funnel tracking is
  in [quizFunnelAnalytics](../src/lib/quizFunnelAnalytics.ts) and wired in the
  chat/quiz flow.
- **Trust:** Authenticity Guard and COD are active.

---

## Strategic Decision Point

**You are at Hour 0:00.**

- **Domain Pulse (0:00)** and **Gold Stitch (0:30):** Run these visual checks
  yourself on your phone.
- **After Phase 3 (Hour 6):** If **5/5** Inner Circle say "Smooth" → proceed to
  **Public Launch**. If anyone says "The image didn't load" (or similar) →
  **halt and fix** before going public.

---

**Quality & measurement:** The **Clinical Verification** (DNA Guard) runs in the
browser console on load—see `src/lib/verifyBrandDNA.ts`. For weekly Concierge
performance, use the [Customer Success Report](CUSTOMER_SUCCESS_REPORT.md)
(Concierge Log).

**Related:** [Master Launch Checklist](MASTER_LAUNCH_CHECKLIST.md) ·
[Operational Launch Plan](OPERATIONAL_LAUNCH_PLAN.md) ·
[One-page Go-Live](LAUNCH_CHECKLIST_ONE_PAGE.md)
