import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './hooks/lib/supabase';

supabase.from('rates_cache').delete().eq('id', 'metal-rates-v1').then(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
