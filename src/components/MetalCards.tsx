import { useEffect, useRef } from 'react';
import type { MetalRates, PriceDirection } from '../hooks/useLiveRates';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  rates: MetalRates | null;
  loading: boolean;
  error: string | null;
  priceDirection: PriceDirection;
}

function SilverIcon() {
  return (
    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-13 h-13" fill="none">
        {/* Sparkle top-left */}
        <path d="M10 10 L11.5 13 L13 10 L11.5 7 Z" fill="#b0b8c8" opacity="0.9"/>
        <path d="M8 11.5 L11.5 13 L15 11.5 L11.5 10 Z" fill="#c8d0e0" opacity="0.9"/>
        {/* Bottom bar */}
        <rect x="7" y="38" width="50" height="13" rx="2.5" fill="#9aa5b4" stroke="#7a8797" strokeWidth="1"/>
        <rect x="7" y="38" width="50" height="5" rx="2.5" fill="#b8c3d0"/>
        {/* Middle bar */}
        <rect x="11" y="28" width="42" height="13" rx="2.5" fill="#b0bbc8" stroke="#8a9aaa" strokeWidth="1"/>
        <rect x="11" y="28" width="42" height="5" rx="2.5" fill="#ccd5e0"/>
        {/* Top bar */}
        <rect x="16" y="18" width="32" height="13" rx="2.5" fill="#c8d2de" stroke="#a0acba" strokeWidth="1"/>
        <rect x="16" y="18" width="32" height="5" rx="2.5" fill="#dde4ec"/>
        {/* Sparkle top-right */}
        <path d="M52 12 L53 14.5 L54 12 L53 9.5 Z" fill="#a0aabb" opacity="0.8"/>
        <path d="M50.5 13 L53 14.5 L55.5 13 L53 11.5 Z" fill="#b8c2d0" opacity="0.8"/>
        {/* Shine lines on top bar */}
        <line x1="20" y1="22" x2="44" y2="22" stroke="#e8eef4" strokeWidth="1" opacity="0.7"/>
      </svg>
    </div>
  );
}

function GoldIcon() {
  return (
    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-13 h-13" fill="none">
        {/* Glow */}
        <ellipse cx="32" cy="52" rx="22" ry="5" fill="#e8a000" opacity="0.2"/>
        {/* Bottom bar */}
        <rect x="8" y="38" width="48" height="13" rx="2.5" fill="#b8860b" stroke="#8B6508" strokeWidth="1"/>
        <rect x="8" y="38" width="48" height="5" rx="2.5" fill="#d4a020"/>
        {/* Middle bar */}
        <rect x="13" y="27" width="38" height="13" rx="2.5" fill="#c9940e" stroke="#9a7008" strokeWidth="1"/>
        <rect x="13" y="27" width="38" height="5" rx="2.5" fill="#e0b030"/>
        {/* Top bar */}
        <rect x="19" y="16" width="26" height="13" rx="2.5" fill="#d4a020" stroke="#a87c10" strokeWidth="1"/>
        <rect x="19" y="16" width="26" height="5" rx="2.5" fill="#ecc040"/>
        {/* Shine lines */}
        <line x1="23" y1="20" x2="41" y2="20" stroke="#f5d060" strokeWidth="1" opacity="0.8"/>
        <line x1="17" y1="31" x2="47" y2="31" stroke="#ecca50" strokeWidth="1" opacity="0.6"/>
        {/* Sun rays top */}
        <line x1="32" y1="4" x2="32" y2="9" stroke="#f0c030" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="40" y1="6" x2="38" y2="10" stroke="#f0c030" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="24" y1="6" x2="26" y2="10" stroke="#f0c030" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="46" y1="10" x2="43" y2="13" stroke="#f0c030" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
        <line x1="18" y1="10" x2="21" y2="13" stroke="#f0c030" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      </svg>
    </div>
  );
}

function RupeeIcon() {
  return (
    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-13 h-13" fill="none">
        {/* Bag body */}
        <ellipse cx="33" cy="40" rx="18" ry="17" fill="#c9780a" stroke="#9a5a08" strokeWidth="1.2"/>
        <ellipse cx="33" cy="39" rx="18" ry="16" fill="#e08820"/>
        {/* Bag tie */}
        <rect x="28" y="20" width="10" height="6" rx="1.5" fill="#b06e08"/>
        {/* Bag opening */}
        <ellipse cx="33" cy="20" rx="8" ry="4" fill="#c87810" stroke="#9a5a08" strokeWidth="1"/>
        {/* Highlight */}
        <ellipse cx="27" cy="33" rx="5" ry="7" fill="#f0a030" opacity="0.4"/>
        {/* Rupee symbol */}
        <text x="33" y="47" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff5e0" fontFamily="Arial" opacity="0.95">₹</text>
        {/* Coins at bottom */}
        <ellipse cx="20" cy="57" rx="5" ry="3" fill="#d4a020" stroke="#a87c10" strokeWidth="0.8"/>
        <ellipse cx="32" cy="59" rx="5" ry="3" fill="#c9940e" stroke="#9a7008" strokeWidth="0.8"/>
        <ellipse cx="44" cy="57" rx="5" ry="3" fill="#d4a020" stroke="#a87c10" strokeWidth="0.8"/>
      </svg>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-white rounded p-4 flex items-center gap-3 animate-pulse border border-gray-200">
      <div className="w-14 h-14 bg-gray-200 rounded flex-shrink-0" />
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
    <div ref={ref} className="rounded px-1 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: 800, color: '#000000', lineHeight: 1.1 }}>
      {formatted}
    </div>
  );
}

function Card({
  icon,
  label,
  price,
  low,
  high,
  change,
  direction,
  decimals = 2,
}: {
  icon: React.ReactNode;
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
    <div className="bg-white rounded p-4 flex items-start gap-3 border border-gray-200">
      {icon}
      <div className="min-w-0">
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
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
        {/* Low (red) | High (green) */}
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
    <div
      className="py-10 px-6"
      style={{ background: 'linear-gradient(180deg, #b8960c 0%, #c9a830 40%, #b8960c 100%)' }}
    >
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            {error}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading || !rates ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <Card
              icon={<SilverIcon />}
              label="SILVER MCX (₹/kg)"
              price={rates.silver.price}
              low={rates.silver.low}
              high={rates.silver.high}
              change={rates.silver.change}
              direction={priceDirection.silver}
              decimals={0}
            />
            <Card
              icon={<GoldIcon />}
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
