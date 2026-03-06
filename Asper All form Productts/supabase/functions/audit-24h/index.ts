// Asper Beauty Shop: 24-Hour Clinical Audit Edge Function
// Aggregates the last 24 hours of telemetry, concierge events, and consultations
// into a single JSON report for docs/audits/24_HOUR_CLINICAL_AUDIT.md

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing Supabase env vars (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). These are auto-injected by Supabase.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isoStart = twentyFourHoursAgo.toISOString();
    const isoEnd = now.toISOString();

    // 1. Telemetry: latency, quiz, sync events
    const { data: telemetry, error: telemetryError } = await supabase
      .from("as_telemetry")
      .select(
        "event_type, metric_name, value_numeric, value_text, source, created_at",
      )
      .gte("created_at", isoStart)
      .lte("created_at", isoEnd)
      .order("created_at", { ascending: false });

    if (telemetryError) throw telemetryError;

    // 2. Concierge events: intents, recommendations
    const { data: conciergeEvents, error: conciergeError } = await supabase
      .from("as_concierge_events")
      .select("event_type, intent, recommended_handles, created_at")
      .gte("created_at", isoStart)
      .lte("created_at", isoEnd)
      .order("created_at", { ascending: false });

    if (conciergeError) throw conciergeError;

    // 3. Consultations (full Concierge interactions)
    const { data: consultations, error: consultationsError } = await supabase
      .from("consultations")
      .select("id, user_id, recommended_skus, created_at")
      .gte("created_at", isoStart)
      .lte("created_at", isoEnd)
      .order("created_at", { ascending: false });

    if (consultationsError) throw consultationsError;

    // 4. Aggregate metrics
    const apiLatency = (telemetry || [])
      .filter((t) => t.event_type === "api_latency" && t.value_numeric != null)
      .map((t) => Number(t.value_numeric));

    const avgLatencyMs = apiLatency.length > 0
      ? Math.round(
        apiLatency.reduce((a, b) => a + b, 0) / apiLatency.length,
      )
      : null;

    const intentCounts = (conciergeEvents || []).reduce(
      (acc: Record<string, number>, e) => {
        const k = e.intent || "unknown";
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      },
      {},
    );

    const report = {
      audit_window: {
        start: isoStart,
        end: isoEnd,
        duration_hours: 24,
      },
      telemetry: {
        total_events: (telemetry || []).length,
        by_event_type: (telemetry || []).reduce(
          (acc: Record<string, number>, t) => {
            acc[t.event_type] = (acc[t.event_type] || 0) + 1;
            return acc;
          },
          {},
        ),
        api_latency_ms: {
          avg: avgLatencyMs,
          sample_count: apiLatency.length,
        },
      },
      concierge: {
        events_count: (conciergeEvents || []).length,
        intent_counts: intentCounts,
        consultations_count: (consultations || []).length,
      },
      raw: {
        telemetry: telemetry || [],
        concierge_events: conciergeEvents || [],
        consultations: (consultations || []).map((c) => ({
          id: c.id,
          created_at: c.created_at,
          sku_count: (c.recommended_skus || []).length,
        })),
      },
    };

    return new Response(JSON.stringify(report, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
