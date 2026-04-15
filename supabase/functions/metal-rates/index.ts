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

async function getCacheEntry() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("rates_cache")
    .select("data, fetched_at")
    .eq("id", CACHE_KEY)
    .maybeSingle();
  return data ?? null;
}

async function setCachedRates(rates: object) {
  const supabase = getSupabase();
  await supabase
    .from("rates_cache")
    .upsert({ id: CACHE_KEY, data: rates, fetched_at: new Date().toISOString() });
}

interface McxInstrument {
  instrument_key: string;
  trading_symbol: string;
  expiry: number;
  instrument_type: string;
  asset_symbol: string;
  underlying_symbol: string;
  name: string;
  segment: string;
  price_quote_unit: string;
}

let cachedInstruments: McxInstrument[] | null = null;
let instrumentCacheTime = 0;

async function fetchAndDecompressGz(url: string): Promise<McxInstrument[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Instruments fetch failed (${url}): ${res.status}`);

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

  return JSON.parse(new TextDecoder().decode(merged)) as McxInstrument[];
}

async function getAllInstruments(): Promise<McxInstrument[]> {
  const now = Date.now();
  if (cachedInstruments && now - instrumentCacheTime < 6 * 60 * 60 * 1000) {
    return cachedInstruments;
  }

  const [mcx, nse] = await Promise.all([
    fetchAndDecompressGz("https://assets.upstox.com/market-quote/instruments/exchange/MCX.json.gz"),
    fetchAndDecompressGz("https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz"),
  ]);

  cachedInstruments = [...mcx, ...nse];
  instrumentCacheTime = now;
  return cachedInstruments;
}

function getFrontMonthKey(instruments: McxInstrument[], segment: string, symbol: string): string {
  const now = Date.now();
  const futures = instruments.filter(
    (i) =>
      (i.asset_symbol === symbol || i.underlying_symbol === symbol) &&
      i.instrument_type === "FUT" &&
      i.segment === segment &&
      i.expiry > now,
  );
  if (!futures.length) throw new Error(`No active ${segment} FUT for ${symbol}`);
  futures.sort((a, b) => a.expiry - b.expiry);
  return futures[0].instrument_key;
}

async function fetchUsdInrFreeApi(): Promise<number> {
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
  throw new Error("USD/INR free API unavailable");
}

function getNextMarketOpen(): string {
  const now = new Date();
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + IST_OFFSET);

  const day = istNow.getUTCDay();
  const hour = istNow.getUTCHours();
  const minute = istNow.getUTCMinutes();

  const currentMinutes = hour * 60 + minute;
  const openMinutes = 9 * 60;
  const closeMinutes = 23 * 60 + 30;

  let nextOpenIST: Date;

  if (day === 0) {
    nextOpenIST = new Date(istNow);
    nextOpenIST.setUTCDate(istNow.getUTCDate() + 1);
    nextOpenIST.setUTCHours(9, 0, 0, 0);
  } else if (day === 6) {
    nextOpenIST = new Date(istNow);
    nextOpenIST.setUTCDate(istNow.getUTCDate() + 2);
    nextOpenIST.setUTCHours(9, 0, 0, 0);
  } else if (currentMinutes >= closeMinutes) {
    nextOpenIST = new Date(istNow);
    if (day === 5) {
      nextOpenIST.setUTCDate(istNow.getUTCDate() + 3);
    } else {
      nextOpenIST.setUTCDate(istNow.getUTCDate() + 1);
    }
    nextOpenIST.setUTCHours(9, 0, 0, 0);
  } else if (currentMinutes < openMinutes) {
    nextOpenIST = new Date(istNow);
    nextOpenIST.setUTCHours(9, 0, 0, 0);
  } else {
    return "";
  }

  const utcTime = new Date(nextOpenIST.getTime() - IST_OFFSET);
  return utcTime.toISOString();
}

async function fetchFreshRates() {
  const instruments = await getAllInstruments();

  const goldKey   = getFrontMonthKey(instruments, "MCX_FO", "GOLD");
  const silverKey = getFrontMonthKey(instruments, "MCX_FO", "SILVER");

  let usdinrKey: string | null = null;
  try {
    usdinrKey = getFrontMonthKey(instruments, "NCD_FO", "USDINR");
  } catch { /* no active USDINR contract */ }

  const instrumentKeys = [goldKey, silverKey];
  if (usdinrKey) instrumentKeys.push(usdinrKey);

  const ltpUrl = `https://api.upstox.com/v3/market-quote/ltp?instrument_key=${instrumentKeys.map(encodeURIComponent).join(",")}`;
  const ltpRes = await fetch(ltpUrl, { headers: UPSTOX_HEADERS, signal: AbortSignal.timeout(5000) });
  if (!ltpRes.ok) throw new Error(`LTP fetch failed: ${ltpRes.status}`);
  const ltpData = await ltpRes.json();

  const entries = Object.values(ltpData?.data ?? {}) as Array<{
    last_price: number; cp: number; instrument_token: string;
  }>;

  const goldEntry   = entries.find((e) => e.instrument_token === goldKey);
  const silverEntry = entries.find((e) => e.instrument_token === silverKey);
  const usdinrEntry = usdinrKey ? entries.find((e) => e.instrument_token === usdinrKey) : null;

  if (!goldEntry || !silverEntry) throw new Error("LTP data missing for GOLD or SILVER");

  const goldLtp   = Number(goldEntry.last_price);
  const silverLtp = Number(silverEntry.last_price);
  const goldCp    = Number(goldEntry.cp);
  const silverCp  = Number(silverEntry.cp);
  const usdinrLtp = usdinrEntry ? Number(usdinrEntry.last_price) : 0;
  const usdinrCp  = usdinrEntry ? Number(usdinrEntry.cp) : 0;

  if (!goldLtp || !silverLtp) throw new Error("Zero LTP — market is closed");

  let usdInr: number;
  let inrSource: string;

  if (usdinrLtp > 0) {
    usdInr = usdinrLtp;
    inrSource = "upstox-ncd";
  } else {
    usdInr = await fetchUsdInrFreeApi();
    inrSource = "free-api-fallback";
  }

  const goldUsd   = (goldLtp   / 10 / usdInr) * TROY_OZ_TO_GRAM/1,05;
  const silverUsd = (silverLtp      / usdInr)  / TROY_OZ_TO_KG/1.05;

  const goldChg   = goldCp   ? ((goldLtp   - goldCp)   / goldCp)   * 100 : 0;
  const silverChg = silverCp ? ((silverLtp - silverCp) / silverCp) * 100 : 0;
  const usdinrChg = usdinrCp ? ((usdinrLtp - usdinrCp) / usdinrCp) * 100 : 0;

  return {
    goldUsd,
    silverUsd,
    goldInr:    goldLtp,
    silverInr:  silverLtp,
    goldBid:    goldUsd,
    goldAsk:    goldUsd,
    silverBid:  silverUsd,
    silverAsk:  silverUsd,
    goldChange:   goldChg,
    silverChange: silverChg,
    usdInr,
    usdInrChange: usdinrChg,
    usdInrCp: usdinrCp,
    inrSource,
    source: "upstox-mcx",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const cacheEntry = await getCacheEntry();
    const now = Date.now();

    if (cacheEntry) {
      const age = now - new Date(cacheEntry.fetched_at).getTime();
      if (age <= CACHE_TTL_MS) {
        return new Response(JSON.stringify({ ...cacheEntry.data, fromCache: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    try {
      const rates = await fetchFreshRates();
      EdgeRuntime.waitUntil(setCachedRates(rates));
      return new Response(JSON.stringify(rates), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (fetchErr) {
      if (cacheEntry?.data) {
        const nextOpen = getNextMarketOpen();
        const payload = {
          ...cacheEntry.data,
          fromCache: true,
          marketClosed: true,
          marketClosedReason: String(fetchErr),
          nextMarketOpen: nextOpen || null,
          cachedAt: cacheEntry.fetched_at,
        };
        return new Response(JSON.stringify(payload), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw fetchErr;
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
