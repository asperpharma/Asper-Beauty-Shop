# Deployment Guide

Post-deployment checklist, build output rules, and where the deployment skill looks for sitemap and robots validation.

---

## Build output

- **Directory:** `dist/` (Vite default; confirm in `vite.config.ts` or `netlify.toml` if different).
- After `npm run build`, the deployment skill (or script) can validate the contents of this directory.

---

## robots.txt

### Location

- **In build output:** `dist/robots.txt`
- **Source:** Usually `public/robots.txt` (copied into `dist/` at build time) or generated during build.

### Validation rules (for build validation)

When **docs/DEPLOYMENT_GUIDE.md** is present, the skill validates:

1. **Existence:** File **`dist/robots.txt`** must exist after a successful build.
2. **Non-empty:** File must be non-empty (optional: minimum length or “User-agent” present).
3. **Sitemap (optional):** `robots.txt` may include a `Sitemap:` line (e.g. `Sitemap: https://www.asperbeautyshop.com/sitemap.xml`).

### Example

```text
User-agent: *
Allow: /

Sitemap: https://www.asperbeautyshop.com/sitemap.xml
```

---

## Sitemap

### Location

- **In build output:** `dist/sitemap.xml` (or `dist/sitemap-index.xml` if using an index).
- **Source:** Static file in `public/` or generated at build time (e.g. by a Vite plugin or script).

### Validation rules (for build validation)

When **docs/DEPLOYMENT_GUIDE.md** is present, the skill validates:

1. **Existence:** At least one of **`dist/sitemap.xml`** or **`dist/sitemap-index.xml`** must exist after a successful build.
2. **Valid XML:** File must be well-formed XML (root `<urlset>` or `<sitemapindex>`).
3. **Consistency (optional):** If `dist/robots.txt` exists, it may contain a `Sitemap:` line pointing to the sitemap on the live domain.

### Example (minimal sitemap.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.asperbeautyshop.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## When these files don’t exist

- If **docs/NEXT_STEPS.md** or **docs/DEPLOYMENT_GUIDE.md** do not exist, the deployment skill still runs using the steps and template defined in its **SKILL.md**.
- If `dist/robots.txt` or `dist/sitemap.xml` are not present after build, validation can report “missing” and leave it to you to add them (e.g. add `public/robots.txt` and/or a sitemap generator).

---

## References

- **docs/NEXT_STEPS.md** — Checklist order and PR description template; skill prefers this for “Prepare for deployment” / “Run health checks.”
- **docs/FINISH-AND-PUBLISH.md** — Phases: push, secrets, domain, verify.
- **docs/HEALTH-CHECK-PROTOCOL.md** — Live health checks and DB (PostgREST).
- **docs/DOMAIN_AND_SHOPIFY.md** — Headless domain setup: ignore "Change target"; DNS points storefront to Lovable; Shopify Domains for checkout/API only.
