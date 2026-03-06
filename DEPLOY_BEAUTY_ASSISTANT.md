# Deploy Beauty Assistant and set CORS

The `beauty-assistant` function uses the **ALLOWED_ORIGIN** secret for CORS when set. Otherwise it reflects the request `Origin` or allows `*`.

## 1. Log in to Supabase CLI

You must be logged in (or set `SUPABASE_ACCESS_TOKEN`) before setting secrets or deploying:

```bash
npx supabase login
```

Or set a token:

```bash
set SUPABASE_ACCESS_TOKEN=your_token_here
```

## 2. Set the CORS secret

```bash
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
npx supabase secrets set ALLOWED_ORIGIN="https://https-www-asperbeautyshop-com.lovable.app" --project-ref rgehleqcubtmcwyipyvi
```

## 3. Deploy the function

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

## 4. Verify (from your storefront origin)

In the browser console on **https://https-www-asperbeautyshop-com.lovable.app** run:

```javascript
// OPTIONS (preflight)
fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', { method: 'OPTIONS' })
  .then(r => console.log('OPTIONS', r.status, r.headers.get('Access-Control-Allow-Origin')));

// POST (e.g. ping)
fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ping: true })
})
  .then(r => r.json())
  .then(console.log);
```

Or from PowerShell (no origin restriction):

```powershell
# OPTIONS (preflight)
Invoke-WebRequest -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" -Method OPTIONS -UseBasicParsing | Select-Object StatusCode, @{n='AllowOrigin';e={$_.Headers['Access-Control-Allow-Origin']}}

# Health (GET)
Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant?health=true" -Method GET

# POST ping
Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" -Method POST -ContentType "application/json" -Body '{"ping":true}'
```

Expected: OPTIONS returns 200 with `Access-Control-Allow-Origin`; health returns `{"status":"active",...}`.
