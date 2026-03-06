# 🌟 Asper Beauty Shop

> **Premium Beauty E-commerce Platform** - Luxury skincare and beauty essentials
> for the modern customer

🔗 **Live**: [Main site (Lovable)](https://https-www-asperbeautyshop-com.lovable.app)\
🔗 **Custom domain**: [www.asperbeautyshop.com](https://www.asperbeautyshop.com)

**Publish:** → [PUBLISH_FINAL_STEPS.md](PUBLISH_FINAL_STEPS.md) | Full checklist → [PUBLISH_AND_CONNECT_CHECKLIST.md](PUBLISH_AND_CONNECT_CHECKLIST.md) | [NEXT_STEPS.md](NEXT_STEPS.md) (flow, health checks, PR, DNS, verify). Main checklist & advantages →
[docs/ADVANTAGES_AND_PLATFORMS.md](docs/ADVANTAGES_AND_PLATFORMS.md).

---

## 🚀 Quick Start

```bash
npm install          # Install dependencies
npm run dev         # Start dev server (localhost:8080)
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Deployment

Deployment flow: health checks → fix 503 (set Supabase Edge Function secrets) →
Shopify pre-launch → PR → DNS → verify. See [NEXT_STEPS.md](NEXT_STEPS.md) and
[SHOPIFY_SETUP_CHECKLIST.md](SHOPIFY_SETUP_CHECKLIST.md). Commit message, PR
flow, and curl checklist:
[docs/DEPLOY_COMMIT_AND_TEST.md](docs/DEPLOY_COMMIT_AND_TEST.md).

**Bulk product upload (Edge Function)** — filled in for this project. Replace
`{{AUTH_HEADER}}` with your admin JWT or use the `$ADMIN_TOKEN` env-var pattern.

GET (health check, no auth):

```bash
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"
```

200 = secrets OK; 503 = set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in
Supabase → Edge Functions → Secrets.

POST (admin JWT required):

```bash
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer {{AUTH_HEADER}}" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

Or with env var:

```bash
export ADMIN_TOKEN="your-admin-jwt-here"
curl -X POST "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"create-shopify-product","product":{"title":"Test","price":"0.00","sku":"test","body":"","vendor":"","product_type":"","tags":""}}'
```

More: [docs/DEPLOYMENT_TEMPLATE.md](docs/DEPLOYMENT_TEMPLATE.md).

---

## ✨ Features

- 🛍️ **Shopify Integration** - Full e-commerce with checkout
- 🌐 **Bilingual** - English & Arabic (RTL support)
- 🤖 **AI Beauty Assistant** - Powered by Gemini 2.5 Flash
- 📱 **9 Social Platforms** - Instagram, Facebook, TikTok, WhatsApp, X, YouTube,
  LinkedIn, Snapchat, Pinterest
- 🎨 **Luxury Design** - Responsive, animated, PWA-ready
- 💾 **Smart Cart** - Persistent shopping with Zustand

**Our advantages** (why shop with us): **Guaranteed Authentic** · **Pharmacist
Verified** · **Amman Concierge Delivery** — shown on the home page and defined
in `src/lib/advantagesContent.ts`. Full list and “what we have to do” checklist:
[docs/ADVANTAGES_AND_PLATFORMS.md](docs/ADVANTAGES_AND_PLATFORMS.md).

---

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui\
**State**: Zustand, React Router v6\
**Backend**: Supabase (auth, serverless functions)\
**E-commerce**: Shopify Storefront API v2025-07\
**Deployment**: Lovable Platform

---

## 📁 Project Structure

```
src/
├── components/     # UI components (Header, Footer, ProductCard, etc.)
│   └── ui/        # shadcn/ui primitives
├── pages/         # Routes (Index, ProductDetail, Collections, etc.)
├── stores/        # Zustand (cart, wishlist)
├── contexts/      # Language context (EN/AR)
├── lib/           # Utils (shopify, categoryMapping, productUtils)
└── assets/        # Images

supabase/functions/  # Serverless (beauty-assistant, bulk-upload)
public/             # Static (sitemap, robots, manifest, redirects)
```

---

## 🔗 Integrations

### Shopify

- Store: lovable-project-milns.myshopify.com
- API: v2025-07 | Read-only public token

### Supabase

- Project: rgehleqcubtmcwyipyvi
- Functions: Beauty assistant AI, bulk upload

### Lovable

- Hot reload with component tagger
- Main: https://https-www-asperbeautyshop-com.lovable.app

### Monitoring & ops (Desktop)

- **RUNBOOK.md** — Entry point: daily monitoring, Gorgias channels, health URLs, chatbot.
- **monitor-checklist.md** — Quick checklist (Shopify, Gorgias, health, chatbot).
- **GORGIAS_OMNICHANNEL.md** — Chat, Email, SMS, AI Agent, website widget.
- **CHATBOT_SOCIAL_MEDIA_SETUP.md** — Beauty Assistant webhooks (Gorgias, ManyChat).

---

## 🎨 Design Tokens

| Token             | Value     | Usage      |
| ----------------- | --------- | ---------- |
| `--maroon`        | `#800020` | Primary    |
| `--soft-ivory`    | `#F8F8FF` | Background |
| `--shiny-gold`    | `#C5A028` | Accent     |
| `--dark-charcoal` | `#333333` | Text       |

**Fonts**: Playfair Display (headings), Montserrat (body), Tajawal (Arabic)

---

## 📱 Key Routes

| Route                | Description                              |
| -------------------- | ---------------------------------------- |
| `/`                  | Home with hero & featured products       |
| `/product/:handle`   | Product details                          |
| `/collections/:slug` | Collections (skin-care, hair-care, etc.) |
| `/brands`            | All brands                               |
| `/contact`           | Contact & social links                   |
| `/wishlist`          | Saved products                           |
| `/admin/*`           | Admin tools (protected)                  |

---

## 🔐 Environment

Create `.env` and `.env.production` (see `.env.example` for all keys):

```env
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
VITE_SITE_URL=https://https-www-asperbeautyshop-com.lovable.app

# Shopify (cart + Pay with Card checkout) — see SHOPIFY_CONNECT.md
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=<storefront-api-token>
```

---

## 📚 Documentation

- [**Publish final steps**](PUBLISH_FINAL_STEPS.md) - Finish and publish all updates
- [**Operations Master**](docs/OPERATIONS_MASTER.md) - Quick links, health checks, checklists
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - DNS & domain setup
- [Connection Status](CONNECTION_STATUS.md) - Integration verification
- [**Connect to Shopify**](SHOPIFY_CONNECT.md) - Env vars for cart + Pay with Card checkout
- [Shopify setup checklist](SHOPIFY_SETUP_CHECKLIST.md) - Full Shopify setup,
  your own store, Edge Function secrets, health check
- [Supabase: linked project ref & org](docs/SUPABASE_LINK_AND_ORG.md) - Get
  project ref, ask teammate which org, next steps
- [Key rotation checklist](docs/KEY_ROTATION_CHECKLIST.md) - Rotate API keys,
  local run, MCP template, git script
- [Deployment template (placeholders)](docs/DEPLOYMENT_TEMPLATE.md) - Doc name
  placeholders, curl with FUNCTION_URL / AUTH_HEADER
- [Pre-launch checklist](docs/PRE_LAUNCH_CHECKLIST.md) - Prioritized todo, RLS
  review, monitoring, test requests, 503 troubleshooting
- [Advantages & Platforms](docs/ADVANTAGES_AND_PLATFORMS.md) - Our advantages,
  platforms, and **what we have to do now**
- [**Wellness chatbot scope**](docs/WELLNESS_CHATBOT_SCOPE.md) - **What we
  build:** supplements, vitamins, health benefits, products — not
  medical/diagnostic
- [Health chatbot roadmap (reference)](docs/HEALTH_CHATBOT_ROADMAP_REFERENCE.md) -
  AMIE/PHIA-style architectures, MedGemma, safety, evaluation (for future
  wellness/AI evolution)
- [HAI-DEF evaluation reference](docs/HAI_DEF_EVALUATION_REFERENCE.md) - Data
  efficiency, benchmarks (CXR, CT, Derm, Path, HeAR, MedGemma); not for our
  clinical use
- [AMIE disease management paper summary](docs/AMIE_DISEASE_MANAGEMENT_PAPER_SUMMARY.md) -
  Technical summary of the AMIE management-reasoning paper (dual-agent, Mx,
  OSCE, RxQA)
- [Copilot Instructions](.github/copilot-instructions.md) - AI agent guide
- [Architecture](ARCHITECTURE_DIAGRAM.md) - System design
- [Social Media](SOCIAL_MEDIA_INTEGRATION.md) - Platform connections
- [**Connect all channels (chatbot)**](CONNECT_ALL_CHANNELS.md) - One-pager: website, Gorgias, ManyChat, deep links, Supabase secrets
- [**Chatbot on social**](CHATBOT_SOCIAL_MEDIA_SETUP.md) - Full Beauty Assistant setup for Gorgias, ManyChat, Instagram, Messenger, WhatsApp
- [**Chatbot knowledge base**](docs/CHATBOT_KNOWLEDGE_BASE.md) - How the chatbot uses products and documents from your database

---

## 🚀 Deployment

**Automatic**: Push to `main` → Lovable deploys → Live at
https://https-www-asperbeautyshop-com.lovable.app

**Manual**: `npm run build` → Upload `dist/` folder

**DNS Setup** (for custom domain):

```
Type: CNAME | Name: www | Value: https-www-asperbeautyshop-com.lovable.app
```

---

## 🧪 Testing

```bash
npm run lint                     # ESLint
./verify-connections.sh          # Verify integrations (48 checks)
npm run build && npm run preview # Test production
```

---

## 📞 Contact

- **Email**: asperpharma@gmail.com
- **Phone**: +962 79 065 6666
- **Location**: Amman, Jordan
- **Social**: [@asper.beauty.shop](https://www.instagram.com/asper.beauty.shop/)

---

**Built with ❤️ by Asper Pharma** | Powered by [Lovable](https://lovable.dev)
