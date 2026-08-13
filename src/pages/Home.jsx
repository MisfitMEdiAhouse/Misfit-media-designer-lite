import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import RevenueHero from '../components/home/RevenueHero.jsx';
import RevenueProblem from '../components/home/RevenueProblem.jsx';
import RevenueOffers from '../components/home/RevenueOffers.jsx';
import RevenueProof from '../components/home/RevenueProof.jsx';
import RevenueCTA from '../components/home/RevenueCTA.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <RevenueHero />
        <RevenueProblem />
        <RevenueOffers />
        <RevenueProof />
        <RevenueCTA />
      </main>
      <Footer />
    </div>
  );
}
