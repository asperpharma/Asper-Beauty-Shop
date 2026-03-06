# 🚀 Next Steps - Deploy Your Site!

Your Asper Beauty Shop is **100% production-ready**. Follow these simple steps
to go live.

**Store launch focus:** Health checks → Shopify pre-launch (products, payments,
plan/password) → PR → DNS → verify → optional RLS/monitoring.

---

## Flow at a glance

1. **Run health checks 1–4 locally** (§ Run these health checks now).
2. **If step 3 returns 503:** Set **SHOPIFY_STORE_DOMAIN** and
   **SHOPIFY_ACCESS_TOKEN** in Supabase (see
   [docs/PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md) § 5 for exact
   steps); re-run step 3 until **200**.
3. **Shopify pre-launch** (optional): Products, payments, shipping, theme,
   plan/password — see [SHOPIFY_SETUP_CHECKLIST.md](SHOPIFY_SETUP_CHECKLIST.md)
   § Before you go live. For a focused list before deploying the new look:
   [docs/MASTER_LAUNCH_CHECKLIST.md](docs/MASTER_LAUNCH_CHECKLIST.md).
4. **Step 1: Create PR** → merge to `main` (auto-deploys).
5. **Step 2: DNS** → CNAME www → asperbeautyshop.lovable.app (optional).
6. **Step 3: Verify deployment** → test dev/production URLs and the test
   checklist.

---

## 🚦 Launch Day Protocol (DNA-First)

- **Run the Domain Pulse (Hour 0:00):** Verify the **Soft Ivory** (`#F8F8FF`)
  background—it must feel like a clean pharmacy countertop. Confirm the
  **Maroon** (`#800020`) "Pharmacist's Stamp" is visible on all primary buttons.
  Check the green SSL padlock.
- **The Concierge Stress Test:** Open the AI Concierge. Select "Acne &
  Blemishes." Verify it recommends the specific medical-grade routine (e.g.
  Vichy Normaderm / La Roche-Posay Effaclar).
- **The VIP "Velvet Rope" Invite (Phase 3):** Use the WhatsApp/Instagram
  templates in [docs/LAUNCH_DAY_PROTOCOL.md](docs/LAUNCH_DAY_PROTOCOL.md) to
  invite your first 5 testers. Ask them: _"Does the site feel like a Morning
  Spa?"_

---

## Store launch: what to prioritize

| Order | Focus                    | Action                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Deployment checklist** | Follow Flow at a glance above (health checks → fix 503 → Shopify pre-launch → PR → DNS → verify).                                                                                                                                                                                                                                                                                                                                                  |
| 2     | **RLS review**           | In Supabase: review policies on `cod_orders`, `user_roles`, and any tables used by the app; ensure anonymous insert only where intended (e.g. COD).                                                                                                                                                                                                                                                                                                |
| 3     | **Monitoring**           | Use GET health check (e.g. `curl` to bulk-product-upload URL); 200 = secrets OK. Optionally add uptime/alert on that URL.                                                                                                                                                                                                                                                                                                                          |
| 4     | **Test requests**        | Run GET health check and (with admin JWT) POST create-shopify-product from [docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md); confirm 200/201 or expected errors. See [docs/PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md) § 4 for commands and 503 troubleshooting; § 5 for adding secrets (checklist + Dashboard/CLI). Full commit/PR flow and curl examples: [docs/DEPLOY_COMMIT_AND_TEST.md](docs/DEPLOY_COMMIT_AND_TEST.md). |

---

## 📋 What we have to do now

