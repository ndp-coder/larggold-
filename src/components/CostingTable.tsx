import type { CostingRate } from '../hooks/useLiveRates';
import goldImg from '../../public/files_6010405-2026-04-14T09-51-07-651Z-image.png';
import silverImg from '../../public/files_6010405-2026-04-14T09-51-04-678Z-image.png';

interface Props {
  rates: CostingRate[];
  loading: boolean;
}

function GoldBarIcon() {
  return (
    <img
      src={goldImg}
      alt="Gold"
      className="w-10 h-8 sm:w-14 sm:h-10 flex-shrink-0 object-cover rounded"
    />
  );
}

function SilverBarIcon() {
  return (
    <img
      src={silverImg}
      alt="Silver"
      className="w-10 h-8 sm:w-14 sm:h-10 flex-shrink-0 object-cover rounded"
    />
  );
}

function InrIcon() {
  return (
    <svg viewBox="0 0 40 28" className="w-8 h-6 sm:w-10 sm:h-7 flex-shrink-0" fill="none">
      <rect x="2" y="4" width="36" height="20" rx="3" fill="#1a7f4a" stroke="#155f38" strokeWidth="1"/>
      <text x="20" y="19" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ffffff" fontFamily="Arial">₹/$</text>
    </svg>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="animate-pulse">
      <td className="px-3 sm:px-5 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-6 sm:w-10 sm:h-7 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-12 sm:w-16" />
        </div>
      </td>
      <td className="px-2 sm:px-5 py-3 sm:py-4"><div className="h-7 bg-gray-200 rounded mx-auto w-20 sm:w-28" /></td>
      <td className="px-2 sm:px-5 py-3 sm:py-4"><div className="h-7 bg-gray-200 rounded mx-auto w-20 sm:w-28" /></td>
      <td className="px-2 sm:px-5 py-3 sm:py-4 hidden sm:table-cell"><div className="h-5 bg-gray-200 rounded ml-auto w-28" /></td>
    </tr>
  );
}

function fmt(val: number, metal: CostingRate['metal']): string {
  if (metal === 'inr') return val.toFixed(3);
  return Math.round(val).toLocaleString('en-IN');
}

export default function CostingTable({ rates, loading }: Props) {
  return (
    <div className="py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.03)', backdropFilter: 'blur(8px)' }}>
          <div className="px-3 sm:px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Costing</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-0">
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  rates.map((r, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: i < rates.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
                    >
                      <td className="px-3 sm:px-5 py-3 sm:py-4 w-24 sm:w-44">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {r.metal === 'gold' ? <GoldBarIcon /> : r.metal === 'silver' ? <SilverBarIcon /> : <InrIcon />}
                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(11px, 2.5vw, 15px)', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {r.metal === 'gold' ? 'GOLD' : r.metal === 'silver' ? 'SILVER' : 'INR'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-5 py-3 sm:py-4 text-center">
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(16px, 4vw, 28px)', fontWeight: 800, color: '#ffffff' }}>
                          {fmt(r.col1, r.metal)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-5 py-3 sm:py-4 text-center">
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(16px, 4vw, 28px)', fontWeight: 800, color: '#ffffff' }}>
                          {fmt(r.col2, r.metal)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-5 py-3 sm:py-4 text-right hidden sm:table-cell">
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 700, color: '#5CB85C' }}>
                          {fmt(r.high, r.metal)}
                        </span>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 400, color: '#CCCCCC', margin: '0 4px' }}>/</span>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: 700, color: '#D9534F' }}>
                          {fmt(r.low, r.metal)}
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
    </div>
  );
}
