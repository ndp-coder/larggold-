import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import type { RateAdjustments } from './useLiveRates';

const LARG_GOLD_FIRM = 'LAL RAJA GOLD AND DIAMONDS';

export function useRateAdjustments(isLoggedIn: boolean, firmName: string | null) {
  const [adjustments, setAdjustments] = useState<RateAdjustments>({ x1: 0, x2: 0, y1: 0, y2: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdminFirm = firmName?.trim().toUpperCase() === LARG_GOLD_FIRM.toUpperCase();

  useEffect(() => {
    setIsAdmin(isLoggedIn && isAdminFirm);
  }, [isLoggedIn, isAdminFirm]);

  useEffect(() => {
    if (!isLoggedIn) {
      loadPublicAdjustments();
      return;
    }
    if (isAdminFirm) {
      loadAdminAdjustments();
    } else {
      loadPublicAdjustments();
    }
  }, [isLoggedIn, isAdminFirm]);

  const loadPublicAdjustments = async () => {
    const { data } = await supabase
      .from('rate_adjustments')
      .select('x1, x2, y1, y2')
      .limit(1)
      .maybeSingle();
    if (data) {
      setAdjustments({ x1: Number(data.x1), x2: Number(data.x2), y1: Number(data.y1), y2: Number(data.y2) });
    }
  };

  const loadAdminAdjustments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('rate_adjustments')
      .select('x1, x2, y1, y2')
      .eq('user_id', user.id)
      .maybeSingle();
    if (data) {
      setAdjustments({ x1: Number(data.x1), x2: Number(data.x2), y1: Number(data.y1), y2: Number(data.y2) });
    }
  };

  const saveAdjustments = useCallback(async (vals: RateAdjustments) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase
      .from('rate_adjustments')
      .upsert({ user_id: user.id, ...vals, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (!error) setAdjustments(vals);
    setSaving(false);
  }, []);

  return { adjustments, isAdmin, saving, saveAdjustments };
}
