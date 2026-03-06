# Asper Beauty Shop — Complete Setup Guide

Download all tools, configure connections, and verify everything works.

---

## 1. Tools to Download & Install

| Tool | Purpose | Download / Install |
|------|---------|-------------------|
| **Node.js** (LTS) | npm, build, dev server | [nodejs.org](https://nodejs.org) — includes npm |
| **Git** | Version control | [git-scm.com](https://git-scm.com) |
| **Supabase CLI** | Deploy migrations & Edge Functions | `npm install -g supabase` |
| **VS Code / Cursor** | Editor | [cursor.com](https://cursor.com) or [code.visualstudio.com](https://code.visualstudio.com) |

### Install Commands (run in terminal)

```powershell
# 1. Node.js — download from nodejs.org and run installer
#    Verify: node -v  and  npm -v

# 2. Git — download from git-scm.com
#    Verify: git --version

# 3. Supabase CLI
npm install -g supabase
supabase --version
```

---

## 2. Project Setup

```powershell
# Clone or open project
cd "C:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts"

# Install dependencies
npm install

# Copy env template
copy .env.example .env
# Edit .env with your real values (see Section 4)
```

---

## 3. Connections & Integrations

### 3.1 Supabase

| Step | Action |
|------|--------|
| 1 | Create project at [supabase.com/dashboard](https://supabase.com/dashboard) |
| 2 | Get **Project URL** and **anon key** from Settings → API |
| 3 | Run migrations: `supabase db push` (or run SQL in SQL Editor) |
| 4 | Deploy Edge Functions: see Section 5 |
| 5 | Add secrets: Settings → Edge Functions → Secrets |

### 3.2 Shopify

| Step | Action |
|------|--------|
| 1 | Admin → Settings → Apps and sales channels → Develop apps |
| 2 | Create app → Configure Storefront API scopes (read products, etc.) |
| 3 | Install app → Copy **Storefront API access token** |
| 4 | Store domain: `your-store.myshopify.com` |

### 3.3 Gorgias (Chat / Instagram)

| Step | Action |
|------|--------|
| 1 | [gorgias.com](https://gorgias.com) — connect Shopify, Instagram |
| 2 | Settings → Integrations → HTTP Integrations |
| 3 | Add webhook: `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| 4 | Trigger: New message / Ticket created (as needed) |

### 3.4 ManyChat (WhatsApp)

| Step | Action |
|------|--------|
| 1 | [manychat.com](https://manychat.com) — connect WhatsApp |
| 2 | Webhook settings |
| 3 | Add webhook: `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=manychat` |
| 4 | Select events: `message_sent`, etc. |

### 3.5 Google Gemini (AI Brain)

| Step | Action |
|------|--------|
| 1 | [aistudio.google.com](https://aistudio.google.com) — create API key |
| 2 | Add to Supabase: Edge Functions → beauty-assistant → Secrets → `GEMINI_API_KEY` |
| 3 | Optional: `GEMINI_MODEL` = `gemini-2.0-flash` (default) |

---

## 4. Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Where to get it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API → anon public key |
| `VITE_SUPABASE_PROJECT_ID` | From URL: `https://PROJECT_ID.supabase.co` |
| `VITE_TRAY_URL` | `https://PROJECT_ID.supabase.co/functions/v1/tray` |
| `VITE_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_API_TOKEN` | Shopify app → Storefront API token |
| `VITE_SHOPIFY_CHECKOUT_URL` | `https://your-store.myshopify.com/cart` |
| `VITE_APP_ENV` | `development` or `production` |

---

## 5. Supabase Edge Functions (Deploy All)

```powershell
# Login (first time)
supabase login

# Link project (if not linked)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy beauty-assistant
supabase functions deploy generate-prescription
supabase functions deploy tray
supabase functions deploy get-products-by-concern
supabase functions deploy audit-24h
supabase functions deploy health-checks-ingest
supabase functions deploy shopify-discovery
```

### Secrets for Edge Functions (Supabase Dashboard)

| Secret | Used by |
|--------|---------|
| `GEMINI_API_KEY` | beauty-assistant |
| `GEMINI_MODEL` | beauty-assistant (optional, default: gemini-2.0-flash) |
| `SHOPIFY_STORE_DOMAIN` | shopify-discovery, get-products-by-concern |
| `SHOPIFY_STOREFRONT_TOKEN` | shopify-discovery, get-products-by-concern |

---

## 6. Verification Checklist

Run these to confirm setup is correct:

| Check | Command / Action |
|-------|------------------|
| Node & npm | `node -v` and `npm -v` |
| Dependencies | `npm install` (no errors) |
| Lint | `npm run lint` |
| Tests | `npm test` |
| Build | `npm run build` |
| Full check | `npm run check` |
| Health script | `.\scripts\health-checks.ps1` |
| generate-prescription | `curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/generate-prescription" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ANON_KEY" -d "{\"skin_concern\":\"Acne & Blemishes\"}"` |
| beauty-assistant | `curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ANON_KEY" -d "{\"message\":\"Do you have Vitamin C serum?\"}"` |

---

## 7. Quick Reference — Webhook URLs

| Platform | Webhook URL |
|----------|-------------|
| Gorgias | `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=gorgias` |
| ManyChat | `https://YOUR_PROJECT.supabase.co/functions/v1/beauty-assistant?route=manychat` |

---

## 8. Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm` not found | Install Node.js from nodejs.org; restart terminal |
| `supabase` not found | Run `npm install -g supabase`; ensure npm global bin is in PATH |
| Edge Function 503 | Add required secrets in Supabase Dashboard |
| Build fails | Run `npm install`; check `npm run lint` for errors |
| CORS errors | Edge Functions include CORS headers; check request method (POST) |

---

## 9. Run Verification

From project root (PowerShell):

```powershell
.\scripts\setup-verify.ps1   # Full setup check: tools, build, Edge Functions
.\scripts\health-checks.ps1  # Deployment health: Git, npm, Supabase
```

---

**Related docs:** `FINISH-AND-PUBLISH.md`, `ENV_VALIDATION.md`, `BEAUTY_ASSISTANT_WEBHOOKS.md`, `GENERATE_PRESCRIPTION_API.md`
