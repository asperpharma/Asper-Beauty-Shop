# Asper Beauty Shop — Deployment Template

## Secrets / headers — Vercel bypass

When deploying on Vercel, secure sensitive backend endpoints by requiring your
frontend to send a custom header (such as `X-Bypass-Token`) with a shared secret
value.

- **How:**\
  Set the secret token as an environment variable in Vercel project settings.

- **Usage:**\
  Your frontend must include this header in any request to protected backend
  routes. The backend checks for the presence and value of this header before
  processing the request.

- **Why:**\
  Prevents unauthorized or external requests from reaching sensitive endpoints,
  even if the API surface is public.

Example:

Frontend request (this project uses **Vite** — use `import.meta.env.VITE_*`):

```js
fetch("/api/my-endpoint", {
  headers: {
    "X-Bypass-Token": import.meta.env.VITE_BYPASS_TOKEN,
  },
});
```

If you were on Next.js you would use `process.env.NEXT_PUBLIC_BYPASS_TOKEN`; in Vite, only `VITE_`-prefixed variables are exposed to the client.

Backend check (Node/Express/Python/etc.):

```js
if (req.headers["x-bypass-token"] !== process.env.BYPASS_TOKEN) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

Ensure your secret is never exposed in the public repo or frontend code. Only
share the value through project/env settings.

---

## Running Supabase Edge Functions Locally

### 1. Install the Supabase CLI

```bash
# Using npm (recommended)
npm install -g supabase

# Or, on Windows with Scoop
scoop install supabase

# More install options: https://supabase.com/docs/guides/cli
```

### 2. Log in and link your project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project ref (from your
project dashboard URL).

### 3. Download a function from your project

```bash
supabase functions download FUNCTION_NAME
```

Replace `FUNCTION_NAME` with the function name (e.g. `generate-prescription`,
`tray`). This creates `supabase/functions/FUNCTION_NAME/` with the function
code.

### 4. Serve the function locally

```bash
supabase functions serve FUNCTION_NAME
```

The function will be available at:

```
http://localhost:54321/functions/v1/FUNCTION_NAME
```
