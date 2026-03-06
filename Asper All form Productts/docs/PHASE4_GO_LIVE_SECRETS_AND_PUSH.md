# Phase 4: Go-Live — Secrets, Polish, and Push

This guide covers adding the AI credentials (repository secret), fixing the "22
not formatted files" and Datadog config, and pushing to trigger the pipeline so
the Digital Concierge can pass the Clinical Safety Check and deploy the Ivory &
Gold storefront.

---

## 1. How do I add a repository secret in GitHub Settings?

**Step-by-step (standard GitHub UI):**

1. **Open the repo**\
   In your browser, go to your **Asper Beauty Shop** repository (e.g.
   `github.com/asperpharma/Asper-Beauty-Shop` or your org/repo).

2. **Open Settings**\
   Click the **Settings** tab (gear icon) in the top navigation.

3. **Go to Actions secrets**\
   In the left sidebar, under **Security**, click **Secrets and variables** →
   **Actions**.

4. **Create the secret**
   - Click **New repository secret**.
   - **Name:** Use **`GEMINI_SA_JSON`** (this repo’s workflow expects this name;
     see note below if you prefer `GCP_SA_KEY`).
   - **Secret:** Paste the **entire** contents of your `service-account.json`
     file from Google Cloud (including the `{` and `}`).
   - Click **Add secret**.

**Why:** This stores the "key to the Brain" so the pipeline can authenticate
with Vertex AI and run the Automated Safety Check without putting credentials in
code.

**Secret name in this repo:** The **Gemini CI** workflow
(`.github/workflows/gemini.yml`) uses **`GEMINI_SA_JSON`**, not `GCP_SA_KEY`.
Add a secret named **`GEMINI_SA_JSON`** with the same JSON content as your GCP
service account key. If you add `GCP_SA_KEY` instead, the workflow would need to
be updated to read that name.

---

## 2. Where do I find the Vertex AI API in Google Cloud?

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Select the project used for Asper Beauty Shop (or create one).
3. In the top search bar, type **Vertex AI** and open **Vertex AI** (or use the
   ☰ menu → **Artificial Intelligence** → **Vertex AI**).
4. Enable the **Vertex AI API** for the project if prompted (e.g. **Enable
   API**).
5. **Service account for Vertex AI:**
   - Go to **IAM & Admin** → **Service Accounts**.
   - Create or select the service account (e.g. `asper-digital-concierge`).
   - Grant it a role such as **Vertex AI User** (or **Vertex AI Administrator**
     if needed).
   - Create a **JSON key** (Keys tab → Add key → Create new key → JSON) and
     download it; this is the file you paste into **GEMINI_SA_JSON** in GitHub.

---

## 3. What happens after the AI Concierge passes the health check?

- **In the pipeline:** The Gemini CI job (and any other jobs that depend on it)
  completes successfully. The workflow has run the credential check, formatting
  check (`deno fmt --check`), and the tray test suite.
- **Deployment:** Your **deployment host** (Vercel, Netlify, Lovable, etc.)
  builds and deploys when you push to `main`. The live site (Ivory & Gold
  storefront) is updated from that build.
- **In production:** The Digital Concierge (3-Click Solution, Pharmacist
  Persona) is available to users; the pipeline has verified that credentials and
  checks are in place so the "Centralised Brain" (Vertex AI) can be used safely.

---

## 4. Unblock deployment: polish code, fix config, push

Run these from your **project root** (where `package.json` and `.github` live).

### 4.1 Polish the code (fix “22 not formatted files”)

**If you have Deno installed:**

```bash
deno fmt
```

**Or format only Supabase/Deno code:**

```bash
deno fmt supabase/
```

**Alternative (Node/ESLint):** This repo also has `npm run format` (ESLint
--fix) for JS/TS outside `supabase/`:

```bash
npm run format
```

### 4.2 Fix the Datadog workflow (if it still uses `@v1`)

The file `.github/workflows/datadog-synthetics.yml` in this repo is already set
to **`DataDog/synthetics-ci-github-action@v0.1.0`**. If your branch still has
`@v1`:

- **Linux/macOS:**\
  `sed -i 's|DataDog/synthetics-ci-github-action@v1|DataDog/synthetics-ci-github-action@v0.1.0|g' .github/workflows/datadog-synthetics.yml`

- **Windows (PowerShell):** Open the file and replace `@v1` with `@v0.1.0` in
  the `uses:` line, or run a PowerShell replace command.

### 4.3 Push to live

```bash
git add .
git commit -m "feat: configure AI secrets and polish code"
git push origin main
```

If your current branch is not `main` (e.g.
`docs/deployment-flow-and-health-check`), either:

- Push that branch and open a PR into `main`, or
- Merge into `main` and push:

  ```bash
  git checkout main
  git merge docs/deployment-flow-and-health-check
  git push origin main
  ```

---

## 5. Deploy the Centralised Brain (beauty-assistant)

This step is **separate from frontend (Vercel) deployment**. It pushes the "Director" logic (Dr. Sami & Ms. Zain) to Supabase’s edge network. To transition from **Setup** to **Go-Live**, deploy the `beauty-assistant` Edge Function with the **hardcoded "Director" prompt**.

### Execution guide: deploy the Brain now

Run these in order from the **root of your project** (where `supabase/` and `package.json` live). Project ID `rgehleqcubtmcwyipyvi` is confirmed from your API settings.

**1. Set the Intelligence secret**

Securely link your Google Gemini API key to the remote Supabase environment:

```bash
npx supabase secrets set GEMINI_API_KEY="[YOUR_GEMINI_KEY]" --project-ref rgehleqcubtmcwyipyvi
```

