import type { CostingRate } from '../hooks/useLiveRates';

interface Props {
  rates: CostingRate[];
  loading: boolean;
}

function GoldBarIcon() {
  return (
    <svg viewBox="0 0 40 28" className="w-10 h-7" fill="none">
      <rect x="2" y="8" width="36" height="14" rx="2" fill="#b8860b" stroke="#8B6914" strokeWidth="1"/>
      <rect x="6" y="4" width="28" height="10" rx="2" fill="#c9a830" stroke="#b8860b" strokeWidth="1"/>
      <rect x="10" y="0" width="20" height="8" rx="1.5" fill="#d4a843" stroke="#c9a830" strokeWidth="1"/>
    </svg>
  );
}

function SilverBarIcon() {
  return (
    <svg viewBox="0 0 40 28" className="w-10 h-7" fill="none">
      <rect x="2" y="8" width="36" height="14" rx="2" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1"/>
      <rect x="6" y="4" width="28" height="10" rx="2" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1"/>
      <rect x="10" y="0" width="20" height="8" rx="1.5" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1"/>
    </svg>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid #cccccc' }} className="animate-pulse">
      <td className="px-5 py-4 w-44">
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-8 bg-gray-200 rounded mx-auto w-28" /></td>
      <td className="px-5 py-4"><div className="h-8 bg-gray-200 rounded mx-auto w-28" /></td>
      <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded ml-auto w-36" /></td>
    </tr>
  );
}

export default function CostingTable({ rates, loading }: Props) {
  return (
    <div className="py-8 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Outer border matching AMS */}
        <div style={{ border: '1px solid #cccccc' }}>
          {/* COSTING header */}
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #cccccc' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 900, color: '#333333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Costing</span>
          </div>

          <table className="w-full">
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                rates.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: i < rates.length - 1 ? '1px solid #cccccc' : 'none' }}
                  >
                    <td className="px-5 py-4 w-44">
                      <div className="flex items-center gap-3">
                        {r.metal === 'gold' ? <GoldBarIcon /> : <SilverBarIcon />}
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 900, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {r.metal === 'gold' ? 'GOLD' : 'SILVER'}
                        </span>
                      </div>
                    </td>
                    {/* col1 */}
                    <td className="px-5 py-4 text-center">
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: 800, color: '#111111' }}>
                        {r.col1.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: 800, color: '#111111' }}>
                        {r.col2.toLocaleString('en-IN')}
                      </span>
                    </td>
                    {/* High (green) / Low (red) */}
                    <td className="px-5 py-4 text-right">
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 700, color: '#5CB85C' }}>
                        {r.high.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 400, color: '#CCCCCC', margin: '0 4px' }}>/</span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 700, color: '#D9534F' }}>
                        {r.low.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
