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
    <div className="min-h-screen flex flex-col">
      <Header page={page} setPage={setPage} />
      {page === 'home' && (
        <main className="flex-1" id="rates">
          {marketClosed && (
            <div className="bg-amber-50 border-b border-amber-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  MCX market is currently closed — showing last available rates.
                  {nextMarketOpen && (
                    <span className="font-normal ml-1">
                      Reopens at{' '}
                      <span className="font-semibold">
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
