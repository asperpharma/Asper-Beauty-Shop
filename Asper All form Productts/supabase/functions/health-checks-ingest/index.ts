// Asper Beauty Shop: Health Checks Ingest
// Receives webhook payloads from CI/scripts and persists to deployment_health_checks

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CheckPayload {
  check_type: string;
  status: "pass" | "fail";
  details?: Record<string, unknown>;
}

interface WebhookPayload {
  branch: string;
  checks: CheckPayload[];
  source?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase env vars" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body: WebhookPayload;
    try {
      const raw = await req.json();
      body = raw && typeof raw === "object" ? raw : {};
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const branch = body?.branch ?? "main";
    const checks = Array.isArray(body?.checks) ? body.checks : [];
    const source = body?.source ?? "webhook";

    if (checks.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "No checks provided. Use { branch, checks: [{ check_type, status }] }",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const rows = checks.map((c) => ({
      branch,
      check_type: String(c.check_type),
      status: c.status === "pass" || c.status === "fail" ? c.status : "fail",
      details: c.details ?? {},
      source,
    }));

    const { data, error } = await supabase
      .from("deployment_health_checks")
      .insert(rows)
      .select("id, check_type, status, created_at");

    if (error) throw error;

    return new Response(
      JSON.stringify({ inserted: data?.length ?? 0, checks: data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
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
