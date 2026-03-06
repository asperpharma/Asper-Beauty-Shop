/**
 * Health check for the Tray Edge Function.
 * Ensures the Digital Concierge tray endpoint is live and returns valid regimen data.
 * Run: npm test (or vitest run)
 */

import { describe, expect, it } from "vitest";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

const TRAY_URL = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/tray`
  : "";
const VALID_CONCERNS = [
  "Concern_Acne",
  "Concern_AntiAging",
  "Concern_Hydration",
  "Concern_Dryness",
  "Concern_Sensitivity",
];

describe("health-check-tray", () => {
  it("tray endpoint returns 200 and valid JSON for Concern_Hydration", async () => {
    if (!TRAY_URL || !ANON_KEY) {
      // Skip when env not set (e.g. CI without secrets); run locally or in deploy with env
      return;
    }

    const url = `${TRAY_URL}?concern=${
      encodeURIComponent("Concern_Hydration")
    }`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${ANON_KEY}` },
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as Record<string, unknown>;
    expect(data).toHaveProperty("concern_tag");
    expect(VALID_CONCERNS).toContain(data.concern_tag);
    expect(data).toHaveProperty("step_1");
  });

  it("tray endpoint rejects invalid concern with 400", async () => {
    if (!TRAY_URL || !ANON_KEY) {
      return;
    }

    const url = `${TRAY_URL}?concern=InvalidConcern`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${ANON_KEY}` },
    });

    expect(res.status).toBe(400);
    const data = (await res.json()) as { error?: string; valid?: string[] };
    expect(data.error).toBeDefined();
    expect(Array.isArray(data.valid)).toBe(true);
  });
});
