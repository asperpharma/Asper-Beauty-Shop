# Environment Variables — Validation Steps

This project uses **React 18 + Vite**. Follow these checks before and after deployment.

---

## 1. Prefix check (Vite, not Next.js)

- **Client-side variables must use the `VITE_` prefix.**  
  Variables named `NEXT_PUBLIC_` will **not** be exposed to your frontend code in a Vite build.
- **Action:** Use `VITE_` in both:
  - Your local **`.env`**
  - Your deployment settings (**Vercel**, **Lovable**, or other host) for any variable the frontend needs.

---

## 2. Security

- **Never commit the actual `.env` file.** It may contain secrets (Supabase keys, Shopify tokens, etc.).
- **Only commit `.env.example`** to the repository. It lists variable **names** and placeholder values only.
- Set real values in:
  - Local: copy `.env.example` to `.env` and fill in (`.env` is in `.gitignore`).
  - Deployment: project → Environment variables / Secrets in your host dashboard.

---

## 3. Supabase keys

- The required variable name for your Supabase anon/publishable key is **`VITE_SUPABASE_PUBLISHABLE_KEY`**.
- Use this name in `.env` and in deployment env settings so the "Centralised Brain" and Auth connection work correctly.
- Code may also accept `VITE_SUPABASE_ANON_KEY` as a fallback for backward compatibility, but **`VITE_SUPABASE_PUBLISHABLE_KEY`** is the canonical name.

---

## Reference

- **Variable list and placeholders:** `.env.example`
- **Deployment and secrets:** `docs/FINISH-AND-PUBLISH.md`
