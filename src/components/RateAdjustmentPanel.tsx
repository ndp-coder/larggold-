import { useState, useEffect } from 'react';
import { Save, SlidersHorizontal } from 'lucide-react';
import type { RateAdjustments } from '../hooks/useLiveRates';

interface Props {
  adjustments: RateAdjustments;
  saving: boolean;
  onSave: (vals: RateAdjustments) => void;
}

const VARIABLES: { key: keyof RateAdjustments; label: string; rowLabel: string }[] = [
  { key: 'x1', label: 'X1', rowLabel: 'SILVER IMP (ALL) 15 KG' },
  { key: 'x2', label: 'X2', rowLabel: 'SILVER IMP (ALL)' },
  { key: 'y1', label: 'Y1', rowLabel: 'GOLD 999 IMP (ALL)' },
  { key: 'y2', label: 'Y2', rowLabel: 'GOLD 999 IND (ALL)' },
];

export default function RateAdjustmentPanel({ adjustments, saving, onSave }: Props) {
  const [draft, setDraft] = useState<RateAdjustments>(adjustments);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(adjustments);
  }, [adjustments.x1, adjustments.x2, adjustments.y1, adjustments.y2]);

  const handleChange = (key: keyof RateAdjustments, raw: string) => {
    const num = raw === '' || raw === '-' ? (raw as unknown as number) : Number(raw);
    setDraft(prev => ({ ...prev, [key]: num }));
  };

  const handleSave = () => {
    const clean: RateAdjustments = {
      x1: Number(draft.x1) || 0,
      x2: Number(draft.x2) || 0,
      y1: Number(draft.y1) || 0,
      y2: Number(draft.y2) || 0,
    };
    onSave(clean);
  };

  const isDirty =
    Number(draft.x1) !== adjustments.x1 ||
    Number(draft.x2) !== adjustments.x2 ||
    Number(draft.y1) !== adjustments.y1 ||
    Number(draft.y2) !== adjustments.y2;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl font-bold text-sm font-montserrat transition-all"
          style={{ backgroundColor: '#fcc201', color: '#1a1a1a', border: '2px solid rgba(255,255,255,0.3)' }}
        >
          <SlidersHorizontal size={16} />
          Rate Adjustments
        </button>
      )}

      {open && (
        <div
          className="rounded-2xl shadow-2xl p-5 w-80"
          style={{ background: 'rgba(10,10,10,0.97)', border: '1px solid rgba(252,194,1,0.3)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} style={{ color: '#fcc201' }} />
              <span className="font-bold text-sm font-montserrat text-white">Rate Adjustments</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>

          <p className="text-xs font-opensans mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Enter offset values (+ or −) to adjust each rate row.
          </p>

          <div className="flex flex-col gap-3">
            {VARIABLES.map(({ key, label, rowLabel }) => (
              <div key={key}>
                <label className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-montserrat uppercase tracking-widest" style={{ color: '#fcc201' }}>
                    {label}
                  </span>
                  <span className="text-xs font-opensans" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {rowLabel}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={draft[key] as number | string}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm font-opensans text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(252,194,1,0.25)' }}
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm font-montserrat transition-all"
            style={{
              backgroundColor: isDirty && !saving ? '#fcc201' : 'rgba(252,194,1,0.3)',
              color: isDirty && !saving ? '#1a1a1a' : 'rgba(255,255,255,0.4)',
              cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
            }}
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save & Apply'}
          </button>
        </div>
      )}
    </div>
  );
}
