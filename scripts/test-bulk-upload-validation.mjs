#!/usr/bin/env node
/**
 * Test bulk-product-upload Edge Function:
 * - GET: health check (200 when Shopify secrets set, 503 otherwise)
 * - POST create-shopify-product: expects 400 when secrets missing/invalid (validation behavior)
 *
 * Usage:
 *   BULK_UPLOAD_URL=https://PROJECT_REF.supabase.co/functions/v1/bulk-product-upload node scripts/test-bulk-upload-validation.mjs
 *   # Optional: admin JWT to test POST (otherwise only GET is run)
 *   ADMIN_TOKEN=eyJ... node scripts/test-bulk-upload-validation.mjs
 *
 * Local: supabase functions serve bulk-product-upload
 *   BULK_UPLOAD_URL=http://localhost:54321/functions/v1/bulk-product-upload node scripts/test-bulk-upload-validation.mjs
 */

const BULK_UPLOAD_URL = process.env.BULK_UPLOAD_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!BULK_UPLOAD_URL) {
  console.error(
    "Set BULK_UPLOAD_URL (e.g. https://PROJECT_REF.supabase.co/functions/v1/bulk-product-upload)",
  );
  process.exit(1);
}

async function main() {
  let passed = 0;
  let failed = 0;

  // 1) GET health check
  console.log("1) GET health check...");
  try {
    const res = await fetch(BULK_UPLOAD_URL, { method: "GET" });
    const body = await res.json().catch(() => ({}));
    if (res.status === 200 || res.status === 503) {
      console.log(
        `   Status: ${res.status} (expected 200 when secrets set, 503 when missing)`,
      );
      console.log("   Body:", JSON.stringify(body, null, 2));
      passed++;
    } else {
      console.log(`   FAIL: unexpected status ${res.status}`);
      failed++;
    }
  } catch (e) {
    console.error("   FAIL:", e.message);
    failed++;
  }

  // 2) POST create-shopify-product (validation: missing secrets → 400)
  if (!ADMIN_TOKEN) {
    console.log(
      "\n2) POST create-shopify-product: skipped (set ADMIN_TOKEN to test)",
    );
  } else {
    console.log(
      "\n2) POST create-shopify-product (expect 400 if secrets missing)...",
    );
    try {
      const res = await fetch(BULK_UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          action: "create-shopify-product",
          product: {
            title: "Validation test product",
            body: "",
            vendor: "Test",
            product_type: "Test",
            tags: "test",
            price: "0.00",
            sku: "test-validation",
          },
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (
        res.status === 400 &&
        (body.missing_env || body.error?.includes("Shopify") ||
          body.error?.includes("SHOPIFY"))
      ) {
        console.log(
          "   Validation behavior OK: 400 with config error (secrets missing or invalid)",
        );
        console.log("   Body:", JSON.stringify(body, null, 2));
        passed++;
      } else if (res.status === 201 || res.status === 200) {
        console.log(
          "   Request accepted (secrets set and Shopify accepted or created)",
        );
        passed++;
      } else {
        console.log(`   Status: ${res.status}`);
        console.log("   Body:", JSON.stringify(body, null, 2));
        if (res.status === 401 || res.status === 403) {
          console.log(
            "   (Auth/forbidden: ensure ADMIN_TOKEN is an admin user JWT)",
          );
        }
        failed++;
      }
    } catch (e) {
      console.error("   FAIL:", e.message);
      failed++;
    }
  }

  console.log("\n---");
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
