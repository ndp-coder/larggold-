import { useEffect, useRef } from 'react';
import type { TableRate } from '../hooks/useLiveRates';

interface Props {
  rates: TableRate[];
  lastUpdated: Date;
  loading: boolean;
}

function formatValue(v: number) {
  if (v % 1 === 0) return v.toLocaleString('en-IN');
  return v.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function SkeletonRow() {
  return (
    <div className="flex items-center border-b border-white/10 animate-pulse">
      <div className="flex-1 px-3 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
      </div>
      <div className="w-28 sm:w-44 px-3 sm:px-5 py-3 sm:py-4 text-right">
        <div className="h-7 bg-white/10 rounded" />
      </div>
    </div>
  );
}

function FlashCell({
  value,
  direction,
}: {
  value: number;
  direction?: 'up' | 'down' | 'neutral';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !direction || direction === 'neutral') return;
    el.classList.remove('flash-up', 'flash-down');
    void el.offsetWidth;
    if (direction === 'up') el.classList.add('flash-up');
    else el.classList.add('flash-down');
  }, [value, direction]);

  return (
    <div
      ref={ref}
      className="w-28 sm:w-44 px-3 sm:px-5 py-3 sm:py-4 text-right"
      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(16px, 4vw, 28px)', fontWeight: 800, color: '#ffffff' }}
    >
      {formatValue(value)}
    </div>
  );
}

export default function RatesTable({ rates, lastUpdated, loading }: Props) {
  return (
    <div className="px-3 sm:px-6 pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold uppercase tracking-wider font-montserrat">
              {loading ? 'Fetching Live Rates...' : ''}
            </span>
          </div>
          {!loading && (
            <span className="text-white text-xs font-montserrat opacity-90">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.03)', backdropFilter: 'blur(8px)' }}>
          {loading ? (
            <>
              {[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}
            </>
          ) : (
            rates.map((rate, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center"
                  style={{ borderBottom: i < rates.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
                >
                  <div
                    className="flex-1 px-3 sm:px-5 py-3 sm:py-4 flex items-center uppercase"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(10px, 2.5vw, 13px)', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}
                  >
                    {rate.label}
                  </div>
                  <FlashCell value={rate.value} direction={rate.direction} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
