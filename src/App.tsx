import { useState, useEffect } from 'react';
import Header from './components/Header';
import MetalCards from './components/MetalCards';
import RatesTable from './components/RatesTable';
import CostingTable from './components/CostingTable';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { useLiveRates } from './hooks/useLiveRates';
import { supabase } from './hooks/lib/supabase';
const bgImg = '/files_6010405-2026-04-14T11-02-56-013Z-image.png';

export type Page = 'home' | 'about' | 'contact' | 'login';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error, marketClosed, nextMarketOpen } = useLiveRates();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
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
      <Header page={page} setPage={setPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
      {page === 'about' && <div className="flex-1"><AboutUs setPage={setPage} /></div>}
      {page === 'contact' && <div className="flex-1"><Contact /></div>}
      {page === 'login' && (
        <div className="flex-1">
          <Login onClose={() => setPage('home')} onLoggedIn={() => { setIsLoggedIn(true); setPage('home'); }} />
        </div>
      )}
      {page !== 'login' && <Footer setPage={setPage} />}
    </div>
  );
}