**2. Deploy the "Director"**

Push the `beauty-assistant` Edge Function (Dr. Sami / Ms. Zain logic) to the edge network:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

This deploys the code in `supabase/functions/beauty-assistant/`, which contains the `systemPrompt` acting as the Director.

**3. "Heartbeat" verification (curl test)**

After the terminal shows **Deployed Function beauty-assistant**, verify that Ms. Zain activates for an aesthetic query. Replace `[YOUR_SUPABASE_ANON_KEY]`:

```bash
curl -i -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant \
  -H "Authorization: Bearer [YOUR_SUPABASE_ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"message":"I need a routine for acne"}'
```

*(The API also accepts `"query"` or `"content"` in place of `"message"`.)*

**Expected healthy response:** A JSON object where the content includes:

- **Persona:** "Ms. Zain, Your Beauty Concierge"
- **Content:** A curated skincare routine (e.g. Cleanser, Serum, Moisturizer)
- **Tone:** Warm, "Morning Spa" vocabulary

If you see that, the Director is routing correctly and the Brain is live.

**Strategic follow-up (Phase 4):** Once the Brain is live, add **`SHOPIFY_STOREFRONT_API_TOKEN`** to the same Edge Function secrets (via Dashboard or `npx supabase secrets set ...`). Your product feed’s "Inventory Quantity" fields are empty or undefined, so the AI cannot rely on static data for stock. The token closes the **inventory gap** and lets the Brain honour the rule: *"Always check inventory before recommending."*

---

### Why deploy with the hardcoded Director now?

1. **Speed to market:** The "Zero to Live" roadmap prioritizes getting the 3-Click Solution live. The hardcoded System Prompt from the [AI Protocol](BRAND_STRATEGY_MEDICAL_LUXURY.md) is already production-ready and sufficient to distinguish Dr. Sami and Ms. Zain.
2. **Sufficient logic:** The current Director script already contains the triggers (e.g. "pregnancy," "dosage" → Sami; "glow," "routine" → Zain). Moving these to a database table now would add unnecessary engineering (RLS, management UI) right before launch.
3. **Stability:** Hardcoded prompts in Edge Functions are immutable and faster than database lookups, so the "Analysis" phase of the 3-Click flow stays in milliseconds.

### Pre-deployment verification

Before running the deploy command, ensure both conditions are met to avoid errors:

1. **File existence:** Confirm that `supabase/functions/beauty-assistant/index.ts` exists and contains the "Director" system prompt (dual-persona instructions for Dr. Sami and Ms. Zain).
2. **Secrets configuration:** The function requires **`GEMINI_API_KEY`** (and optionally **`GEMINI_MODEL`**). Set them via the Supabase Dashboard or CLI so the function has access at runtime:
   - **Dashboard:** [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Edge Functions** → **beauty-assistant** → **Secrets** → add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
   - **CLI:** From project root, run:
     ```bash
     npx supabase secrets set GEMINI_API_KEY="your-api-key" --project-ref rgehleqcubtmcwyipyvi
     ```
   - **Strategic (add after go-live):** The Asper AI Protocol requires the Brain to *"Always check inventory before recommending."* To enable **Real-time Inventory Sync** (Launch Blueprint), add **`SHOPIFY_STOREFRONT_API_TOKEN`** to the same Edge Function secrets. You can deploy with only the Gemini key first; add the Shopify token when the function is updated to call the Storefront API so recommendations never suggest out-of-stock items.

### Immediate deployment command

Run this at the **root of your project** (where `supabase/` and `package.json` live):

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

- **Project ref:** `rgehleqcubtmcwyipyvi` (use your project’s **Project ID** from Supabase Dashboard → Project Settings → General if different).
- **Function:** This deploys the code in `supabase/functions/beauty-assistant/`.

When the terminal shows **Deployed Function beauty-assistant**, the Brain is live on the edge.

### How to verify success

1. **Dashboard:** Go to **Supabase Dashboard** → **Edge Functions**. You should see **beauty-assistant** listed with a green **Healthy** status.
2. **Curl test (definitive health check):** Validates that the function is reachable over the internet and that the **Supabase anon key** (RLS/auth) is accepted. Replace `YOUR_SUPABASE_ANON_KEY`:
   ```bash
   curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d "{\"message\": \"I need a routine for acne\"}"
   ```
   **Healthy response:** The response is JSON. The AI persona should introduce herself as **"Ms. Zain, Your Beauty Concierge"** and suggest a regimen (e.g. products or steps for the acne routine). If you see that, the Director is switching correctly and the Brain is live.

**Quick persona checks:**

- *"I need a routine for acne"* → should trigger **Ms. Zain** and recommendations.
- *"Is this safe for pregnancy?"* → should trigger **Dr. Sami** and the safety disclaimer.

---

## Summary

| Step | Action                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Add **GEMINI_SA_JSON** (or **GCP_SA_KEY** if you change the workflow) in GitHub → Settings → Secrets and variables → Actions.       |
| 2    | Use Google Cloud Console to enable Vertex AI and create/download the service account JSON.                                          |
| 3    | Run `deno fmt` (and/or `npm run format`), fix Datadog workflow if needed, then `git add .` → `git commit` → `git push origin main`. |
| 4    | Pipeline runs; after the health check passes, your host deploys the Ivory & Gold storefront.                                        |
| 5    | **Deploy the Brain:** Set `GEMINI_API_KEY` in Edge Function secrets, then run `npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi`. Verify in Dashboard (Healthy) and with the curl test above. |
