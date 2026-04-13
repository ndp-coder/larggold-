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
  const { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error } = useLiveRates();

  return (
    <div className="min-h-screen flex flex-col">
      <Header page={page} setPage={setPage} />
      {page === 'home' && (
        <main className="flex-1" id="rates">
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
