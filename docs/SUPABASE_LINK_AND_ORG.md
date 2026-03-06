# Supabase: linked project ref and organization

## Get the linked project ref (local repo)

Run from the **project root** after you’ve run `supabase link` at least once.

**With `jq`:**

```bash
cat .supabase/.config.json | jq -r '.project?.ref // .projectRef // .ref'
```

**Without `jq` (Node):**

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('.supabase/.config.json','utf8')).project?.ref || JSON.parse(require('fs').readFileSync('.supabase/.config.json','utf8')).projectRef || JSON.parse(require('fs').readFileSync('.supabase/.config.json','utf8')).ref)"
```

If the file or key is missing, the repo isn’t linked. Link it with:

```bash
supabase link
```

---

## Ask a teammate which org owns a project

Copy/paste and replace `PROJECT_REF` with the actual ref (e.g.
`unjgpqdcdcatbrinitfu` or `rgehleqcubtmcwyipyvi`):

**Plain message:**

> Hi — quick question: which Supabase organization owns project ref
> "**PROJECT_REF**"? I found the ref in the repo but I can't see the org in my
> dashboard. Could you confirm the org name (or add me to it) so I can access
> the project? Thanks!

**Slack:**

> Hi — quick one: which Supabase org has project ref `PROJECT_REF`? I've got the
> ref from the repo but don't see that org in my dashboard. Can you share the
> org name or add me so I can get in? Thanks.

**Email:**

> **Subject:** Which Supabase org owns project PROJECT_REF?
>
> Hi,
>
> I need access to the Supabase project with ref **PROJECT_REF** (found in the
> repo). I don't see the organization in my dashboard yet.
>
> Could you either tell me which organization it's under or add me to it so I
> can open the project?
>
> Thanks.

**GitHub issue (template):**

> **Title:** Access: which Supabase org owns project ref PROJECT_REF?
>
> **Body:** I need to work with the Supabase project ref **PROJECT_REF** (from
> this repo's config). I can't see the organization in my Supabase dashboard.
> Could someone with access confirm the org name or add me to the org/project so
> I can continue? Thanks.

---

## This repo’s configured project

The app env (`.env`, `CONNECTION_STATUS.md`) points at project
**rgehleqcubtmcwyipyvi**.\
A second project ref that has appeared in the dashboard is
**unjgpqdcdcatbrinitfu** — use the teammate message above with the ref that
matches the project you need access to.

---

## Next steps (checklist)

- [ ] **1. Link the repo** (if you use Supabase CLI)
  ```bash
  supabase link
  ```
  Pick the project/org you have access to when prompted.

- [ ] **2. Get the project ref**\
      Run one of the CLI snippets in “Get the linked project ref” above.\
      If nothing prints, the repo isn’t linked yet (redo step 1).

- [ ] **3. If you can’t see the org**\
      Send the teammate message (Plain / Slack / Email / GitHub issue above)
      with the ref you need.\
      Get the org name or an invite so you can open the project in the
      dashboard.

- [ ] **4. After you have access**
  - Set Edge Function secrets for that project: `SHOPIFY_STORE_DOMAIN`,
    `SHOPIFY_ACCESS_TOKEN`\
    → [SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md) § Step 3 and
    § 6.
  - Run the health check (replace `PROJECT_REF` with your ref):
    ```bash
    curl -s "https://PROJECT_REF.supabase.co/functions/v1/bulk-product-upload"
    ```
    **200** = secrets OK · **503** = missing/invalid.

- [ ] **5. Use related docs when needed**
  - [SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md) — Shopify +
    Supabase secrets, health check, rotate secrets.
  - [CONNECTION_STATUS.md](../CONNECTION_STATUS.md) — Full integration status.

---

## Done next (already in place)

**What’s already set up**

- The **README** already links to this doc (under “Documentation”), so the path
  is: README → this file → Next steps checklist.

**What to do after the checklist**

- **Next steps** above = your todo list (link repo, get ref, get org access, set
  secrets, run health check).
- **Done next** = what’s already in place and what happens after you finish it:
  - Once you finish **steps 1–4**, you’re ready to use the linked Supabase
    project and Edge Function secrets.
  - Use **step 5** (related docs) for Shopify setup and connection status:
    [SHOPIFY_SETUP_CHECKLIST.md](../SHOPIFY_SETUP_CHECKLIST.md) and
    [CONNECTION_STATUS.md](../CONNECTION_STATUS.md).
