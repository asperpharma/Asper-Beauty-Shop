# Publish & Full Connection Checklist

Use this to publish the website, verify all connections, and ensure images/branding are properly represented. Includes Notebook LLM connection.

**→ Quick path:** See [PUBLISH_FINAL_STEPS.md](PUBLISH_FINAL_STEPS.md) for the minimal publish sequence.

---

## Quick status

| Check | Status |
|-------|--------|
| **Build** | ✅ Passes (`npm run build`) |
| **Hero assets** | ✅ `hero-banner.png`, `hero-video.mp4` in `public/` |
| **Supabase health** | Run: `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"` — expect 200 |
| **Beauty Assistant** | Run: `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"` — expect 200, `{"status":"active"}` |

---

## 1. Images & branding (properly representing)

### Hero & landing assets

| Asset | Path | Used by |
|-------|------|---------|
| Hero fallback image | `public/hero-banner.png` | HeroSection.tsx |
| Hero video | `public/hero-video.mp4` | HeroSection.tsx |
| Asper logo | `src/assets/asper-logo-new.jpg` | BrandStory |
| Favicon | `public/favicon.ico`, `public/favicon.png` | index.html |
| Placeholder | `public/placeholder.svg` | ProductDetail, etc. |

### Skin concerns images (in `src/assets/concerns/`)

- acne.jpg, anti-aging.jpg, brightening.jpg, dark-circles.jpg  
- hydration.jpg, sensitivity.jpg, sun-protection.jpg

### Brand DNA colors

| Element | Value |
|---------|-------|
| Background (Digital Tray) | Soft Ivory `#F8F8FF` |
| Primary (Pharmacist's Stamp) | Maroon `#800020` |
| Accent (Seal of Authenticity) | Shiny Gold `#C5A028` |
| Heading font | Playfair Display |
| Body font | Montserrat |

---

## 2. Full connection checklist

### Supabase

- [ ] **Health check 200:**  
  `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"`
- [ ] **Edge Function secrets:** `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ACCESS_TOKEN` (Bulk Upload)
- [ ] **Project:** rgehleqcubtmcwyipyvi

### Shopify (lovable-project-milns)

- [ ] **Store details:** Settings → Store details
- [ ] **Payments:** At least one active (Shopify Payments, PayPal, COD)
- [ ] **Shipping:** Zones + rates (e.g. 3 JOD, free over 50 JOD)
- [ ] **Products:** Imported and published
- [ ] **Plan:** Paid plan selected
- [ ] **Password:** Online Store → Preferences → OFF

### Environment variables

**Local (`.env`):**

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SHOPIFY_STORE_DOMAIN` = `lovable-project-milns.myshopify.com`
- [ ] `VITE_SHOPIFY_STOREFRONT_TOKEN`
- [ ] `VITE_SHOPIFY_API_VERSION` = `2025-07`

**Production (Lovable):** Same variables in project settings.

### GitHub → Lovable

- [ ] Repo connected: `asperpharma/Asper-Beauty-Shop`
- [ ] Sync from `main` branch
- [ ] PR merged to `main` for latest changes

### Domain

- [ ] CNAME `www` → `https-www-asperbeautyshop-com.lovable.app` (or use Lovable custom domain)
- [ ] SSL active (green padlock)

---

## 3. Publish steps (in order)

1. **Local verification**
   - `npm run build` ✅
   - `npm run dev` → test at http://localhost:8080

2. **Health checks**
   - Bulk-upload GET returns 200
   - Supabase project healthy

3. **Shopify pre-launch**
   - Complete store details, payments, shipping, products
   - Select plan, remove password

4. **Deploy**
   - Push to `main` (or merge PR)
   - Lovable auto-deploys

5. **Verify live**
   - Open https://https-www-asperbeautyshop-com.lovable.app
   - Homepage, products, cart, checkout, EN/AR

---

## 4. Notebook LLM connection

The **Notebook LLM** (`Asper All form Productts/notebooks/llm-asper.ipynb`) uses the same Gemini API as the **Asper Intelligence** page (`/intelligence`) and the **Beauty Assistant** (Supabase Edge Function).

### How they connect

| Component | Purpose | API key |
|-----------|---------|---------|
| **Notebook LLM** | Local product copy, catalog experiments | `GOOGLE_API_KEY` or `GEMINI_API_KEY` |
| **Asper Intelligence page** | Chat + TTS in browser | `VITE_GEMINI_API_KEY` (in .env) |
| **Beauty Assistant** | Concierge chatbot | Edge Function (server-side key) |

All use **Google Gemini** for text generation. The notebook is for **offline/editorial** work (product descriptions, catalog); the website uses live chat.

### Run the notebook

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts"
pip install jupyter google-generativeai pandas python-dotenv
$env:GOOGLE_API_KEY = "your-key"  # or use .env
jupyter notebook notebooks/llm-asper.ipynb
```

Or in Cursor: Open `Asper All form Productts/notebooks/llm-asper.ipynb` and run cells.

### Catalog alignment

- **Notebook:** Set `CATALOG_PATH` to your CSV (e.g. `Asper_Catalog_FINAL_READY.csv`)
- **Website:** Products come from **Shopify** (live catalog)
- Keep product naming consistent between notebook experiments and Shopify for best results.

**Full guide:** `Asper All form Productts/docs/NOTEBOOK-LLM-GUIDE.md`

---

## 5. Post-publish verification

- [ ] Homepage loads with hero video/image
- [ ] Brand Story section (maroon + gold) visible
- [ ] Featured products show from Shopify
- [ ] TrustBanner (3 advantages) visible
- [ ] Shop Collection button works
- [ ] Add to cart → Checkout works
- [ ] EN/AR toggle works
- [ ] /intelligence page works (if VITE_GEMINI_API_KEY set)

---

## Chatbot on social media

See **CHATBOT_SOCIAL_MEDIA_SETUP.md** for connecting the Beauty Assistant to Gorgias, ManyChat, Instagram, Messenger, and WhatsApp.

---

## Quick links

| Service | URL |
|---------|-----|
| Shopify Admin | https://admin.shopify.com/store/lovable-project-milns |
| Supabase | https://rgehleqcubtmcwyipyvi.supabase.co |
| Main site (Lovable live) | https://https-www-asperbeautyshop-com.lovable.app |
| Custom domain | https://www.asperbeautyshop.com |
| Notebook | `Asper All form Productts/notebooks/llm-asper.ipynb` |

---

*Last updated: Feb 2025*
