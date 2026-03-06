# Asper Beauty Shop — Operations Master

Central reference for daily ops, health checks, and key docs.

---

## Quick links

| What | URL |
|------|-----|
| **Main site** | https://https-www-asperbeautyshop-com.lovable.app |
| **Shopify Admin** | https://admin.shopify.com/store/lovable-project-milns |
| **Supabase** | https://rgehleqcubtmcwyipyvi.supabase.co |
| **Gorgias** | https://app.gorgias.com |
| **Bulk Upload health** | https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload |
| **Beauty Assistant health** | https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true |

---

## Checklists

| Doc | Purpose |
|-----|---------|
| [PUBLISH_FINAL_STEPS.md](../PUBLISH_FINAL_STEPS.md) | **Start here** — Final publish steps (verify, deploy, push) |
| [LIVE_VERIFICATION_CHECKLIST.md](../LIVE_VERIFICATION_CHECKLIST.md) | Pre-launch verification, env vars, health checks |
| [PUBLISH_AND_CONNECT_CHECKLIST.md](../PUBLISH_AND_CONNECT_CHECKLIST.md) | Publish steps, images, domain, Notebook LLM |
| [monitor-checklist.md](../../monitor-checklist.md) | Daily/weekly monitoring (orders, Gorgias, chat_logs, health) |

---

## Chatbot & social

| Doc | Purpose |
|-----|---------|
| [CHATBOT_SOCIAL_MEDIA_SETUP.md](../CHATBOT_SOCIAL_MEDIA_SETUP.md) | Connect Beauty Assistant to Gorgias, ManyChat, Instagram, Messenger, WhatsApp |
| [Gorgias-AI-Agent-Dr-Sami-Setup.md](../../Gorgias-AI-Agent-Dr-Sami-Setup.md) | Gorgias AI Agent (webhook + native) setup |
| [GORGIAS_OMNICHANNEL.md](../../GORGIAS_OMNICHANNEL.md) | Gorgias omnichannel (email, chat, Instagram, Messenger, WhatsApp) |

---

## Health check commands

```powershell
# Bulk upload (expect 200)
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload"

# Beauty Assistant (expect 200, JSON with status:active)
curl -s "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true"
```

---

## Deploy Edge Functions

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
npx supabase functions deploy bulk-product-upload --project-ref rgehleqcubtmcwyipyvi
```

---

*Last updated: Feb 2025*
