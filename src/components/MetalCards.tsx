import { useEffect, useRef } from 'react';
import type { MetalRates, PriceDirection } from '../hooks/useLiveRates';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  rates: MetalRates | null;
  loading: boolean;
  error: string | null;
  priceDirection: PriceDirection;
}

function Skeleton() {
  return (
    <div className="bg-white rounded p-4 flex items-center gap-3 animate-pulse border border-gray-200">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
        <div className="h-7 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

function FlashPrice({
  price,
  direction,
  decimals,
}: {
  price: number;
  direction: 'up' | 'down' | 'neutral';
  decimals: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (direction === 'neutral') return;
    el.classList.remove('flash-up', 'flash-down');
    void el.offsetWidth;
    if (direction === 'up') el.classList.add('flash-up');
    else if (direction === 'down') el.classList.add('flash-down');
  }, [price, direction]);

  const formatted = decimals === 0
    ? price.toLocaleString('en-IN')
    : price.toFixed(decimals);

  return (
    <div ref={ref} className="rounded px-1 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#000000', lineHeight: 1.1 }}>
      {formatted}
    </div>
  );
}

function Card({
  label,
  price,
  low,
  high,
  change,
  direction,
  decimals = 2,
}: {
  label: string;
  price: number;
  low: number;
  high: number;
  change: number;
  direction: 'up' | 'down' | 'neutral';
  decimals?: number;
}) {
  const up = change >= 0;
  return (
    <div className="rounded p-3 sm:p-4 flex items-start border border-white/30" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)' }}>
      <div className="min-w-0">
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(10px, 2.5vw, 14px)', fontWeight: 900, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
        <div className="flex items-center gap-2">
          <FlashPrice price={price} direction={direction} decimals={decimals} />
          <div
            className="flex items-center gap-0.5"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, color: up ? '#5CB85C' : '#D9534F' }}
          >
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>
        <div style={{ marginTop: '2px' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: '#D9534F' }}>
            {decimals === 0 ? low.toLocaleString('en-IN') : low.toFixed(decimals)}
          </span>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 400, color: '#CCCCCC', margin: '0 4px' }}>|</span>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: '#5CB85C' }}>
            {decimals === 0 ? high.toLocaleString('en-IN') : high.toFixed(decimals)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MetalCards({ rates, loading, error, priceDirection }: Props) {
  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6">
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            {error}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
        {loading || !rates ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <Card
              label="SILVER MCX (₹/kg)"
              price={rates.silver.price}
              low={rates.silver.low}
              high={rates.silver.high}
              change={rates.silver.change}
              direction={priceDirection.silver}
              decimals={0}
            />
            <Card
              label="GOLD MCX (₹/10g)"
              price={rates.gold.price}
              low={rates.gold.low}
              high={rates.gold.high}
              change={rates.gold.change}
              direction={priceDirection.gold}
              decimals={0}
            />
          </>
        )}
      </div>
    </div>
  );
}
