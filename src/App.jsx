import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import RouteMeta from './components/RouteMeta.jsx';
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
import HeirOS from './pages/HeirOS.jsx';
import RoadsGarageOSV2 from './pages/RoadsGarageOSV2.jsx';
import RoadsAdminGate from './pages/RoadsAdminGate.jsx';
import TylerWardLive from './pages/TylerWardLive.jsx';
import BusinessScrub from './pages/BusinessScrub.jsx';
import Agency from './pages/Agency.jsx';
import Products from './pages/Products.jsx';
import ExploreMisfit from './pages/ExploreMisfit.jsx';

export default function App() {
  return (
    <Router>
      <RouteMeta />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scrub" element={<BusinessScrub />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/products" element={<Products />} />
        <Route path="/explore" element={<ExploreMisfit />} />
        <Route path="/portfolio" element={<ProofPage />} />
        <Route path="/agents" element={<AgentControlPlane />} />
        <Route path="/shopify-ai-audit" element={<ShopifyAgenticAudit />} />
        <Route path="/a2a-agent-audit" element={<A2AAgentAudit />} />
        <Route path="/command" element={<OwnerCommandCenter />} />
        <Route path="/heir" element={<HeirOS />} />
        <Route path="/proof" element={<Navigate to="/portfolio" replace />} />
        <Route path="/enterprise-ai" element={<EnterpriseAI />} />
        <Route path="/creator-commerce" element={<CreatorCommerce />} />
        <Route path="/misfit-ai-v2" element={<MisfitAIV2 />} />
        <Route path="/roads" element={<RoadsGarageOSV2 />} />
        <Route path="/roads/admin" element={<RoadsAdminGate />} />
        <Route path="/roads-garage" element={<Navigate to="/roads" replace />} />
        <Route path="/tyler-ward" element={<TylerWardLive />} />
        <Route path="/tyler" element={<Navigate to="/tyler-ward" replace />} />
        <Route path="/quotelink" element={<SnapSite />} />
        <Route path="/snapsite" element={<Navigate to="/quotelink" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
