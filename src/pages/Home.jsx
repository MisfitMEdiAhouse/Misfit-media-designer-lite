import { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import RevenueHero from '../components/home/RevenueHero.jsx';

export default function Home() {
  useEffect(() => {
    document.title = 'Shopify Store + Business Health Scanner | Misfit Mediahouse';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <RevenueHero />
      </main>
    </div>
  );
}
