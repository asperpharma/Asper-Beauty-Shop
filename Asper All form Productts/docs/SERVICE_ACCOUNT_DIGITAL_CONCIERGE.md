# Digital Concierge — Service Account Setup (Phase 4: Intelligence & Go-Live)

This document covers creating the **"Brain's" identity** (GCP Service Account)
and connecting it to the Asper CLI and Gemini so the Digital Concierge can
authenticate with Google (Vertex AI / Gemini).

---

## Step 1: Create the Service Account (GCP Console)

_These steps are performed in Google Cloud Console. Verify in the
[GCP documentation](https://cloud.google.com/iam/docs/service-accounts) if your
console layout differs._

1. **Open Google Cloud Console**\
   Go to [console.cloud.google.com](https://console.cloud.google.com).

2. **Select project**\
   Choose the project associated with **Asper Beauty Shop**.

3. **Open Service Accounts**\
   Go to **IAM & Admin** → **Service Accounts**.

4. **Create Service Account**
   - Click **+ CREATE SERVICE ACCOUNT**.
   - **Name:** `asper-digital-concierge`
   - **Description:** `AI Brain for Asper Beauty Shop 3-Click Solution.`
   - **Grant access:** Assign role **Vertex AI User** (or **Gemini User** if
     available in your region).
   - Create/save.

5. **Create JSON key**
   - Open the new service account (click its email).
   - Go to the **KEYS** tab.
   - **ADD KEY** → **Create new key** → **JSON**.
   - Download the `.json` file and store it securely. **Do not lose it.**

---

## Step 2: Connect to the Asper CLI (project)

1. **Place the key in the project**\
   Move the downloaded JSON into your project root and rename it, for example:
   - `service-account.json`

2. **Keep it out of Git**\
   The repo already ignores:
   - `service-account.json`
   - `*-service-account*.json`\
     (See `.gitignore`.) **Never commit this file.**

3. **Set the environment variable**

   **Windows (PowerShell):**
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = (Resolve-Path "./service-account.json").Path
   ```

   Or for the current session only:
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "./service-account.json"
   ```

   **macOS / Linux (bash):**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"
   ```

4. **Authenticate the Gemini CLI**\
   From the project root:
   ```bash
   npm run gemini:auth
   ```
   Use the auth method the CLI prompts for (browser, device code, or key path).
   With `GOOGLE_APPLICATION_CREDENTIALS` set, the CLI can use the service
   account.

5. **Run the CLI**
   ```bash
   npm run gemini:run
   # or
   npm run gemini
   ```

---

## CI / Edge Functions

- **GitHub Actions:** Store the JSON content in a repository secret (e.g.
  `GEMINI_SA_JSON`) and write it to a file in the job, then set
  `GOOGLE_APPLICATION_CREDENTIALS`. See [docs/GEMINI_CLI.md](GEMINI_CLI.md) → CI
  (GitHub Actions).
- **Supabase Edge Functions:** Use Supabase secrets or pass the key via env per
  your deployment docs; never commit the JSON.

---

## Reminder: Deployment hygiene

Before or while enabling the Intelligence phase:

- **Format:** Run `npm run format` (ESLint --fix). For Supabase/Deno code, run
  `npm run format:deno` if Deno is installed (`deno fmt supabase/`).
- **Datadog workflow:** `.github/workflows/datadog-synthetics.yml` uses a pinned
  action tag; if the job fails with "action not found", update the tag to a
  valid
  [DataDog/synthetics-ci-github-action](https://github.com/DataDog/synthetics-ci-github-action)
  release.
