// import { useState, useEffect, useRef } from 'react';

// export interface MetalRates {
//   silver: { price: number; low: number; high: number; change: number };
//   gold: { price: number; low: number; high: number; change: number };
//   inr: { price: number; low: number; high: number; change: number };
// }

// export interface TableRate {
//   label: string;
//   value: number;
//   highlight: boolean;
//   direction?: 'up' | 'down' | 'neutral';
// }

// export interface PriceDirection {
//   gold: 'up' | 'down' | 'neutral';
//   silver: 'up' | 'down' | 'neutral';
//   inr: 'up' | 'down' | 'neutral';
// }

// export interface CostingRate {
//   metal: 'gold' | 'silver';
//   col1: number;
//   col2: number;
//   high: number;
//   low: number;
// }

// // ── Constants ──────────────────────────────────────────────────────────────
// const TROY_OZ_TO_GRAM = 31.1035;
// const TROY_OZ_TO_KG = 32.1507;
// const CIF_GOLD = 3;      // USD/oz freight+insurance
// const CIF_SILVER = 0.15;   // USD/oz freight+insurance
// const IMPORT_DUTY = 0.085;  // 6 % customs + 2.5 % cess (no GST – matches AMS display)

// // ── Price helpers ───────────────────────────────────────────────────────────

// /** Gold IMP: INR per gram — imported, includes CIF */
// function goldImpPerGram(goldUsd: number, usdInr: number): number {
//   return Math.round(((goldUsd + CIF_GOLD) * usdInr / TROY_OZ_TO_GRAM) * (1 + IMPORT_DUTY) * 10) / 10;
// }

// /** Gold IND: INR per gram — domestic/Indian, no CIF */
// function goldIndPerGram(goldUsd: number, usdInr: number): number {
//   return Math.round((goldUsd * usdInr / TROY_OZ_TO_GRAM) * (1 + IMPORT_DUTY) * 10) / 10;
// }

// /** Silver standard: INR per kg */
// function silverPerKg(silverUsd: number, usdInr: number): number {
//   return Math.round((silverUsd + CIF_SILVER) * usdInr * TROY_OZ_TO_KG * (1 + IMPORT_DUTY));
// }

// /** Silver 15 KG bulk lot: INR per kg (slight bulk discount vs standard) */
// function silver15kgPerKg(silverUsd: number, usdInr: number): number {
//   return silverPerKg(silverUsd, usdInr) - 500;
// }

// function getDir(next: number, prev: number): 'up' | 'down' | 'neutral' {
//   if (next > prev) return 'up';
//   if (next < prev) return 'down';
//   return 'neutral';
// }

// // ── Table rates builder ─────────────────────────────────────────────────────
// // Only 4 rows — silver per kg, gold per gram
// function buildTableRates(
//   goldUsd: number, silverUsd: number, usdInr: number,
//   prevGoldUsd?: number, prevSilverUsd?: number,
// ): TableRate[] {
//   const today = new Date();
//   const day = today.getDate();
//   const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();

//   const sDir = prevSilverUsd !== undefined ? getDir(silverUsd, prevSilverUsd) : 'neutral';
//   const gDir = prevGoldUsd !== undefined ? getDir(goldUsd, prevGoldUsd) : 'neutral';

//   return [
//     {
//       label: `SILVER IMP ${day}-${day + 1} ${month} (ALL) 15 KG`,
//       value: silver15kgPerKg(silverUsd, usdInr),   // per kg (bulk rate)
//       highlight: true,
//       direction: sDir,
//     },
//     {
//       label: `SILVER IMP ${day}-${day + 1} ${month} (ALL)`,
//       value: silverPerKg(silverUsd, usdInr),        // per kg
//       highlight: true,
//       direction: sDir,
//     },
//     {
//       label: `GOLD 999 IMP ${day}-${day + 3} ${month} (ALL)`,
//       value: goldImpPerGram(goldUsd, usdInr),       // per gram (imported, with CIF)
//       highlight: false,
//       direction: gDir,
//     },
//     {
//       label: `GOLD 999 IND ${day}-${day + 3} ${month} (ALL)`,
//       value: goldIndPerGram(goldUsd, usdInr),       // per gram (domestic, no CIF)
//       highlight: false,
//       direction: gDir,
//     },
//   ];
// }

// // ── Costing rates builder ───────────────────────────────────────────────────
// function buildCostingRates(goldUsd: number, silverUsd: number, usdInr: number): CostingRate[] {
//   const spkg = silverPerKg(silverUsd, usdInr);
//   const gpg = goldImpPerGram(goldUsd, usdInr);
//   const g10g = Math.round(gpg * 10 * 10) / 10;   // INR / 10g

