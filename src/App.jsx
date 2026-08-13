import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import OwnerCommandCenter from './pages/OwnerCommandCenter.jsx';
import ProofPage from './pages/ProofPage.jsx';
import EnterpriseAI from './pages/EnterpriseAI.jsx';
import CreatorCommerce from './pages/CreatorCommerce.jsx';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/command" element={<OwnerCommandCenter />} />
        <Route path="/proof" element={<ProofPage />} />
        <Route path="/enterprise-ai" element={<EnterpriseAI />} />
        <Route path="/creator-commerce" element={<CreatorCommerce />} />
      </Routes>
    </Router>
  );
}
