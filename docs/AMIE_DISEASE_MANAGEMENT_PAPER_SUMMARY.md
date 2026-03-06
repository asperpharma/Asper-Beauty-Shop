# AMIE Disease Management Paper — Technical Summary

**Paper:** _Towards Conversational AI for Disease Management_\
**Authors:** Palepu et al. (Google Research, Google DeepMind)\
**Source:** User-provided transcript (NotebookLM-style export).\
**Purpose:** Technical reference for the AMIE architecture, evaluation, and
methods. Complements
[HEALTH_CHATBOT_ROADMAP_REFERENCE.md](HEALTH_CHATBOT_ROADMAP_REFERENCE.md).

---

## 1. Main contribution

AMIE is extended from **diagnostic** dialogue to **management reasoning**:
disease progression over multiple visits, response to therapy, and medication
reasoning, grounded in clinical guidelines (NICE, BMJ Best Practice) and drug
formularies.

- **OSCE study:** Randomized, blinded; AMIE vs 21 PCPs; 100 multi-visit
  scenarios (3 visits each); 5 specialties; guidelines-based.
- **Result:** AMIE non-inferior to PCPs on management reasoning; better on
  **preciseness** of treatments/investigations and **guideline
  alignment/grounding**.
- **RxQA:** New medication benchmark (OpenFDA + BNF); pharmacist-validated; AMIE
  better than PCPs on higher-difficulty questions (open- and closed-book).

---

## 2. System architecture (dual-process)

Two agents (Kahneman-style System 1 / System 2):

| Agent              | Role                     | Latency       | Main function                                                                                             |
| ------------------ | ------------------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| **Dialogue Agent** | User-facing conversation | Low (seconds) | Rapport, empathy, history-taking, communicates decisions; **orchestrates** state and calls Mx.            |
| **Mx Agent**       | Management reasoning     | ~1 min target | Long-context reasoning over patient + guidelines; produces **structured management plan** with citations. |

- Dialogue Agent is **invoked every turn**; Mx Agent is **invoked as a tool** by
  the Dialogue Agent.
- Dialogue Agent consumes the **latest management plan** from Mx as input.
- Both use **Gemini**; Dialogue Agent builds on Tu et al. (diagnostic AMIE),
  fine-tuned for multi-visit + management.

---

## 3. Dialogue Agent

### 3.1 Chain-of-reasoning (inference)

Three sequential steps per response:

1. **Plan response** — What to do next (what to ask, what to answer, wrap up or
   continue), using dialogue history **and** current agent state.
2. **Generate response** — Draft reply given the plan.
3. **Refine response** — Revise against criteria (no redundant questions,
   consistency, etc.).

All steps are **state-aware** (see below).

### 3.2 Agent state (shared with Mx)

Updated asynchronously; used by both agents:

- **Current patient summary** — Condensed symptoms (pos/neg), demographics,
  medical/drug/family/social history.
- **Current differential diagnosis** — Most probable + plausible alternatives.
- **Current management plan** — Produced by **Mx Agent** (not Dialogue Agent):
  in-visit investigations, post-visit investigations, post-visit
  actions/recommendations.

Plus e.g. **visit number** for initial vs follow-up logic.

### 3.3 Training

- **Base:** Gemini 1.5 Flash (replacing PaLM-2).
- **Data:** Single-visit and **multi-visit simulated** dialogues, medical QA,
  EHR summarization, real dialogues (rewritten for virtual chat).
- **Multi-visit simulation:** Top-down: vignette → visit outlines → per-visit
  dialogue → auto-eval → revision.
- **RLHF/RLAIF:** Reward model from human + LLM preferences (dialogue responses,
  case management); policy optimized with RL.

---

## 4. Mx Agent

### 4.1 Goal

Produce a **management plan** (in-visit investigations, ordered investigations,
recommendations/actions) with **citations** to guideline documents, tailored to
the patient and to multi-visit context.

### 4.2 Design choices

- **Long-context (Gemini):** Hundreds of pages of guidelines in context; avoid
  complex RAG pipelines; citations generated **during** reasoning (in-context
  retrieval).
- **Coarse retrieval:** Corpus ~10.5M tokens (627 docs) > context window; Gecko
  1B embeddings; index by title + **generated abstract**; Mx generates up to 5
  search queries; ~256k tokens (≈6 guidelines) retrieved.
