# Finish Your Job & Publish the Website

Use this checklist to get the site live and functioning. Do the steps in order.

---

## Phase 1: Before you push (today)

### 1. Build passes
You already have this. From project root:
```bash
npm run build
```
- **Done when:** `dist/` folder is created with no errors.

### 2. Commit and push to `main`
- Stage your changes: `git add .`
- Commit: `git commit -m "Ready for production"`
- Push: `git push origin main`  
  (If your branch is not `main`, create a Pull Request and merge to `main`.)

### 3. Supabase secrets (so backend works)
If the site uses **Supabase Edge Functions** (e.g. beauty assistant, bulk upload):

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Settings** → **Edge Functions** → **Secrets** (or **Project Settings** → **Edge Functions**).
3. Add:
   - `SHOPIFY_STORE_DOMAIN` = your store (e.g. `your-store.myshopify.com`)
   - `SHOPIFY_ACCESS_TOKEN` or `SHOPIFY_STOREFRONT_TOKEN` = your Shopify token  
   (Exact names depend on your functions; see your Supabase docs or PRE_LAUNCH_CHECKLIST.)
4. Test: open  
   `https://YOUR_PROJECT_REF.supabase.co/functions/v1/bulk-product-upload`  
   in a browser or with `curl`. **200** = OK; **503** = add/fix secrets.

### 4. Environment variables for the frontend (Netlify / Vercel / Lovable)
Wherever the site is hosted (Netlify, Vercel, Lovable, etc.):

- Set **build** env vars the app needs at build time (see `.env.example`), e.g.:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY` as fallback)
  - `VITE_TRAY_URL` (optional; defaults to `VITE_SUPABASE_URL/functions/v1/tray`)
  - `VITE_SHOPIFY_STORE_DOMAIN`
  - `VITE_SHOPIFY_STOREFRONT_API_TOKEN`
  - `VITE_SHOPIFY_CHECKOUT_URL`
- Redeploy after saving (e.g. “Trigger deploy” or push again).

---

## Phase 2: Deploy (automatic after push)

### 5. How your site deploys
- **Netlify:** Push to `main` → Netlify builds (`npm run build`) and publishes `dist/`.  
  Site URL: your Netlify URL (e.g. `something.netlify.app`) or your custom domain.
- **Lovable:** Push/merge to `main` → Lovable deploys.  
  Site URL: e.g. `asperbeautyshop.lovable.app` or your custom domain.
- **Vercel / other:** Same idea: connect repo to `main`, build = `npm run build`, output = `dist`.

After step 2 (push to `main`), wait for the build to finish (green in dashboard). Your **website is live** at the URL the host gives you.

---

## Phase 3: Custom domain (www.asperbeautyshop.com)

### 6. Point domain to the live site
To have **www.asperbeautyshop.com** show your site:

1. In your **domain registrar** (GoDaddy, Namecheap, etc.), add:
   - **Type:** CNAME  
   - **Name:** www  
   - **Value:** the host’s URL (e.g. `asperbeautyshop.lovable.app` or `your-site.netlify.app`)  
   - **TTL:** 3600
2. In **Netlify/Lovable/Vercel**, add the domain `www.asperbeautyshop.com` and follow their “Custom domain” steps (they may ask for the CNAME above).
3. Wait for DNS (minutes to a few hours). Then open `https://www.asperbeautyshop.com` — it should load your site with HTTPS.

---

## Phase 4: Verify the site works

### 7. Functionality checklist
Open your live URL and confirm:

| Check | What to do | Pass? |
|-------|------------|--------|
| **Design** | Background is Soft Ivory (#F8F8FF); primary buttons are maroon. | ☐ |
| **Products** | Product grid loads; you can open a product page. | ☐ |
| **Cart** | Add a product (e.g. Vichy Mineral 89) to cart; cart opens. | ☐ |
| **AI Concierge** | Open the chatbot; choose “Acne” or “Dry skin”; it responds with recommendations. | ☐ |
| **Language** | EN/AR (or your language) switch works. | ☐ |
| **HTTPS** | Browser shows padlock (SSL). | ☐ |

If something fails:
- **Cart/checkout:** Check Shopify store domain and Storefront API token in env vars and Supabase (if used).
- **AI not answering:** Check Supabase Edge Function (beauty-assistant) and its API key / secrets.
- **Blank or wrong design:** Confirm build used the right env and that you’re on the latest deploy.

---

## Quick summary

1. **Build** → **Commit & push to `main`** → host deploys.  
2. **Set Supabase + host env vars** so backend and frontend work.  
3. **DNS:** CNAME `www` → your host URL so **www.asperbeautyshop.com** works.  
4. **Verify:** Soft Ivory, cart, AI, language, HTTPS.

When all four are done, the job is finished and the website is published and functioning.

**For more detail:** **docs/NEXT_STEPS.md** (checklist order; the skill uses this for "Prepare for deployment"), **docs/DEPLOYMENT_GUIDE.md** (dist/ robots.txt and sitemap rules), **docs/HEALTH-CHECK-PROTOCOL.md** (live health checks), **docs/CONNECTION_STATUS.md** (when you add it; repo root or parent). If **docs/NEXT_STEPS.md** or **docs/DEPLOYMENT_GUIDE.md** is missing, the skill still runs using the steps and template in **SKILL.md** (`.cursor/skills/asper-beauty-pre-launch`).
