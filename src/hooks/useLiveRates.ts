import { useState, useEffect, useRef } from 'react';

export interface MetalRates {
  silver: { price: number; low: number; high: number; change: number };
  gold:   { price: number; low: number; high: number; change: number };
  inr:    { price: number; low: number; high: number; change: number };
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
  metal: 'gold' | 'silver' | 'inr';
  col1: number;
  col2: number;
  high: number;
  low: number;
}

// ── Price helpers ───────────────────────────────────────────────────────────

function getDir(next: number, prev: number): 'up' | 'down' | 'neutral' {
  if (next > prev) return 'up';
  if (next < prev) return 'down';
  return 'neutral';
}

// ── Table rates builder ─────────────────────────────────────────────────────

function buildTableRates(
  goldInr: number, silverInr: number,
  prevGoldInr?: number, prevSilverInr?: number,
): TableRate[] {
  const sDir = prevSilverInr !== undefined ? getDir(silverInr, prevSilverInr) : 'neutral';
  const gDir = prevGoldInr   !== undefined ? getDir(goldInr,   prevGoldInr)   : 'neutral';

  const goldPrice   = Math.round((goldInr   * 1.02)/10);
  const silverPrice = Math.round((silverInr * 1.025));

  return [
    {
      label:     'SILVER IMP (ALL) 15 KG',
      value:     silverPrice,
      highlight: true,
      direction: sDir,
    },
    {
      label:     'SILVER IMP (ALL)',
      value:     silverPrice,
      highlight: true,
      direction: sDir,
    },
    {
      label:     'GOLD 999 IMP (ALL)',
      value:     goldPrice,
      highlight: false,
      direction: gDir,
    },
    {
      label:     'GOLD 999 IND (ALL)',
      value:     goldPrice,
      highlight: false,
      direction: gDir,
    },
  ];
}

// ── Costing rates builder ───────────────────────────────────────────────────


function buildCostingRates(
  goldInr: number,
  silverInr: number,
  usdInr: number,
): CostingRate[] {
  const goldWithPremium   = Math.round(((goldInr   * 1.02)));
  const silverWithPremium = Math.round(((silverInr * 1.025)));

  return [
    {
      metal: 'gold',
      col1:  Math.round(goldInr),
      col2:  goldWithPremium,
      high:  Math.round(goldWithPremium   * 1.001),
      low:   Math.round(goldWithPremium   * 0.999),
    },
    {
      metal: 'silver',
      col1:  Math.round(silverInr),
      col2:  silverWithPremium,
      high:  Math.round(silverWithPremium * 1.001),
      low:   Math.round(silverWithPremium * 0.999),
    },
    {
      metal: 'inr',
      col1:  Math.round(usdInr * 1000) / 1000,
      col2:  Math.round(usdInr * 1.0005 * 1000) / 1000,
      high:  Math.round(usdInr * 1.001 * 1000) / 1000,
      low:   Math.round(usdInr * 0.999 * 1000) / 1000,
    },
  ];
}

// ── API layer ───────────────────────────────────────────────────────────────

interface RawRates {
  goldUsd: number; silverUsd: number;
  goldInr: number; silverInr: number;
  usdInr: number;
  goldChange: number; silverChange: number;
  goldBid: number; goldAsk: number;
  silverBid: number; silverAsk: number;
}

const EDGE_URL     = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metal-rates`;
const EDGE_HEADERS = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` };

async function fetchAllRates(): Promise<RawRates> {
  const res = await fetch(EDGE_URL, { headers: EDGE_HEADERS });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  if (!res.ok) throw new Error('Edge function unavailable');
  return data as RawRates;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useLiveRates() {
  const [metalRates, setMetalRates]       = useState<MetalRates | null>(null);
  const [priceDirection, setPriceDirection] = useState<PriceDirection>({ gold: 'neutral', silver: 'neutral', inr: 'neutral' });
  const [tableRates, setTableRates]       = useState<TableRate[]>([]);
  const [costingRates, setCostingRates]   = useState<CostingRate[]>([]);
  const [lastUpdated, setLastUpdated]     = useState<Date>(new Date());
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const prevRaw = useRef<RawRates | null>(null);

  const update = async () => {
    try {
      const raw  = await fetchAllRates();
      const prev = prevRaw.current;

      const goldDir   = prev ? getDir(raw.goldInr,  prev.goldInr)  : 'neutral';
      const silverDir = prev ? getDir(raw.silverInr, prev.silverInr) : 'neutral';
      const inrDir    = prev ? getDir(raw.usdInr,   prev.usdInr)   : 'neutral';
      const prevInr   = prev?.usdInr ?? raw.usdInr;

      prevRaw.current = raw;
      setError(null);
      setPriceDirection({ gold: goldDir, silver: silverDir, inr: inrDir });

      setMetalRates({
        gold: {
          price:  raw.goldInr,
          low:    Math.round(raw.goldInr * 0.9995 * 10) / 10,
          high:   Math.round(raw.goldInr * 1.0005 * 10) / 10,
          change: raw.goldChange,
        },
        silver: {
          price:  raw.silverInr,
          low:    Math.round(raw.silverInr * 0.999),
          high:   Math.round(raw.silverInr * 1.001),
          change: raw.silverChange,
        },
        inr: {
          price:  raw.usdInr,
          low:    Math.round(raw.usdInr * 0.9997 * 1000) / 1000,
          high:   Math.round(raw.usdInr * 1.0003 * 1000) / 1000,
          change: ((raw.usdInr - prevInr) / prevInr) * 100,
        },
      });

      setTableRates(buildTableRates(raw.goldInr, raw.silverInr, prev?.goldInr, prev?.silverInr));
      setCostingRates(buildCostingRates(raw.goldInr, raw.silverInr, raw.usdInr));
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