- **Structured generation:** Decoding constraints (JSON schema) so that (1)
  reasoning trace and plan have fixed structure, (2) citations are from the set
  of retrieved doc IDs.
- **Ensemble refinement:** Four **draft** plans (without conditioning on
  retrieved docs, for speed); then one **refinement** step conditioned on full
  guideline text to merge into final plan.

### 4.3 Reasoning structure (decoding constraint)

1. **Analyze patient** — Symptoms, history, clinical picture.
2. **Set objectives** — High-level management goals.
3. **Plan and cite** — Action items with citation list (doc IDs).

Output: `in_visit_investigations`, `ordered_investigations`,
`recommendations_or_actions`, each as list of `{ item, citation[] }`.

### 4.4 Timing

- Single structured plan step: ~50 s (256k tokens), ~30 s without docs.
- Full Mx call (retrieval + 4 drafts + refinement): ~80 s.

---

## 5. Evaluation

### 5.1 Multi-visit OSCE

- **Setup:** 100 scenarios, 3 visits each; same patient actor for all 3 visits
  per scenario; each scenario done once with AMIE and once with a PCP
  (randomized, blinded).
- **Guidelines:** 627 guidelines (527 NICE, 100 BMJ); scenarios designed around
  NICE + BMJ; both AMIE and PCPs had access to the corpus.
- **Participants:** 21 PCPs, 21 patient actors, 10 specialist physicians (for
  rating).
- **Measures:** Management plan quality (15 axes), MXEKF rubric (10 axes),
  patient actor and specialist ratings.

### 5.2 Management plan quality (specialist physicians)

- AMIE **non-inferior** to PCPs on all 15 axes across visits.
- AMIE **more precise** on treatments and investigations (e.g. specific drug,
  dose, timing).
- AMIE **better** on selecting applicable guidelines (visit 1), and on
  alignment + explicit references to guidelines for treatments (all three
  visits).

### 5.3 MXEKF (Management Reasoning Empirical Key Features)

- When a preference was expressed, **AMIE preferred over PCPs** more often
  (median win rate ~42% vs ~8%); ~50% ties.
- Similar pattern for both specialist and patient-actor perspectives.

### 5.4 RxQA (medication reasoning)

- 600 MCQs from OpenFDA + BNF; pharmacist-revised; difficulty rated
  (Trivial/Easy vs Medium/Hard/Impossible).
- **Higher difficulty:** AMIE more accurate than PCPs in both closed-book and
  open-book.
- **Open-book** (access to labels/formularies) helped both; effect larger for
  lower-difficulty questions.

---

## 6. Limitations (from paper)

- **Actors, not real patients;** scenarios constructed with definitive answers.
- **Text-only** chat; real telehealth is often audio/video.
- **Short inter-visit interval** (1–2 days) in the study vs narrative time
  (weeks/months).
- **Guidelines from UK,** PCPs from India and North America.
- **No real order entry:** no EPOV, no drug formularies or pharmacist oversight
  in the loop.
- **MXEKF:** First step toward measuring management reasoning; reliability and
  psychometrics need more work.
- **RxQA:** Skewed toward questions where the model needed labels to answer; not
  necessarily representative of typical practice.

---

## 7. Relation to our project

- **Beauty Assistant** is not a clinical or diagnostic system; it is a
  wellness/shopping assistant.
- If we ever add **deeper, stateful wellness/skincare dialogue** or **multi-step
  “management” of a concern**, we can reuse:
  - **Dual-agent idea:** one fast conversational agent, one slower “reasoning”
    agent (e.g. over product/ingredient knowledge).
  - **State:** e.g. user summary, current “differential” (e.g. skin goals), and
    a “plan” (products/routines) produced by the reasoning agent.
  - **Structured output:** e.g. recommendations as structured items with
    “citations” to product or ingredient docs.
- **Safety:** For any health-adjacent use, the paper’s emphasis on **guideline
  grounding**, **precision**, and **oversight** (and their limitations section)
  is relevant.

---

## 8. References (key)

- Tu et al., _Towards conversational diagnostic AI_, arXiv:2401.05654 (2024) —
  diagnostic AMIE.
- Gemini 1.5 technical report (long context, capabilities).
- Cook et al., _Management reasoning: empirical determination of key features_,
  Acad Med (2023) — MXEKF basis.
- NICE Guidance; BMJ Best Practice; OpenFDA; BNF.

---

_This file is a condensed technical summary for implementation reference, not a
substitute for the full paper or medical/legal advice._
