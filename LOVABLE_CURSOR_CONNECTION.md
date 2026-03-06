# Lovable ↔ Cursor Connection

Your Asper Beauty Shop project is connected for two-way sync between Cursor and Lovable.

---

## Connection status

| Component | Value |
|-----------|-------|
| **GitHub repo** | https://github.com/asperpharma/Asper-Beauty-Shop |
| **Lovable project** | asper-beauty-shop |
| **Primary domain (main website)** | https://https-www-asperbeautyshop-com.lovable.app |
| **Custom domain** | https://www.asperbeautyshop.com |

---

## How it works

1. **Work in Cursor** → Edit code locally
2. **Commit & push** → `git add .` → `git commit -m "..."` → `git push origin main`
3. **Lovable syncs** → Detects GitHub changes and updates the project
4. **Auto-deploy** → If enabled, Lovable deploys the new build

---

## Ensure sync works

1. **Lovable dashboard:** Settings → Integrations → GitHub
2. Confirm the repo `asperpharma/Asper-Beauty-Shop` is connected
3. Confirm sync is enabled for the `main` branch
4. Push from Cursor to `main` to trigger Lovable updates

---

## Quick commands

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
git status
git add .
git commit -m "Your message"
git push origin main
```

---

*Last updated: Feb 2025*
