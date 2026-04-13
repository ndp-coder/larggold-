import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function fetchUsdInr(): Promise<number> {
  const urls = [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json",
    "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const data = await res.json();
      const rate = data?.usd?.inr;
      if (typeof rate === "number" && rate > 50) return rate;
    } catch {
      // try next
    }
  }
  throw new Error("USD/INR unavailable");
}

async function fetchMetals(): Promise<{
  goldUsd: number; silverUsd: number;
  goldBid: number; goldAsk: number;
  silverBid: number; silverAsk: number;
  goldChange: number; silverChange: number;
}> {
  const [goldRes, silverRes] = await Promise.all([
    fetch("https://api.gold-api.com/price/XAU", { signal: AbortSignal.timeout(5000) }),
    fetch("https://api.gold-api.com/price/XAG", { signal: AbortSignal.timeout(5000) }),
  ]);

  if (!goldRes.ok || !silverRes.ok) {
    throw new Error(`gold-api error: gold=${goldRes.status} silver=${silverRes.status}`);
  }

  const [g, s] = await Promise.all([goldRes.json(), silverRes.json()]);

  const goldUsd = Number(g.price);
  const silverUsd = Number(s.price);

  if (!goldUsd || !silverUsd) throw new Error("Invalid price data from gold-api");

  return {
    goldUsd,
    silverUsd,
    goldBid:    typeof g.bid === "number" ? g.bid : goldUsd * 0.9995,
    goldAsk:    typeof g.ask === "number" ? g.ask : goldUsd * 1.0005,
    silverBid:  typeof s.bid === "number" ? s.bid : silverUsd * 0.999,
    silverAsk:  typeof s.ask === "number" ? s.ask : silverUsd * 1.001,
    goldChange:   g.chp ?? g.ch ?? 0,
    silverChange: s.chp ?? s.ch ?? 0,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const [metals, usdInr] = await Promise.all([
      fetchMetals(),
      fetchUsdInr(),
    ]);

    const payload = { ...metals, usdInr };

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
