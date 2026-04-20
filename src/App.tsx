import { useState, useEffect } from 'react';
import Header from './components/Header';
import MetalCards from './components/MetalCards';
import RatesTable from './components/RatesTable';
import CostingTable from './components/CostingTable';
import Footer from './components/Footer';
import RateAdjustmentPanel from './components/RateAdjustmentPanel';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { useLiveRates } from './hooks/useLiveRates';
import { useRateAdjustments } from './hooks/useRateAdjustments';
import { supabase } from './hooks/lib/supabase';

const bgImg = '/files_6010405-2026-04-14T11-02-56-013Z-image.png';

export type Page = 'home' | 'about' | 'contact' | 'login' | 'privacy';

const pathToPage: Record<string, Page> = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/login': 'login',
  '/privacy-policy': 'privacy',
};

const pageToPath: Record<Page, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  login: '/login',
  privacy: '/privacy-policy',
};

function getPageFromPath(): Page {
  return pathToPage[window.location.pathname] ?? 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromPath);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firmName, setFirmName] = useState<string | null>(null);

  const { adjustments, isAdmin, saving, saveAdjustments } = useRateAdjustments(isLoggedIn, firmName);
  const { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error, marketClosed, nextMarketOpen } = useLiveRates(adjustments);

  const navigate = (p: Page) => {
    const path = pageToPath[p];
    window.history.pushState(null, '', path);
    setPage(p);
  };

  useEffect(() => {
    const onPop = () => setPage(getPageFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) loadFirmName(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        loadFirmName(session.user.id);
      } else {
        setFirmName(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadFirmName = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('firm_name')
      .eq('id', userId)
      .maybeSingle();
    setFirmName(data?.firm_name ?? null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setFirmName(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#002a0a',
      }}
    >
      <Header page={page} setPage={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {page === 'home' && (
        <main className="flex-1" id="rates">
          {marketClosed && (
            <div className="relative border-b border-white/20 overflow-hidden bg-black/30">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 shadow-sm" />
                <p className="text-sm text-white font-medium drop-shadow">
                  MCX market is currently closed — showing last available rates.
                  {nextMarketOpen && (
                    <span className="font-normal ml-1 text-white/90">
                      Reopens at{' '}
                      <span className="font-semibold text-yellow-300">
                        {new Date(nextMarketOpen).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })} IST
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          <MetalCards rates={metalRates} loading={loading} error={error} priceDirection={priceDirection} />
          <RatesTable rates={tableRates} lastUpdated={lastUpdated} loading={loading} />
          <CostingTable rates={costingRates} loading={loading} />
        </main>
      )}
      {page === 'about' && <div className="flex-1"><AboutUs setPage={navigate} /></div>}
      {page === 'contact' && <div className="flex-1"><Contact /></div>}
      {page === 'login' && (
        <div className="flex-1">
          <Login onClose={() => navigate('home')} onLoggedIn={() => { setIsLoggedIn(true); navigate('home'); }} />
        </div>
      )}
      {page === 'privacy' && <div className="flex-1"><PrivacyPolicy /></div>}
      {page !== 'login' && <Footer setPage={navigate} />}
      {isAdmin && (
        <RateAdjustmentPanel
          adjustments={adjustments}
          saving={saving}
          onSave={saveAdjustments}
        />
      )}
    </div>
  );
}