//   return [
//     {
//       metal: 'gold',
//       col1: g10g,
//       col2: Math.round((g10g + 3.5) * 10) / 10,
//       high: Math.round((g10g + 5.5) * 10) / 10,
//       low: Math.round((g10g - 12) * 10) / 10
//     },
//     {
//       metal: 'silver',
//       col1: spkg,
//       col2: spkg + 33,
//       high: spkg + 89,
//       low: spkg - 2367
//     },
//   ];
// }

// // ── API layer ───────────────────────────────────────────────────────────────
// interface RawRates {
//   goldUsd: number; silverUsd: number; usdInr: number;
//   goldChange: number; silverChange: number;
//   goldBid: number; goldAsk: number;
//   silverBid: number; silverAsk: number;
// }

// const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metal-rates`;
// const EDGE_HEADERS = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` };

// // Real-time INR via fawazahmed0 currency-api (CDN, no CORS issues, updates frequently)
// const INR_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

// async function fetchAllRates(): Promise<RawRates> {
//   const [edgeRes, inrRes] = await Promise.allSettled([
//     fetch(EDGE_URL, { headers: EDGE_HEADERS }),
//     fetch(INR_URL),
//   ]);

//   if (edgeRes.status !== 'fulfilled' || !edgeRes.value.ok) {
//     throw new Error(`Edge function error`);
//   }
//   const data = await edgeRes.value.json();
//   if (data.error) throw new Error(data.error);

//   // Replace stale Frankfurter INR with real-time rate
//   let usdInr: number = data.usdInr;
//   if (inrRes.status === 'fulfilled' && inrRes.value.ok) {
//     const inrData = await inrRes.value.json();
//     if (inrData?.usd?.inr) usdInr = inrData.usd.inr;
//   }

//   return { ...data, usdInr } as RawRates;
// }

// // ── Hook ────────────────────────────────────────────────────────────────────
// export function useLiveRates() {
//   const [metalRates, setMetalRates] = useState<MetalRates | null>(null);
//   const [priceDirection, setPriceDirection] = useState<PriceDirection>({ gold: 'neutral', silver: 'neutral', inr: 'neutral' });
//   const [tableRates, setTableRates] = useState<TableRate[]>([]);
//   const [costingRates, setCostingRates] = useState<CostingRate[]>([]);
//   const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const prevRaw = useRef<RawRates | null>(null);

//   const update = async () => {
//     try {
//       const raw = await fetchAllRates();
//       const prev = prevRaw.current;

//       const goldDir = prev ? getDir(raw.goldUsd, prev.goldUsd) : 'neutral';
//       const silverDir = prev ? getDir(raw.silverUsd, prev.silverUsd) : 'neutral';
//       const inrDir = prev ? getDir(raw.usdInr, prev.usdInr) : 'neutral';
//       const prevInr = prev ? prev.usdInr : raw.usdInr;

//       prevRaw.current = raw;
//       setError(null);
//       setPriceDirection({ gold: goldDir, silver: silverDir, inr: inrDir });

//       setMetalRates({
//         gold: { price: raw.goldUsd, low: raw.goldBid, high: raw.goldAsk, change: raw.goldChange },
//         silver: { price: raw.silverUsd, low: raw.silverBid, high: raw.silverAsk, change: raw.silverChange },
//         inr: {
//           price: raw.usdInr,
//           low: Math.round(raw.usdInr * 0.9997 * 1000) / 1000,
//           high: Math.round(raw.usdInr * 1.0003 * 1000) / 1000,
//           change: ((raw.usdInr - prevInr) / prevInr) * 100,
//         },
//       });

//       setTableRates(buildTableRates(raw.goldUsd, raw.silverUsd, raw.usdInr, prev?.goldUsd, prev?.silverUsd));
//       setCostingRates(buildCostingRates(raw.goldUsd, raw.silverUsd, raw.usdInr));
//       setLastUpdated(new Date());
//       setLoading(false);
//     } catch {
//       setError('Unable to fetch live rates. Retrying...');
//       if (!prevRaw.current) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     update();
//     const interval = setInterval(update, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error };
// }
import { useState, useEffect, useRef } from 'react';

export interface MetalRates {
  silver: { price: number; low: number; high: number; change: number };
  gold: { price: number; low: number; high: number; change: number };
  inr: { price: number; low: number; high: number; change: number };
}

export interface TableRate {
  label: string;
  value: number;
  highlight: boolean;
  direction?: 'up' | 'down' | 'neutral';
}

