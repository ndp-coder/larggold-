import Header from './components/Header';
import MetalCards from './components/MetalCards';
import RatesTable from './components/RatesTable';
import CostingTable from './components/CostingTable';
import Footer from './components/Footer';
import { useLiveRates } from './hooks/useLiveRates';

export default function App() {
  const { metalRates, priceDirection, tableRates, costingRates, lastUpdated, loading, error } = useLiveRates();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" id="rates">
        <MetalCards rates={metalRates} loading={loading} error={error} priceDirection={priceDirection} />
        <RatesTable rates={tableRates} lastUpdated={lastUpdated} loading={loading} />
        <CostingTable rates={costingRates} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
