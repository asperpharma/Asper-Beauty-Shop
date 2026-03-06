// Asper Beauty Shop: Shopify Discovery (Admin / client-credentials)
// Calls Shopify discovery API server-side. Secrets: SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET (Supabase function secrets).
// Use only when you need discovery/Admin endpoints. Prefer Storefront API in beauty-assistant for live catalog.
// Deploy: supabase functions deploy shopify-discovery

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
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const CLIENT_ID = Deno.env.get("SHOPIFY_CLIENT_ID") ?? "";
    const CLIENT_SECRET = Deno.env.get("SHOPIFY_CLIENT_SECRET") ?? "";

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Missing Shopify client credentials" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const tokenResp = await fetch("https://api.shopify.com/auth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!tokenResp.ok) {
      const body = await tokenResp.text();
      return new Response(
        JSON.stringify({ error: "Token exchange failed", details: body }),
        {
          status: tokenResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { access_token } = await tokenResp.json();

    const { query = "", context = "", limit = 10 } = await req
      .json()
      .catch(() => ({}));

    const discoverResp = await fetch(
      "https://discover.shopifyapps.com/global/mcp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          id: 1,
          params: {
            name: "search_global_products",
            arguments: { query, context, limit },
          },
        }),
      },
    );

    const data = await discoverResp.json();
    return new Response(JSON.stringify(data), {
      status: discoverResp.ok ? 200 : discoverResp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
