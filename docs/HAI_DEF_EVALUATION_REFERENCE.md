# HAI-DEF Evaluation & Benchmarks — Reference

**Source:** Health AI Developer Foundations (HAI-DEF) technical reports and
announcements.\
**Purpose:** Reference for how open-weight health AI models are evaluated (data
efficiency, benchmarks). Not for direct clinical use.\
**Relation to our project:** Background only; our chatbot is
**wellness/supplement/product-focused**, not clinical. See
[WELLNESS_CHATBOT_SCOPE.md](WELLNESS_CHATBOT_SCOPE.md).

---

## 1. Core benchmark strategy: data efficiency

HAI-DEF evaluates models on **data efficiency** and **generalization**, not only
raw accuracy.

- **Linear probing:** A simple classifier is trained on **frozen** model
  embeddings with varying amounts of labeled data (e.g. 1% to 100%).
- **Result:** Classifiers on HAI-DEF embeddings outperform generic embeddings
  (e.g. ImageNet) or training from scratch, especially in **low-data regimes**.
- **Value:** Developers can reach strong results with **less training data,
  shorter training, and lower compute**.

---

## 2. Model-specific evaluations

| Model / domain        | Benchmarks                                                | Key finding                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CXR (chest X-ray)** | ChestX-ray14, CheXpert; ELIXR-B vs CXR Foundation, ResNet | Better binary classification (e.g. pneumothorax, opacity) across data sizes; TB detection with 45 images non-inferior to radiologists.                                                                                         |
| **CT**                | 7 tasks (e.g. ICH, lung cancer, aortic aneurysm); NLST    | ROC AUC > 0.8 on 6/7 tasks (head, chest, abdomen).                                                                                                                                                                             |
| **Derm**              | SCIN (diverse skin images), US-Derm MCQA                  | 28 skin condition categories, up to 419 conditions; **fairness**: no significant difference across Fitzpatrick skin types.                                                                                                     |
| **Path**              | 11 histopathology tasks; TCGA                             | Tumor detection, grading (e.g. Gleason), tissue subtyping; linear probing ROC AUC > 0.8 on 10/11 tasks; better than ImageNet features.                                                                                         |
| **HeAR (acoustics)**  | COVID-19 from cough, TB detection                         | Robustness to **distribution shift** (e.g. unseen recording devices); outperformed CLAP, TRILL.                                                                                                                                |
| **MedGemma**          | MedQA (USMLE-style), VQA-RAD, SLAKE, MIMIC-CXR report gen | Text: MedGemma 27B ~87.7% MedQA, ~1/10 inference cost vs leading open models. VQA: MedGemma 4B > Gemma 3 4B on medical VQA. Reports: 81% of generated CXR reports judged sufficient for similar management (radiologist eval). |

---

## 3. Usage and safety (from sources)

- **Starting points only:** HAI-DEF models are meant as foundations; benchmark
  results do **not** guarantee safety in a specific real-world setting.
- **Validation required:** Rigorous validation on **local, problem-specific**
  populations is needed for efficacy and equity.
- **Not for direct clinical use:** Outputs are not intended to directly drive
  diagnosis or treatment without further adaptation and modification by
  developers.

---

## 4. Relevance to our wellness chatbot

Our assistant is **not** a clinical or imaging system. We use it for:

- **Wellness, supplements, vitamins, and product benefits** — not diagnosis or
  treatment.
- **Product and ingredient information** — aligned with our catalog and general
  health/supplement knowledge.

HAI-DEF references are kept for context (e.g. if we ever consider
domain-specific embeddings or data-efficient fine-tuning for non-clinical
tasks). Our scope is defined in
[WELLNESS_CHATBOT_SCOPE.md](WELLNESS_CHATBOT_SCOPE.md).