export interface PriceDirection {
  gold: 'up' | 'down' | 'neutral';
  silver: 'up' | 'down' | 'neutral';
  inr: 'up' | 'down' | 'neutral';
}

export interface CostingRate {
  metal: 'gold' | 'silver';
  col1: number;
  col2: number;
  high: number;
  low: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const TROY_OZ_TO_GRAM = 31.1035;   // grams in one troy oz
const TROY_OZ_TO_KG = 32.1507;     // troy oz in one kg (used as: $/oz × oz/kg × ₹/$ = ₹/kg)

const CIF_GOLD = 3.0;              // USD/oz — freight + insurance for imported gold
const CIF_SILVER = 0.15;           // USD/oz — freight + insurance for imported silver

/**
 * Total import duty on precious metals (post July-2024 budget), compounded:
 *   Basic Customs Duty (BCD)        = 6.00%
 *   Agri Infrastructure Cess (AIDC) = 5.00%  (on BCD base)
 *   Social Welfare Surcharge (SWS)  = 3.50%  (on BCD base)
 *
 *   Effective load ≈ 8.5%  →  multiplier = 1.085
 *
 * GST (3%) is excluded — AMS Bullion displays ex-GST rates.
 */
const IMPORT_DUTY = 0.085;

/**
 * Bulk discount for 15 KG silver lots, in INR per kg.
 * Larger lots have lower handling costs → small price advantage.
 */
const SILVER_15KG_DISCOUNT = 300;

// ── Price helpers ───────────────────────────────────────────────────────────

/** Gold IMP: INR per gram — imported, includes CIF */
function goldImpPerGram(goldUsd: number, usdInr: number): number {
  return Math.round(((goldUsd + CIF_GOLD) * usdInr / TROY_OZ_TO_GRAM) * (1 + IMPORT_DUTY) * 10) / 10;
}

/** Gold IND: INR per gram — domestic/Indian origin, no CIF */
function goldIndPerGram(goldUsd: number, usdInr: number): number {
  return Math.round((goldUsd * usdInr / TROY_OZ_TO_GRAM) * (1 + IMPORT_DUTY) * 10) / 10;
}

/**
 * Silver standard: INR per kg.
 *
 * Formula: (spot + CIF) × usdInr × TROY_OZ_TO_KG × (1 + duty)
 *
 * TROY_OZ_TO_KG here converts $/oz → $/kg
 * (32.1507 troy oz fit in 1 kg, so $/oz × 32.1507 = $/kg)
 */
function silverPerKg(silverUsd: number, usdInr: number): number {
  return Math.round((silverUsd + CIF_SILVER) * usdInr * TROY_OZ_TO_KG * (1 + IMPORT_DUTY));
}

/** Silver 15 KG bulk lot: INR per kg — bulk discount applied */
function silver15kgPerKg(silverUsd: number, usdInr: number): number {
  return silverPerKg(silverUsd, usdInr) - SILVER_15KG_DISCOUNT;
}

function getDir(next: number, prev: number): 'up' | 'down' | 'neutral' {
  if (next > prev) return 'up';
  if (next < prev) return 'down';
  return 'neutral';
}

// ── Table rates builder ─────────────────────────────────────────────────────

function buildTableRates(
  goldUsd: number, silverUsd: number, usdInr: number,
  prevGoldUsd?: number, prevSilverUsd?: number,
): TableRate[] {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  const sDir = prevSilverUsd !== undefined ? getDir(silverUsd, prevSilverUsd) : 'neutral';
  const gDir = prevGoldUsd   !== undefined ? getDir(goldUsd,   prevGoldUsd)   : 'neutral';

  return [
    {
      label: `SILVER IMP ${day}-${day + 2} ${month} (ALL) 15 KG`,
      value: silver15kgPerKg(silverUsd, usdInr),
      highlight: true,
      direction: sDir,
    },
    {
      label: `SILVER IMP ${day}-${day + 2} ${month} (ALL)`,
      value: silverPerKg(silverUsd, usdInr),
      highlight: true,
      direction: sDir,
    },
    {
      label: `GOLD 999 IMP ${day}-${day + 2} ${month} (ALL)`,
      value: goldImpPerGram(goldUsd, usdInr),
      highlight: false,
      direction: gDir,
    },
    {
      label: `GOLD 999 IND ${day}-${day + 2} ${month} (ALL)`,
      value: goldIndPerGram(goldUsd, usdInr),
      highlight: false,
      direction: gDir,
    },
  ];
}

// ── Costing rates builder ───────────────────────────────────────────────────

const GOLD_ASK_SPREAD = 2.0;    // INR per gram — dealer ask spread
const SILVER_ASK_SPREAD = 50;   // INR per kg  — dealer ask spread

function buildCostingRates(goldUsd: number, silverUsd: number, usdInr: number): CostingRate[] {
  const gpg  = goldImpPerGram(goldUsd, usdInr);      // INR per gram
  const g10g = Math.round(gpg * 10 * 10) / 10;       // INR per 10g

  const spkg = silverPerKg(silverUsd, usdInr);        // INR per kg

  // high/low derived from ±0.1% spot move so they scale with price
  const goldHigh   = Math.round(goldImpPerGram(goldUsd * 1.001, usdInr) * 10 * 10) / 10;
  const goldLow    = Math.round(goldImpPerGram(goldUsd * 0.999, usdInr) * 10 * 10) / 10;
  const silverHigh = silverPerKg(silverUsd * 1.001, usdInr);
  const silverLow  = silverPerKg(silverUsd * 0.999, usdInr);

  return [
    {
      metal: 'gold',
      col1:  g10g,
      col2:  Math.round((g10g + GOLD_ASK_SPREAD * 10) * 10) / 10,
      high:  goldHigh,
      low:   goldLow,
    },
    {
      metal: 'silver',
      col1:  spkg,
      col2:  spkg + SILVER_ASK_SPREAD,
      high:  silverHigh,
      low:   silverLow,
    },
  ];
}

// ── API layer ───────────────────────────────────────────────────────────────

interface RawRates {
  goldUsd: number; silverUsd: number; usdInr: number;
  goldChange: number; silverChange: number;
  goldBid: number; goldAsk: number;
  silverBid: number; silverAsk: number;
}

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metal-rates`;
const EDGE_HEADERS = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` };