**Main checklist:**
[docs/ADVANTAGES_AND_PLATFORMS.md](docs/ADVANTAGES_AND_PLATFORMS.md#what-we-have-to-do-now)

| Priority | Task                                                                 | Status |
| -------- | -------------------------------------------------------------------- | ------ |
| 1        | Merge PR to `main` (auto-deploys)                                    | [ ]    |
| 2        | (Optional) DNS: CNAME www → asperbeautyshop.lovable.app              | [ ]    |
| 3        | Verify site: homepage, advantages strip, 9 social links, cart, EN/AR | [ ]    |
| 4        | Submit sitemap (Google, Bing)                                        | [ ]    |
| 5        | (Optional) PageSpeed, Analytics                                      | [ ]    |

**Our advantages** (shown on Home — TrustBanner): Guaranteed Authentic ·
Pharmacist Verified · Amman Concierge Delivery.\
Single source: `src/lib/advantagesContent.ts` · Full list and platforms:
[docs/ADVANTAGES_AND_PLATFORMS.md](docs/ADVANTAGES_AND_PLATFORMS.md).

---

## ⚡ Run these health checks now (most important)

Do these first so deploy and secrets are in good shape.

| Order | What                                      | Command / Where                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Local build**                           | From repo root: `npm run build`                                                                                                                                                                                                                                                                                                                                                                                              |
| 2     | **Local lint**                            | `npm run lint`                                                                                                                                                                                                                                                                                                                                                                                                               |
| 3     | **Bulk-upload health** (Supabase secrets) | `Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"` (PowerShell) or `curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"` — **200** = secrets OK, **503** = set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN` in [Supabase → Edge Functions → Secrets](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi/settings/functions). |
| 4     | **Supabase project health**               | In [Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi): run **Logs** and **Advisors** (or your org’s get_logs / get_advisors) and fix any issues.                                                                                                                                                                                                                                              |
| 5     | **Connection script** (optional)          | From repo root: `./verify-connections.sh` (Git Bash / WSL). Expect “All checks passed.”                                                                                                                                                                                                                                                                                                                                      |

If step 1 or 2 fails, fix the build or lint before merging.

**If step 3 returns 503:** Set **SHOPIFY_STORE_DOMAIN** and
**SHOPIFY_ACCESS_TOKEN** in Supabase (see
[docs/PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md) § 5 for checklist +
Dashboard/CLI steps, or [SHOPIFY_SETUP_CHECKLIST.md](SHOPIFY_SETUP_CHECKLIST.md)
§ Step 3). Re-run step 3 until you get **200**.

**Step 4** is manual: open the
[Supabase Dashboard](https://supabase.com/dashboard/project/rgehleqcubtmcwyipyvi),
check **Logs** and **Advisors**, and fix any issues.

**After steps 1–4 pass**, continue with the rest of NEXT_STEPS below:

- **Shopify pre-launch** (optional): Products, payments, shipping, theme,
  plan/password — [SHOPIFY_SETUP_CHECKLIST.md](SHOPIFY_SETUP_CHECKLIST.md) §
  Before you go live
- **Step 1: Create PR** → merge to `main` (auto-deploys)
- **Step 2: DNS** → CNAME www → asperbeautyshop.lovable.app (optional, for
  custom domain)
- **Step 3: Verify deployment** → test dev and production URLs, run test
  checklist

---

## Step 1: Create Pull Request ⚡

**Visit**: https://github.com/asperpharma/Asper-Beauty-Shop/pull/new/new-branch

1. Click "Create Pull Request"
2. Review the 27 files changed
3. Add description (or use default commit message)
4. Click "Create Pull Request"
5. Click "Merge Pull Request"
6. Click "Confirm Merge"

**That's it!** Lovable automatically deploys when you merge to `main`.

---

## Step 2: Configure DNS (One-Time) 🌐

**Only needed for www.asperbeautyshop.com custom domain.**

Go to your domain registrar (GoDaddy, Namecheap, etc.):

```
Record Type: CNAME
Name: www
Value: asperbeautyshop.lovable.app
TTL: 3600
```

**DNS propagation**: 5 minutes to 48 hours (usually within 1 hour)

---

## Step 3: Verify Deployment ✅

**Check these URLs:**

1. **Development**: https://asperbeautyshop.lovable.app
   - Should be live immediately after merge
   - Updated automatically on every push to `main`

2. **Production** (after DNS): https://www.asperbeautyshop.com
   - Live once DNS propagates
   - Redirects from non-www automatically

**Test checklist:**

- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Shopping cart works
- [ ] Checkout redirects to Shopify
- [ ] Social media icons visible
- [ ] All 9 social links work
- [ ] Arabic/English language switch works
- [ ] Mobile responsive

---

## What Happens After Merge? 🔄

1. **GitHub**: Detects push to `main` branch
2. **Lovable**: Receives webhook notification
3. **Build**: Lovable runs `npm run build`
4. **Deploy**: Uploads to `asperbeautyshop.lovable.app`
5. **Live**: Your site is accessible within 2-3 minutes

---

## Monitoring Your Site 📊

**Lovable Dashboard**: Check deployment status and logs

**Run verification locally:**

```bash
./verify-connections.sh
```

Expected: 48/48 checks passed

**Test build locally:**

```bash
npm run build
npm run preview
```

Then open http://localhost:4173

---

## Post-Deployment Tasks 📝

### Search Engine Optimization

- [ ] Submit sitemap to
      [Google Search Console](https://search.google.com/search-console)
  - URL: https://www.asperbeautyshop.com/sitemap.xml
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)
  - URL: https://www.asperbeautyshop.com/sitemap.xml

### Social Media Verification

- [ ] Test all 9 social media links:
  - Instagram: @asper.beauty.shop
  - Facebook: asper.beauty.shop
  - TikTok: @asper.beauty.shop
  - WhatsApp: +962 79 065 6666
  - X/Twitter: @asperbeautyshop
  - YouTube: @asperbeautyshop
  - LinkedIn: company/asper-beauty-shop
  - Snapchat: @asperbeautyshop
  - Pinterest: asperbeautyshop

### E-commerce Testing

- [ ] Add product to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Test checkout flow (redirects to Shopify)
- [ ] Test wishlist functionality
- [ ] Verify product images load
- [ ] Test product search
- [ ] Test collection filters

### Performance Monitoring

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Check [Core Web Vitals](https://web.dev/vitals/)
- [ ] Monitor with [Google Analytics](https://analytics.google.com) (optional)

---

## Quick Reference 📚

### Documentation Files

| File                                                                 | Purpose                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| [README.md](README.md)                                               | Quick start guide                                         |
| [docs/ADVANTAGES_AND_PLATFORMS.md](docs/ADVANTAGES_AND_PLATFORMS.md) | **Our advantages, all platforms, what we have to do now** |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)                           | Detailed deployment instructions                          |
| [CONNECTION_STATUS.md](CONNECTION_STATUS.md)                         | Integration verification                                  |
| [SOCIAL_MEDIA_INTEGRATION.md](SOCIAL_MEDIA_INTEGRATION.md)           | Social media platform documentation                       |
| [FINAL_SUMMARY.md](FINAL_SUMMARY.md)                                 | Complete project status                                   |
| [.github/copilot-instructions.md](.github/copilot-instructions.md)   | AI agent guide                                            |

### Environment Variables

All configured in:

- `.env` (development)
- `.env.production` (production)
- `lovable.config.json` (Lovable platform)

### Integrations

- **Shopify**: lovable-project-milns.myshopify.com (API v2025-07)
- **Supabase**: rgehleqcubtmcwyipyvi.supabase.co
- **AI Gateway**: ai.gateway.lovable.dev (Gemini 2.5 Flash)
- **Lovable**: asperbeautyshop.lovable.app

---

## Support & Contact 💬

**Email**: asperpharma@gmail.com\
**Phone**: +962 79 065 6666\
**Location**: Amman, Jordan

**Social Media**:

- Instagram: [@asper.beauty.shop](https://www.instagram.com/asper.beauty.shop/)
- WhatsApp: [+962 79 065 6666](https://wa.me/962790656666)

---

## Troubleshooting 🔧

### Issue: Site not deploying after merge

**Solution**: Check Lovable dashboard for build logs

### Issue: DNS not resolving

**Solution**:

- Verify CNAME record: `dig www.asperbeautyshop.com`
- Wait up to 48 hours for propagation
- Use https://dnschecker.org to check status

### Issue: 404 on page refresh

**Solution**: Already fixed with `public/_redirects` (SPA routing)

### Issue: Build errors

**Solution**: Run locally:

```bash
npm run build
```

Check console output for errors

---

## 🎯 You're All Set!

Your Asper Beauty Shop has:

- ✅ 9 social media platforms integrated
- ✅ Shopify e-commerce connected
- ✅ Lovable platform configured
- ✅ Custom domain ready (after DNS)
- ✅ PWA & SEO optimized
- ✅ Bilingual support (EN/AR)
- ✅ AI Beauty Assistant
- ✅ All documentation complete

**Just merge your pull request and you're live!** 🚀

---

_Built with ❤️ by Asper Pharma_\
_Powered by [Lovable Platform](https://lovable.dev)_
