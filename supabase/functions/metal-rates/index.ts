import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const UPSTOX_TOKEN = Deno.env.get("UPSTOX_TOKEN") ??
  "eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIyUENUN0MiLCJqdGkiOiI2OWRjOTI5NzEzM2E1NDdhYWRhOTM3YTIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6dHJ1ZSwiaXNFeHRlbmRlZCI6dHJ1ZSwiaWF0IjoxNzc2MDYzMTI3LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE4MDc2NTM2MDB9.MXxFZfcDjxy5x_2P79iASA6X7viAenfGCw7xrHnYEv4";

const UPSTOX_HEADERS = {
  Authorization: `Bearer ${UPSTOX_TOKEN}`,
  Accept: "application/json",
};

const CACHE_TTL_MS = 15000;
const CACHE_KEY = "metal-rates-v1";

const TROY_OZ_TO_GRAM = 31.1035;
const TROY_OZ_TO_KG   = 32.1507;

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function getCachedRates() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("rates_cache")
    .select("data, fetched_at")
    .eq("id", CACHE_KEY)
    .maybeSingle();

  if (!data) return null;

  const age = Date.now() - new Date(data.fetched_at).getTime();
  if (age > CACHE_TTL_MS) return null;

  return data.data;
}

async function setCachedRates(rates: object) {
  const supabase = getSupabase();
  await supabase
    .from("rates_cache")
    .upsert({ id: CACHE_KEY, data: rates, fetched_at: new Date().toISOString() });
}

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
    } catch { /* try next */ }
  }
  throw new Error("USD/INR unavailable");
}

interface McxInstrument {
  instrument_key: string;
  trading_symbol: string;
  expiry: number;
  instrument_type: string;
  asset_symbol: string;
  name: string;
  segment: string;
  price_quote_unit: string;
}

let cachedInstruments: McxInstrument[] | null = null;
let instrumentCacheTime = 0;

async function getMcxInstruments(): Promise<McxInstrument[]> {
  const now = Date.now();
  if (cachedInstruments && now - instrumentCacheTime < 6 * 60 * 60 * 1000) {
    return cachedInstruments;
  }

  const res = await fetch(
    "https://assets.upstox.com/market-quote/instruments/exchange/MCX.json.gz",
    { signal: AbortSignal.timeout(10000) },
  );
  if (!res.ok) throw new Error(`MCX instruments fetch failed: ${res.status}`);

  const buf = await res.arrayBuffer();
  const ds = new DecompressionStream("gzip");
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();
  writer.write(new Uint8Array(buf));
  writer.close();

  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLength = chunks.reduce((s, c) => s + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }

  const text = new TextDecoder().decode(merged);
  cachedInstruments = JSON.parse(text) as McxInstrument[];
  instrumentCacheTime = now;
  return cachedInstruments;
}

async function getFrontMonthKey(instruments: McxInstrument[], assetSymbol: string): Promise<string> {
  const now = Date.now();
  const futures = instruments.filter(
    (i) => i.asset_symbol === assetSymbol &&
           i.instrument_type === "FUT" &&
           i.segment === "MCX_FO" &&
           i.expiry > now,
  );
  if (!futures.length) throw new Error(`No active MCX FUT for ${assetSymbol}`);
  futures.sort((a, b) => a.expiry - b.expiry);
  return futures[0].instrument_key;
}

async function fetchFreshRates() {
  const [usdInr, instruments] = await Promise.all([fetchUsdInr(), getMcxInstruments()]);

  const [goldKey, silverKey] = await Promise.all([
    getFrontMonthKey(instruments, "GOLD"),
    getFrontMonthKey(instruments, "SILVER"),
  ]);

  const ltpUrl = `https://api.upstox.com/v3/market-quote/ltp?instrument_key=${encodeURIComponent(goldKey)},${encodeURIComponent(silverKey)}`;
  const ltpRes = await fetch(ltpUrl, { headers: UPSTOX_HEADERS, signal: AbortSignal.timeout(5000) });
  if (!ltpRes.ok) throw new Error(`LTP fetch failed: ${ltpRes.status}`);
  const ltpData = await ltpRes.json();

  const entries = Object.values(ltpData?.data ?? {}) as Array<{
    last_price: number; cp: number; instrument_token: string;
  }>;

  const goldEntry   = entries.find((e) => e.instrument_token === goldKey);
  const silverEntry = entries.find((e) => e.instrument_token === silverKey);

  if (!goldEntry || !silverEntry) throw new Error("LTP data missing for GOLD or SILVER");

  const goldLtp   = Number(goldEntry.last_price);
  const silverLtp = Number(silverEntry.last_price);
  const goldCp    = Number(goldEntry.cp);
  const silverCp  = Number(silverEntry.cp);

  if (!goldLtp || !silverLtp) throw new Error("Zero LTP — market may be closed");

  const goldUsd   = (goldLtp   / 10 / usdInr) * TROY_OZ_TO_GRAM;
  const silverUsd = (silverLtp      / usdInr)  / TROY_OZ_TO_KG;

  const goldChg   = goldCp   ? ((goldLtp   - goldCp)   / goldCp)   * 100 : 0;
  const silverChg = silverCp ? ((silverLtp - silverCp) / silverCp) * 100 : 0;

  return {
    goldUsd,
    silverUsd,
    goldInr:    goldLtp,
    silverInr:  silverLtp,
    goldBid:    goldUsd   * 0.9995,
    goldAsk:    goldUsd   * 1.0005,
    silverBid:  silverUsd * 0.999,
    silverAsk:  silverUsd * 1.001,
    goldChange:   goldChg,
    silverChange: silverChg,
    usdInr,
    source: "upstox-mcx",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const cached = await getCachedRates();
    if (cached) {
      return new Response(JSON.stringify({ ...cached, fromCache: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rates = await fetchFreshRates();
    EdgeRuntime.waitUntil(setCachedRates(rates));

    return new Response(JSON.stringify(rates), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
