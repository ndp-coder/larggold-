import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

const TROY_OZ_TO_GRAM = 31.1035;
const TROY_OZ_TO_KG   = 32.1507;

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
let cacheTime = 0;

async function getMcxInstruments(): Promise<McxInstrument[]> {
  const now = Date.now();
  if (cachedInstruments && now - cacheTime < 6 * 60 * 60 * 1000) {
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
  cacheTime = now;
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

interface MetalsResult {
  goldUsd: number; silverUsd: number;
  goldBid: number; goldAsk: number;
  silverBid: number; silverAsk: number;
  goldChange: number; silverChange: number;
  source: string;
}

async function fetchMetalsViaUpstox(usdInr: number): Promise<MetalsResult> {
  const instruments = await getMcxInstruments();

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
    goldBid:    goldUsd   * 0.9995,
    goldAsk:    goldUsd   * 1.0005,
    silverBid:  silverUsd * 0.999,
    silverAsk:  silverUsd * 1.001,
    goldChange:   goldChg,
    silverChange: silverChg,
    source: "upstox-mcx",
  };
}

async function fetchMetalsFallback(): Promise<Omit<MetalsResult, "source">> {
  const [goldRes, silverRes] = await Promise.all([
    fetch("https://api.gold-api.com/price/XAU", { signal: AbortSignal.timeout(5000) }),
    fetch("https://api.gold-api.com/price/XAG", { signal: AbortSignal.timeout(5000) }),
  ]);
  if (!goldRes.ok || !silverRes.ok) {
    throw new Error(`gold-api error: ${goldRes.status}/${silverRes.status}`);
  }
  const [g, s] = await Promise.all([goldRes.json(), silverRes.json()]);
  const goldUsd   = Number(g.price);
  const silverUsd = Number(s.price);
  if (!goldUsd || !silverUsd) throw new Error("Invalid gold-api data");
  return {
    goldUsd,
    silverUsd,
    goldBid:    typeof g.bid === "number" ? g.bid : goldUsd   * 0.9995,
    goldAsk:    typeof g.ask === "number" ? g.ask : goldUsd   * 1.0005,
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
    const usdInr = await fetchUsdInr();

    let metals: Omit<MetalsResult, "source"> & { source?: string };

    try {
      metals = await fetchMetalsViaUpstox(usdInr);
    } catch (upstoxErr) {
      console.warn("Upstox failed, using fallback:", String(upstoxErr));
      metals = { ...(await fetchMetalsFallback()), source: "gold-api-fallback" };
    }

    return new Response(JSON.stringify({ ...metals, usdInr }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
