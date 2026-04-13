import { useEffect, useRef } from 'react';
import type { MetalRates, PriceDirection } from '../hooks/useLiveRates';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  rates: MetalRates | null;
  loading: boolean;
  error: string | null;
  priceDirection: PriceDirection;
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
  const ref = useRef<HTMLSpanElement>(null);

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
    <span ref={ref} className="rounded transition-colors" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: 800, color: '#111' }}>
      {formatted}
    </span>
  );
}

export default function MetalCards({ rates, loading, error, priceDirection }: Props) {
  const font = { fontFamily: 'Montserrat, sans-serif' };

  const rows = rates
    ? [
        {
          label: 'Silver MCX',
          unit: '₹/kg',
          price: rates.silver.price,
          low: rates.silver.low,
          high: rates.silver.high,
          change: rates.silver.change,
          direction: priceDirection.silver,
          decimals: 0,
        },
        {
          label: 'Gold MCX',
          unit: '₹/10g',
          price: rates.gold.price,
          low: rates.gold.low,
          high: rates.gold.high,
          change: rates.gold.change,
          direction: priceDirection.gold,
          decimals: 0,
        },
      ]
    : [];

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center">
      {error && (
        <div className="w-full max-w-2xl mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            {error}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-lg border border-white/40" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.06)' }}>
              {['Metal', 'Price', 'Change', 'Low', 'High'].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-center"
                  style={{ ...font, fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading || !rates ? (
              [0, 1].map((i) => (
                <tr key={i} className="animate-pulse">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded mx-auto" style={{ width: j === 0 ? '80px' : '60px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              rows.map((row, idx) => {
                const up = row.change >= 0;
                return (
                  <tr
                    key={row.label}
                    style={{ borderTop: idx > 0 ? '1px solid rgba(0,0,0,0.07)' : undefined }}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 text-center">
                      <div style={{ ...font, fontSize: '13px', fontWeight: 700, color: '#111' }}>{row.label}</div>
                      <div style={{ ...font, fontSize: '11px', fontWeight: 500, color: '#888' }}>{row.unit}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FlashPrice price={row.price} direction={row.direction} decimals={row.decimals} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: up ? '#e8f8e8' : '#fdeaea', ...font, fontSize: '12px', fontWeight: 700, color: up ? '#2e8b2e' : '#c0392b' }}
                      >
                        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {Math.abs(row.change).toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center" style={{ ...font, fontSize: '14px', fontWeight: 700, color: '#c0392b' }}>
                      {row.decimals === 0 ? row.low.toLocaleString('en-IN') : row.low.toFixed(row.decimals)}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ ...font, fontSize: '14px', fontWeight: 700, color: '#2e8b2e' }}>
                      {row.decimals === 0 ? row.high.toLocaleString('en-IN') : row.high.toFixed(row.decimals)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
