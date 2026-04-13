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
    <div className="flex items-center border-b border-gray-200 animate-pulse">
      <div className="flex-1 px-5 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="w-44 px-5 py-4 text-right">
        <div className="h-7 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function FlashCell({
  value,
  direction,
}: {
  value: number;
  highlight?: boolean;
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
      className="w-44 px-5 py-4 text-right"
      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: 800, color: '#111111' }}
    >
      {formatValue(value)}
    </div>
  );
}

export default function RatesTable({ rates, lastUpdated, loading }: Props) {
  return (
    <div
      className="px-6 pb-10"
      style={{ background: 'linear-gradient(180deg, #b8960c 0%, #c9a830 40%, #b8960c 100%)' }}
    >
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

        
        <div className="bg-white overflow-hidden" style={{ border: '1px solid #cccccc' }}>
          {loading ? (
            <>
              {[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}
            </>
          ) : (
            rates.map((rate, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{ borderBottom: i < rates.length - 1 ? '1px solid #cccccc' : 'none' }}
              >
                <div
                  className="flex-1 px-5 py-4 uppercase"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: '#333333', letterSpacing: '0.04em' }}
                >
                  {rate.label}
                </div>
                <FlashCell value={rate.value} direction={rate.direction} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
