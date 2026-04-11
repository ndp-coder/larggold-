import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const [goldRes, silverRes, forexRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU"),
      fetch("https://api.gold-api.com/price/XAG"),
      fetch("https://api.frankfurter.app/latest?from=USD&to=INR"),
    ]);

    if (!goldRes.ok || !silverRes.ok || !forexRes.ok) {
      throw new Error(`Upstream error: gold=${goldRes.status} silver=${silverRes.status} forex=${forexRes.status}`);
    }

    const [goldData, silverData, forexData] = await Promise.all([
      goldRes.json(),
      silverRes.json(),
      forexRes.json(),
    ]);

    const payload = {
      goldUsd: goldData.price,
      silverUsd: silverData.price,
      usdInr: forexData.rates.INR,
      goldChange: goldData.chp ?? 0,
      silverChange: silverData.chp ?? 0,
      goldBid: goldData.bid ?? goldData.price * 0.9995,
      goldAsk: goldData.ask ?? goldData.price * 1.0005,
      silverBid: silverData.bid ?? silverData.price * 0.999,
      silverAsk: silverData.ask ?? silverData.price * 1.001,
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