const INR_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

async function fetchAllRates(): Promise<RawRates> {
  const [edgeRes, inrRes] = await Promise.allSettled([
    fetch(EDGE_URL, { headers: EDGE_HEADERS }),
    fetch(INR_URL),
  ]);

  if (edgeRes.status !== 'fulfilled' || !edgeRes.value.ok) {
    throw new Error('Edge function unavailable');
  }

  const data = await edgeRes.value.json();
  if (data.error) throw new Error(data.error);

  // Prefer real-time CDN INR rate; fall back to edge function's rate
  let usdInr: number = data.usdInr;
  if (inrRes.status === 'fulfilled' && inrRes.value.ok) {
    const inrData = await inrRes.value.json();
    if (typeof inrData?.usd?.inr === 'number') {
      usdInr = inrData.usd.inr;
    }
  }

  return { ...data, usdInr } as RawRates;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useLiveRates() {
  const [metalRates, setMetalRates] = useState<MetalRates | null>(null);
  const [priceDirection, setPriceDirection] = useState<PriceDirection>({ gold: 'neutral', silver: 'neutral', inr: 'neutral' });
  const [tableRates, setTableRates] = useState<TableRate[]>([]);
  const [costingRates, setCostingRates] = useState<CostingRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRaw = useRef<RawRates | null>(null);

  const update = async () => {
    try {
      const raw = await fetchAllRates();
      const prev = prevRaw.current;

      const goldDir   = prev ? getDir(raw.goldUsd,   prev.goldUsd)   : 'neutral';
      const silverDir = prev ? getDir(raw.silverUsd, prev.silverUsd) : 'neutral';
      const inrDir    = prev ? getDir(raw.usdInr,    prev.usdInr)    : 'neutral';
      const prevInr   = prev?.usdInr ?? raw.usdInr;

      prevRaw.current = raw;
      setError(null);
      setPriceDirection({ gold: goldDir, silver: silverDir, inr: inrDir });

      setMetalRates({
        gold:   { price: raw.goldUsd,   low: raw.goldBid,   high: raw.goldAsk,   change: raw.goldChange },
        silver: { price: raw.silverUsd, low: raw.silverBid, high: raw.silverAsk, change: raw.silverChange },
        inr: {
          price:  raw.usdInr,
          low:    Math.round(raw.usdInr * 0.9997 * 1000) / 1000,
          high:   Math.round(raw.usdInr * 1.0003 * 1000) / 1000,
          change: ((raw.usdInr - prevInr) / prevInr) * 100,
        },
      });

      setTableRates(buildTableRates(raw.goldUsd, raw.silverUsd, raw.usdInr, prev?.goldUsd, prev?.silverUsd));
      setCostingRates(buildCostingRates(raw.goldUsd, raw.silverUsd, raw.usdInr));
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Unable to fetch live rates (${msg}). Retrying...`);
      if (!prevRaw.current) setLoading(false);
    }
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error };
}