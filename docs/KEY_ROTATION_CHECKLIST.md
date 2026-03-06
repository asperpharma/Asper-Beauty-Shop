# Key rotation checklist

Use this when rotating API keys, tokens, or other secrets (Supabase, Shopify,
MCP/Stitch, etc.).

---

## Quick rotation checklist

- [ ] **1. Revoke the old key** in the provider console (Supabase, Shopify,
      Google Cloud, Stitch, etc.).
- [ ] **2. Create a new key** in the same provider; copy it to a secure place.
- [ ] **3. Update deployments / secrets** to use the new key:
  - Supabase Edge Functions: `supabase secrets set MCP_KEY="new_key"` (or the
    relevant secret name).
  - Cloud/host env vars: update in dashboard or config (e.g. Lovable, Vercel).
  - Local: update `.env` or `.env.secrets` (never commit real keys).
- [ ] **4. Verify app functionality** (run app, hit the feature that uses the
      key).
- [ ] **5. Optionally purge history** (logs, caches, or chat history that might
      reference the old key). Coordinate with the team if shared.
- [ ] **6. Continue normal workflow.**

---

## After rotation: local run and push

**Run the app locally:**

```bash
npm run dev
```

(or `npm run server` if your project uses that.)

**Keep real keys out of the repo:**

- Use **`docs/cursor-mcp-stitch-example.json`** as the template for MCP config.
  Copy it locally, fill in your key in the right place, and do **not** commit
  that file. Add it to `.gitignore` if it’s in the repo path.

**When ready, push your branch:**

```bash
git add .
git status   # ensure no secret files are staged
git commit -m "chore: rotate keys / update config"
git push origin <your-branch>
```

Or use the script: **`scripts/rotate-and-push.sh`** (see below).

---

## Scripts and patches

- **Git commands in one script:**
  [scripts/rotate-and-push.sh](../scripts/rotate-and-push.sh) — creates a
  branch, optionally removes tracked secret files from the index, commits, and
  pushes.
- **Git patch:** To generate a patch that removes specific tracked files (e.g.
  after you’ve added them to `.gitignore`), run:
  ```bash
  git diff --cached -- <path-to-file>   # or
  git rm --cached -- <path-to-file>
  git diff > remove-tracked-secrets.patch
  ```
  Apply elsewhere with `git apply remove-tracked-secrets.patch` (or commit the
  `git rm --cached` change).

---

## Provider-specific rotation

For step-by-step rotation for a specific provider, see:

- **Supabase** (project ref, access tokens, Edge Function secrets):
  [SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md) § 6 (remove/rotate
  secrets).
- **Shopify** (Storefront token, Admin API token):
  [SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md) § 4 and § 6.
- **Google Cloud / Stitch (MCP):** Use `docs/cursor-mcp-stitch-example.json` as
  template; rotate the API key in Google Cloud Console, then update your local
  MCP config and any cloud config that injects the key.

If you want a dedicated “Rotate keys for Google Cloud / Stitch” section with
exact console steps, say which provider and we can add it here.
