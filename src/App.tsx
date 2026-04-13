import { useState } from 'react';
import Header from './components/Header';
import MetalCards from './components/MetalCards';
import RatesTable from './components/RatesTable';
import CostingTable from './components/CostingTable';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import { useLiveRates } from './hooks/useLiveRates';

export type Page = 'home' | 'about' | 'contact';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error, marketClosed, nextMarketOpen } = useLiveRates();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/bg-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header page={page} setPage={setPage} />
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
      <Footer setPage={setPage} />
    </div>
  );
}
