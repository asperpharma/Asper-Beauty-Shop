# Asper Beauty Shop

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Asper-Beauty-Shop/asperbeauty?quickstart=1)

Product catalog, storefront tooling, and deployment setup for **Asper Beauty
Shop** ([asperbeautyshop.com](https://www.asperbeautyshop.com)).

---

## First-time setup

- [ ] Clone the repo (or open in
      [GitHub Codespaces](https://codespaces.new/Asper-Beauty-Shop/asperbeauty?quickstart=1))
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env` and fill in Supabase + Shopify values
- [ ] Run `npm run dev` and open the local URL
- [ ] (Optional) Run `npm run server` to start the local demo server (port 3000)

---

## Quick start

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase and Shopify values (see
     [.env.example](.env.example)).\
     Never commit `.env`.

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview   # optional: preview the build
   ```

---

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Start Vite dev server                              |
| `npm run build`          | Production build (output: `dist/`)                 |
| `npm run preview`        | Preview production build locally                   |
| `npm run lint`           | Run ESLint                                         |
| `npm run format`         | Fix formatting (ESLint --fix)                      |
| `npm run format:deno`    | Format Supabase/Deno code (`deno fmt supabase/`)   |
| `npm run test`           | Run Vitest tests                                   |
| `npm run test:tray`      | Run tray health-check only (needs Supabase env)    |
| `npm run server`         | Start local HTTP server (port 3000, or set `PORT`) |
| `npm run gemini`         | Run Google Gemini CLI (npx)                        |
| `npm run gemini:init`    | Initialize Gemini configuration                    |
| `npm run gemini:auth`    | Authenticate with Gemini (browser or device code)  |
| `npm run gemini:run`     | Run the Gemini CLI command                         |
| `npm run gemini:version` | Check installed Gemini CLI version                 |

See [docs/GEMINI_CLI.md](docs/GEMINI_CLI.md) for auth and troubleshooting. For
CI usage and the GitHub Actions workflow (auto-selects GEMINI_SA_JSON or
GEMINI_API_KEY), see [docs/GEMINI_CLI.md](docs/GEMINI_CLI.md) and
[.github/workflows/gemini.yml](.github/workflows/gemini.yml).

**Gemini CLI — copy/paste snippet**

```bash
# Commands (from project root)
npm run gemini:init
npm run gemini:auth
npm run gemini:run
npm run gemini:version
```

**Environment variables** (optional; add to `.env` and do not commit):\
`GEMINI_API_KEY` — API key if the CLI uses it.\
`GOOGLE_APPLICATION_CREDENTIALS` — path to service account JSON if using GCP.

---

## Product catalog & images

- **Catalogs:** CSV/TSV files in the repo (e.g. in `Orgnized Products/`) are
  used for product data.
- **Image prompts:**
  [generate_all_product_images.py](generate_all_product_images.py) generates
  prompts for AI product images from the catalog. Run with Python; use the
  prompts with your chosen image tool.
- **Google Merchant feed:** Use your own script or tool to generate a feed from
  the TSV/CSV sources in `Orgnized Products/` if needed.

---

## Deployment

- **Deploy:** Push to `main`; Vercel, Netlify, or Lovable will build and deploy
  if the repo is connected.
- **Env in production:** Set the same variables as in `.env.example` in your
  host’s dashboard (Vercel/Netlify/Lovable → Environment variables).
- **Full steps:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — domain, CD,
  Hydrogen redirect theme, env vars, and troubleshooting.

---

## Repo structure

- **`.github/`** — CI workflow (`ci.yml`),
  [Copilot instructions](.github/copilot-instructions.md),
  [docs fix guide](.github/DOCS_FIX_GUIDE.md).
- **`server.mjs`** — Optional local HTTP server (`npm run server`).
- **`Orgnized Products/`** — Product data (CSV/TSV) for feed and image
  generation.
- **`.env.example`** — Required env var names; copy to `.env` and fill in.

---

## Links

### 📘 Brand & Strategy
*   [**Brand Strategy — Medical Luxury**](docs/BRAND_STRATEGY_MEDICAL_LUXURY.md): The definitive guide to our "Authentic Quality" pivot, defining the Ivory/Maroon/Gold palette, 3-Click UX flow, and the Dr. Sami/Ms. Zain AI personas.

### Other documentation
- [Deployment & domain guide](DEPLOYMENT_GUIDE.md)
- [Phase 4: Go-Live — Secrets, polish, and deploy the Brain](docs/PHASE4_GO_LIVE_SECRETS_AND_PUSH.md) (includes `supabase functions deploy beauty-assistant`)
- [Digital Concierge — GCP Service Account setup](docs/SERVICE_ACCOUNT_DIGITAL_CONCIERGE.md)
  (Phase 4: Intelligence)
- [Environment variables template](.env.example)
- [Docs fix guide](.github/DOCS_FIX_GUIDE.md)
