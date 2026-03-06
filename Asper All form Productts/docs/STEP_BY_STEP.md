# Asper Beauty Shop — Step by Step

Do these in order. Each step ends with a **Done when** so you know you’re ready for the next.

---

## Step 1: Install tools on your computer

1. Install **Node.js** (LTS) from [nodejs.org](https://nodejs.org).  
   **Done when:** Open a new terminal and run `node -v` and `npm -v` — both show a version.

2. Install **Git** from [git-scm.com](https://git-scm.com).  
   **Done when:** `git --version` works.

3. Install **Supabase CLI:**`  
   **Done when:** `supabase --version` works.

---

## Step 2: Open the project and install dependencies

1. Open the project folder in Cursor (or your editor).

2. In the terminal (project root):
   ```powershell
   npm install
   ```
   **Done when:** No errors; `node_modules` exists.

3. Copy the env file:
   ```powershell
   copy .env.example .env
   ```
4. Open `.env` and leave placeholders for now (you’ll fill them in Step 4 and 5).

---

## Step 3: Create and connect Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project (or use an existing one).

2. In the project: **Settings → API**. Copy:
   - **Project URL**
   - **anon public** key  
   **Done when:** You have both saved somewhere safe.

3. In the project: **Settings → Edge Functions → Secrets**. You’ll add secrets in Step 5.

---

## Step 4: Run database migrations

1. In the project root, run:
   ```powershell
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Get **YOUR_PROJECT_REF** from the Supabase project URL: `https://XXXXX.supabase.co` → `XXXXX`.)

2. Apply migrations:
   ```powershell
   supabase db push
   ```
   **Done when:** Command finishes without errors. In Supabase: **Table Editor** shows tables (e.g. `profiles`, `concierge_profiles`, `chat_logs`).

---

## Step 5: Set Supabase secrets (Edge Functions)

1. In Supabase Dashboard: **Settings → Edge Functions → Secrets**.

2. Add (replace with your real values):

   | Secret name | Example value |
   |-------------|----------------|
   | `GEMINI_API_KEY` | From [aistudio.google.com](https://aistudio.google.com) |
   | `SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | From **Settings → API → service_role** (keep private) |
   | `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
   | `SHOPIFY_STOREFRONT_API_TOKEN` | Your Storefront API token from Shopify |

   **Done when:** All five are saved. Do **not** commit these; they stay in the dashboard.

---

## Step 6: Deploy Edge Functions

In the project root:

```powershell
supabase functions deploy beauty-assistant
supabase functions deploy generate-prescription
supabase functions deploy tray
supabase functions deploy get-products-by-concern
supabase functions deploy audit-24h
supabase functions deploy health-checks-ingest
```

**Done when:** Each command ends with “Deployed successfully.”  
Quick check: open in browser `https://YOUR_PROJECT_REF.supabase.co/functions/v1/beauty-assistant?health=true` — you should see `{"status":"active","version":"3.0"}`.

---

## Step 7: Fill in `.env` for the frontend

Edit `.env` in the project root. Set at least:

- `VITE_SUPABASE_URL` = your Supabase Project URL  
- `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key  
- `VITE_SUPABASE_PROJECT_ID` = your project ref (e.g. `qqceibvalkoytafynwoc`)  
- `VITE_TRAY_URL` = `https://YOUR_PROJECT_REF.supabase.co/functions/v1/tray`  
- `VITE_SHOPIFY_STORE_DOMAIN` = your Shopify store domain  
- `VITE_SHOPIFY_STOREFRONT_API_TOKEN` = your Storefront API token  
- `VITE_SHOPIFY_CHECKOUT_URL` = `https://your-store.myshopify.com/cart`  
- `VITE_APP_ENV` = `development` (or `production` when live)

**Done when:** All of the above are set (no placeholder values left for what you use).

---

## Step 8: Build and test locally

In the project root:

```powershell
npm run lint
npm test
npm run build
```

**Done when:** All three run without errors and `dist/` is created.

---

## Step 9: Push code and go live on Lovable

1. Commit and push to `main`:
   ```powershell
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. In **Lovable**, ensure the repo is connected and builds from `main`.  
   **Done when:** The site is live at the Lovable URL (e.g. `asperbeautyshop.lovable.app`).

3. In Lovable (or your host), set the **same env vars** as in `.env` (Step 7) so the live site can talk to Supabase and Shopify.  
   **Done when:** After redeploy, the live site loads products and the assistant works.

---

## Step 10: Custom domain (e.g. www.asperbeautyshop.com)

1. At your **domain registrar** (e.g. GoDaddy): add a **CNAME** for `www` (or your chosen subdomain) pointing to the **Lovable** host (e.g. `asperbeautyshop.lovable.app`).  
   See your host’s docs for the exact target.

2. In **Lovable**, add the custom domain and follow their verification steps.

3. **Do not** use Shopify’s “Change target” for the storefront.  
   See **docs/DOMAIN_AND_SHOPIFY.md** for details.

**Done when:** Visiting `https://www.asperbeautyshop.com` (or your domain) shows your site with a valid padlock.

---

## Step 11: Optional — Connect Gorgias / ManyChat

- **Gorgias:** Add webhook URL  
  `https://YOUR_PROJECT_REF.supabase.co/functions/v1/beauty-assistant?route=gorgias`  
  in Gorgias → Settings → Integrations → HTTP Integrations.

- **ManyChat:** Add webhook URL  
  `https://YOUR_PROJECT_REF.supabase.co/functions/v1/beauty-assistant?route=manychat`  
  in ManyChat webhook settings.

**Done when:** A test message from the channel gets a reply from the assistant.

---

## Quick reference

| Step | What |
|------|------|
| 1 | Install Node, Git, Supabase CLI |
| 2 | `npm install`, copy `.env.example` → `.env` |
| 3 | Create Supabase project, copy URL + anon key |
| 4 | `supabase link` + `supabase db push` |
| 5 | Set Edge Function secrets in Supabase Dashboard |
| 6 | Deploy all Edge Functions |
| 7 | Fill `.env` with Supabase + Shopify values |
| 8 | `npm run lint && npm test && npm run build` |
| 9 | Push to `main`, set env on Lovable, verify live site |
| 10 | Point domain (DNS) to Lovable; ignore Shopify “Change target” |
| 11 | (Optional) Gorgias / ManyChat webhooks |

**More detail:**  
- **docs/SETUP_COMPLETE.md** — Tools, connections, env list.  
- **docs/FINISH-AND-PUBLISH.md** — Publish and verify.  
- **docs/DOMAIN_AND_SHOPIFY.md** — Domain and Shopify for headless.

---

## Completion checklist

**Re-run this checklist when you change hosting, env, or Supabase** — it confirms nothing’s missing.

| # | Check | How to verify |
|---|-------|---------------|
| 1 | Tools installed (Node, Git, Supabase CLI) | `node -v`, `git --version`, `supabase --version` |
| 2 | Project runs locally | `npm install` and `npm run build` succeed |
| 3 | Supabase: migrations applied | Tables visible in Table Editor (e.g. `profiles`, `beauty_assistant_audit`) |
| 4 | Edge Function secrets set | GEMINI_API_KEY, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_TOKEN (or SHOPIFY_STOREFRONT_TOKEN), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| 5 | Edge Functions deployed | `GET .../functions/v1/beauty-assistant?health=true` returns `{"status":"active","version":"3.0"}` |
| 6 | `.env` and host env filled | VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SHOPIFY_*, etc. (see `.env.example`) |
| 7 | Site live on Lovable (or Vercel) | Site loads products; 3-Click flow works |
| 8 | Custom domain (if used) | DNS points to host; HTTPS padlock works |
| 9 | (Optional) Gorgias / ManyChat | Webhooks configured; test message gets reply |

**You’re complete when** the live site loads, products and cart work, and the Beauty Assistant responds to a test message.

---

## Run, monitor, iterate

After go-live, use this routine and the completion checklist above to confirm nothing’s missing.

### Run

- Keep the site and backend as-is unless you’re adding a feature or fixing a bug.
- Deploy changes via push to `main` (Lovable/Vercel) and/or `supabase functions deploy` when you update code.

### Monitor

| What | Where |
|------|--------|
| Orders | Shopify Admin → Orders |
| Chat / tickets | Gorgias (or your support tool) |
| Conversation log | Supabase → Table Editor → `chat_logs` |
| Assistant audits | Supabase → Table Editor → `beauty_assistant_audit` |
| Uptime | `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?health=true` |

### Iterate

**1. Products and tags (Shopify)**  
- **Where:** Shopify Admin → Products → edit product → Tags.  
- **What:** Add concern and step tags so the assistant and Digital Tray can match products.  
- **Reference:** `docs/SHOPIFY_TAGGING_PROTOCOL.md` — use `Concern_Acne`, `Concern_AntiAging`, `Concern_Dryness`, `Concern_Sensitivity`, and step tags like `Step_1_Cleanser`, `Step_2_Treatment`, `Step_3_Protect`.  
- **Why:** 3-Click and get-products-by-concern rely on these tags; new or updated SKUs need them to appear in the right flows.

**2. Gorgias / ManyChat**  
- **Gorgias:** Settings → Automations → Rules. Add or edit rules that tag tickets (e.g. Lead - Acne) and trigger macros; align macro copy with `docs/GORGIAS_AUTOMATION_RULES.md`.  
- **ManyChat:** Adjust flows and message blocks from real conversations (e.g. when users ask for a concern, send the right follow-up or product link).  
- **Webhooks:** Confirm the beauty-assistant URLs (`?route=gorgias`, `?route=manychat`) are still correct and that a test message gets a reply.

**3. Verify and health scripts**  
- **When:** After changing code, env, or Supabase; or weekly.  
- **Commands (from project root):**  
  - `.\scripts\setup-verify.ps1` — tools, `node_modules`, `.env`, lint/test/build, Edge Function URLs.  
  - `.\scripts\health-checks.ps1` — Git, npm checks, Supabase DB and Edge Functions.  
- **If something fails:** Fix the reported item (e.g. missing secret, broken build), then re-run until all checks pass.

### Confirm nothing’s missing

- **Re-run the Completion checklist (above) when you change hosting, env, or Supabase.**
- Fix any unchecked item before relying on that part of the system.
- Quick health check: `curl -s "https://YOUR_PROJECT_REF.supabase.co/functions/v1/beauty-assistant?health=true"` → expect `{"status":"active","version":"3.0","uptime":"ok"}`.
