# Wellness Chatbot Scope — What We Build (and Don’t)

**Purpose:** Single source of truth for what our chatbot is for. Keeps the
assistant aligned with the business and avoids scope creep into clinical/medical
AI.

---

## What we want: wellness & supplement advisor

Our chatbot is for **health benefits, vitamins, supplements, and our kind of
medical/supplement products** — not a doctor or clinical assistant.

| In scope                    | Examples                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Supplements & vitamins**  | What they’re for, typical uses, ingredients, how they might support wellness.                                  |
| **Product information**     | Our catalog: skincare, beauty, supplements; ingredients, benefits, usage.                                      |
| **General health/wellness** | Lifestyle, nutrition, skin care, fitness in a **consumer wellness** context.                                   |
| **Safe, clear disclaimers** | “This is not medical advice”; “talk to your doctor before starting supplements”; “we don’t diagnose or treat.” |

**We do not need:**\
A clinical or diagnostic assistant. No diagnosis, no treatment decisions, no
replacement for a doctor.

---

## What we don’t do (out of scope)

- **Medical diagnosis** — We don’t diagnose conditions or interpret symptoms as
  a clinician would.
- **Treatment advice** — We don’t prescribe or recommend specific medical
  treatments.
- **Replacing a doctor** — We don’t position the bot as a substitute for
  healthcare providers.
- **Clinical guidelines / drug formularies** — We don’t ground in NICE, BMJ, or
  drug labels for _medical_ decisions (we may use product/ingredient data for
  _product_ advice).
- **Imaging / radiology / pathology** — Not CXR, CT, Derm, Path, or HeAR-style
  use cases.

Keeping this boundary keeps the product safe, legally clearer, and focused on
**wellness and supplements**, not medicine.

---

## How we talk about it

**Good:**\
“Wellness and supplement advisor,” “health benefits and product information,”
“vitamins and supplements,” “skincare and beauty products,” “general wellness.”

**Avoid:**\
“Medical assistant,” “diagnostic AI,” “clinical,” “doctor replacement,”
“treatment recommendations.”

---

## Technical and content direction

- **Knowledge base:** Product catalog, ingredient lists, supplement/vitamin fact
  sheets, general wellness content (all non-diagnostic).
- **Tone:** Helpful, informative, cautious — with clear “not medical advice” and
  “consult a healthcare provider when needed” where relevant.
- **Guardrails:** No claims that we diagnose, treat, or replace a doctor; no
  specific “take this for that disease” medical advice.
- **References:** AMIE/PHIA/HAI-DEF docs are for **background and possible
  future patterns** (e.g. stateful dialogue, retrieval); we are **not** building
  a clinical system.

---

## Where this is reflected

- **Product/UX:** Copy and positioning describe the bot as
  wellness/supplement/product support.
- **Prompts & system instructions:** Explicit scope (supplements, vitamins,
  products, wellness) and out-of-scope (diagnosis, treatment, clinical).
- **Docs:** This file;
  [HEALTH_CHATBOT_ROADMAP_REFERENCE.md](HEALTH_CHATBOT_ROADMAP_REFERENCE.md) and
  [AMIE_DISEASE_MANAGEMENT_PAPER_SUMMARY.md](AMIE_DISEASE_MANAGEMENT_PAPER_SUMMARY.md)
  are references only, not a mandate to build clinical features.

---

_Defines scope for the Asper Beauty Shop wellness/supplement chatbot — health
benefits and vitamins, not medical diagnosis or treatment._
