import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import OwnerCommandCenter from './pages/OwnerCommandCenter.jsx';
import ProofPage from './pages/ProofPage.jsx';
import EnterpriseAI from './pages/EnterpriseAI.jsx';
import CreatorCommerce from './pages/CreatorCommerce.jsx';
import MisfitAIV2 from './pages/MisfitAIV2.jsx';
import SnapSite from './pages/SnapSite.jsx';
import AgentControlPlane from './pages/AgentControlPlane.jsx';
import ShopifyAgenticAudit from './pages/ShopifyAgenticAudit.jsx';
import A2AAgentAudit from './pages/A2AAgentAudit.jsx';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentControlPlane />} />
        <Route path="/shopify-ai-audit" element={<ShopifyAgenticAudit />} />
        <Route path="/a2a-agent-audit" element={<A2AAgentAudit />} />
        <Route path="/command" element={<OwnerCommandCenter />} />
        <Route path="/proof" element={<ProofPage />} />
        <Route path="/enterprise-ai" element={<EnterpriseAI />} />
        <Route path="/creator-commerce" element={<CreatorCommerce />} />
        <Route path="/misfit-ai-v2" element={<MisfitAIV2 />} />
        <Route path="/quotelink" element={<SnapSite />} />
        <Route path="/snapsite" element={<Navigate to="/quotelink" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
