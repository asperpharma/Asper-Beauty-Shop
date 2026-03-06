# Smart Health Chatbot Roadmap — Reference

**Source:** Summary of architectures and design principles from AMIE (Articulate
Medical Intelligence Explorer) and PHIA (Personal Health Insights Agent), plus
Google Health AI Developer Foundations (HAI-DEF).\
**Use:** Reference for building or evolving health/wellness AI (e.g.
clinical-style dialogue, personal health insights, or a more capable
beauty/wellness assistant).\
**Disclaimer:** This is guidance and architecture reference only, not medical or
legal advice.

**Detailed AMIE technical summary (disease management paper):**
[AMIE_DISEASE_MANAGEMENT_PAPER_SUMMARY.md](AMIE_DISEASE_MANAGEMENT_PAPER_SUMMARY.md)
— dual-agent architecture, Dialogue vs Mx Agent, state, chain-of-reasoning, Mx
long-context + retrieval + structured generation, OSCE and RxQA evaluation,
limitations.

---

## 1. Foundation: Open Models for Development

**Health AI Developer Foundations (HAI-DEF)** — suite of open-weight models for
healthcare AI.

- **MedGemma:** Family of open models (Gemma 3–based) for medical text and image
  comprehension. Use for radiology image analysis, clinical note summarization,
  etc.
- **Availability:** Download and run in your own environment (local or cloud)
  for sensitive data and privacy. Available via **Vertex AI Model Garden** and
  **Hugging Face**.

---

## 2. Architecture Blueprints: Making the Bot “Smart”

Research suggests a **system of specialized agents**, not a single model.

### A. Diagnostic & Clinical Dialogue (AMIE-Style)

For medical interviews or differential diagnosis:

- **Dialogue Agent (System 1):** Fast, user-facing. Maintains rapport, empathy,
  and flow; gathers information and communicates; does not do heavy clinical
  reasoning alone.
- **Management/Reasoning Agent (System 2):** Background “Mx Agent.” Long-context
  reasoning, analyzes history, retrieves from clinical guidelines (PDFs, DBs),
  formulates plans.
- **State-awareness:** Track internal state (e.g. “History Taking,” “Diagnosis,”
  “Follow-up”) and update understanding of the user (symptoms, demographics) as
  the conversation progresses.

### B. Personal Health Data & Wearables (PHIA-Style)

For fitness, sleep, wearables:

- **Code-generation tools:** Give the agent a Python sandbox to analyze
  time-series data (steps, heart rate) instead of asking the LLM to do math.
- **Information retrieval:** Search tool for up-to-date health knowledge so
  answers are grounded in current science.
- **Iterative reasoning:** Use something like **ReAct (Reason + Act):** think →
  plan analysis → execute code → observe result → formulate answer.

---

## 3. Key Capabilities to Implement

- **Multimodal perception:** Handle images (e.g. skin, lab reports). Integrate
  findings into dialogue. Consider **MedSigLIP** or similar image encoders.
- **Proactive context-seeking:** “Wayfinding AI” that asks clarifying questions
  before giving advice; leads to more tailored, relevant answers.
- **Long-context reasoning:** Use models that can process large inputs (full
  guidelines, long dialogue) for safer, evidence-based recommendations.

---

## 4. Safety & Oversight (Critical for Health Apps)

From **g-AMIE (guardrailed-AMIE)**:

- **Physician oversight:** AI collects information (e.g. history taking) but
  diagnosis/prescriptions go to a human clinician for review.
- **Guardrails:** Dedicated “guardrail agent” to ensure the dialogue agent does
  not give unauthorized individualized medical advice.
- **Clinician cockpit:** Interface for experts to review AI summaries and notes
  before finalizing.

---

## 5. Evaluation Strategy

Avoid relying only on generic chat metrics:

- **Simulated dialogues:** “Self-play” — one AI as doctor, one as patient — to
  generate many training conversations.
- **OSCE-style evaluation:** Test with varied, realistic scenarios (including
  “patient actors”) for empathy, diagnostic accuracy, management reasoning.
- **Rubrics:** Score on history-taking, communication, diagnostic accuracy (not
  just fluency).

---

## Relation to Asper Beauty Shop

**Our actual scope:** We want a **wellness and supplement advisor** — good
information on **supplements, vitamins, health benefits, and our products**
(skincare, beauty, supplements). We do **not** need a doctor or clinical
assistant. See **[WELLNESS_CHATBOT_SCOPE.md](WELLNESS_CHATBOT_SCOPE.md)** for
the single source of truth.

The current **Beauty Assistant** is a wellness/shopping assistant (product
advice, skincare tips, non-diagnostic). It is **not** a clinical or diagnostic
system.

If you later want to:

- Add **deeper skincare/wellness dialogue** (more structured, state-aware), you
  can borrow from the AMIE-style split (friendly dialogue agent + separate
  reasoning/retrieval).
- Add **image input** (e.g. skin concerns for product matching), the multimodal
  and proactive context-seeking sections apply.
- Add **safety guardrails** (e.g. “always recommend consulting a dermatologist
  for X”), the guardrail-agent and oversight ideas are relevant.

Keeping this roadmap in the repo gives a clear path from “simple Q&A” toward
more capable, safe health/wellness dialogue if you choose to evolve in that
direction.

---

_Reference document — not medical or legal advice._
