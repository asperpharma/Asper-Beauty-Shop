// Asper Beauty Shop: tray — returns JSON from get_tray_by_concern
// GET /functions/v1/tray?concern=Concern_Hydration
//
// Auth: callers may use either "Authorization: Bearer <anon_key>" or "apikey: <anon_key>".
// See docs/TRAY_API.md for curl and Node examples.

import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const VALID_CONCERN_TAGS = [
  "Concern_Acne",
  "Concern_AntiAging",
  "Concern_Hydration",
  "Concern_Dryness",
  "Concern_Sensitivity",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Use GET ?concern=Concern_Hydration" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      },
    );
  }

  const url = new URL(req.url);
  const concern = url.searchParams.get("concern")?.trim();

  if (!concern || !VALID_CONCERN_TAGS.includes(concern)) {
    return new Response(
      JSON.stringify({
        error: "Invalid concern. Use concern_tag.",
        valid: VALID_CONCERN_TAGS,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

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

  const { data, error } = await supabase.rpc("get_tray_by_concern", {
    concern_tag: concern,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }

  return new Response(
    JSON.stringify(
      data ??
        { concern_tag: concern, step_1: null, step_2: null, step_3: null },
    ),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    },
  );
});
