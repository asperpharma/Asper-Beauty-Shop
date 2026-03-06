# Patches

## Documentation architecture

- **README** (with Deployment section) → entry point; flow + curl for
  bulk-product-upload.
- **NEXT_STEPS.md** — flow at a glance, health checks, PR, DNS, verify.
- **SHOPIFY_SETUP_CHECKLIST.md** — secrets, pre-launch, your own store.
- **CONNECTION_STATUS.md** — integration status.
- **docs/DEPLOYMENT_TEMPLATE.md** — reusable patterns, placeholders, curl.

**Patches:** `readme-deployment.patch` = portable Deployment section (new repos:
`git apply` → instant deployment docs). `NEXT_STEPS.patch`,
`deployment-docs.patch` = flow + template. **Validation:** Open README.md and
confirm "Deployment" appears after Quick Start.

## How to apply (from repo root)

| Goal                             | Command                                                                |
| -------------------------------- | ---------------------------------------------------------------------- |
| README Deployment only           | `git apply patches/readme-deployment.patch`                            |
| NEXT_STEPS only                  | `git apply patches/NEXT_STEPS.patch`                                   |
| NEXT_STEPS + DEPLOYMENT_TEMPLATE | `git apply patches/deployment-docs.patch`                              |
| If hunks fail                    | `git apply --reject patches/<name>.patch` then fix `.rej` and re-apply |

**Validation:** After applying `readme-deployment.patch`, open README.md and
confirm the "Deployment" section appears after Quick Start.

- **README Deployment section** (deployment instructions + ready-to-use curl for
  bulk-product-upload):\
  `git apply patches/readme-deployment.patch`

- **Apply only NEXT_STEPS changes:**\
  `git apply patches/NEXT_STEPS.patch`

- **Apply both files** (deployment-docs patch contains the NEXT_STEPS changes as
  well):\
  `git apply patches/deployment-docs.patch`

If the base files differ from what’s in the patch, re-run with `--reject` to
write conflicting hunks to `.rej` files and resolve manually:

- `git apply --reject patches/NEXT_STEPS.patch`
- `git apply --reject patches/deployment-docs.patch`

## Applying and submitting the deployment docs patch

**If you need to see or resolve patch rejections:**

```sh
git apply --reject patches/deployment-docs.patch
# Fix any .rej files or skip apply; then stage only the files you changed and commit.
```

**After pushing your branch:** open the PR in the GitHub UI (or use
`gh pr create`):

- **Base:** `main`
- **Compare:** `docs/deployment-flow-and-health-check`
- **Title:**
  `docs: Deployment flow, NEXT_STEPS, and bulk-product-upload health check`
- **Description:** Use the PR description block from
  `docs/DEPLOY_COMMIT_AND_TEST.md` if present (Summary, Changes, Validation), or
  describe the updated flow and health-check curl.

**Bash (Git Bash / WSL):**

```bash
git checkout -b docs/deployment-flow-and-health-check
git apply patches/deployment-docs.patch
git add NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md
git commit -m "docs: add NEXT_STEPS flow and DEPLOYMENT_TEMPLATE

- NEXT_STEPS: flow at a glance, health checks 1–5, Shopify pre-launch, PR/DNS/verify
- docs/DEPLOYMENT_TEMPLATE: placeholders, concrete bulk-product-upload sample payload"
git push -u origin docs/deployment-flow-and-health-check
```

**PowerShell one-liner** (Windows; same outcome as Bash block):

```powershell
git checkout -b docs/deployment-flow-and-health-check; git apply patches/deployment-docs.patch; git add NEXT_STEPS.md docs/DEPLOYMENT_TEMPLATE.md; git commit -m "docs: add NEXT_STEPS flow and DEPLOYMENT_TEMPLATE`n`n- NEXT_STEPS: flow at a glance, health checks 1–5, Shopify pre-launch, PR/DNS/verify`n- docs/DEPLOYMENT_TEMPLATE: placeholders, concrete bulk-product-upload sample payload"; git push -u origin docs/deployment-flow-and-health-check
```

If you also applied `readme-deployment.patch`, add `README.md` to `git add` and
mention the README Deployment section in the commit message. Prefer the Bash
block in Git Bash or WSL; use the PowerShell line only when working in Windows
PowerShell.

---

## Notes

- The deployment-docs patch uses a **concrete sample payload** for the
  bulk-product-upload function (`action: "create-shopify-product"` with a sample
  `product` object), not an empty `-d '{}'`. Expected fields: `title`, `price`,
  `sku`, `body`, `vendor`, `product_type`, `tags`.
- **Single unified patch:** `patches/deployment-docs.patch` already includes
  both NEXT_STEPS and `docs/DEPLOYMENT_TEMPLATE.md` in one file. Use it when you
  want both in a single apply.
- **Vercel bypass + cross-links:**
  `patches/deploy-docs-vercel-and-crosslinks.patch` — adds the Vercel Protection
  Bypass Header section to `docs/DEPLOY_COMMIT_AND_TEST.md`, cross-links to it
  from README, NEXT_STEPS, and docs/DEPLOYMENT_TEMPLATE, and related formatting.
  Apply from repo root:
  `git apply patches/deploy-docs-vercel-and-crosslinks.patch` (resolve rejects
  if base files differ).
- **Vercel bypass in DEPLOYMENT_TEMPLATE:**
  `patches/vercel-bypass-in-template.patch` — adds the "Secrets / headers —
  Vercel bypass" subsection and the cross-link to DEPLOY_COMMIT_AND_TEST in
  `docs/DEPLOYMENT_TEMPLATE.md`. Apply from repo root:
  `git apply patches/vercel-bypass-in-template.patch`. Suggested commit message:
  `patches/commit-msg-vercel-bypass-template.txt`.
