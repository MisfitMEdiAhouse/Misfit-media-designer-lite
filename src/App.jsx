// Founder Command production refresh — force current owner cockpit bundle onto canonical site.
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import RouteMeta from './components/RouteMeta.jsx';
import Home from './pages/Home.jsx';
import OwnerCommandCenter from './pages/OwnerCommandCenter.jsx';
import FounderPasswordReset from './pages/FounderPasswordReset.jsx';
import ProofPage from './pages/ProofPage.jsx';
import Competitions from './pages/Competitions.jsx';
import AgenticGovernedFleet from './pages/AgenticGovernedFleet.jsx';
import AgentProviderScorecard from './pages/AgentProviderScorecard.jsx';
import DeveloperTestDrive from './pages/DeveloperTestDrive.jsx';
import EnterpriseAI from './pages/EnterpriseAI.jsx';
import CreatorCommerce from './pages/CreatorCommerce.jsx';
import MisfitAIV2 from './pages/MisfitAIV2.jsx';
import SnapSite from './pages/SnapSite.jsx';
import AgentControlPlane from './pages/AgentControlPlane.jsx';
import ShopifyAgenticAudit from './pages/ShopifyAgenticAudit.jsx';
import A2AAgentAudit from './pages/A2AAgentAudit.jsx';
import AgentEvaluationLab from './pages/AgentEvaluationLab.jsx';
import IdentitySignal from './pages/IdentitySignalPublic.jsx';
import FrontierMap from './pages/FrontierMap.jsx';
import WorldForge from './pages/WorldForge.jsx';
import GTAHub from './pages/GTAHub.jsx';
import HeirOS from './pages/HeirOS.jsx';
import RoadsGarageOSV2 from './pages/RoadsGarageOSV2.jsx';
import RoadsAdminGate from './pages/RoadsAdminGate.jsx';
import TylerWardLive from './pages/TylerWardLive.jsx';
import BusinessScrub from './pages/BusinessScrub.jsx';
import Agency from './pages/Agency.jsx';
import Products from './pages/Products.jsx';
import ExploreMisfit from './pages/ExploreMisfit.jsx';
import Operator from './pages/Operator.jsx';
import IALSTurbineCommand from './pages/IALSTurbineCommand.jsx';
import FieldNotes from './pages/FieldNotes.jsx';
import CoffeeLaunchConsole from './pages/CoffeeLaunchConsole.jsx';
import GoldenEssence from './pages/GoldenEssence.jsx';
import GoldenEssenceMobile from './pages/GoldenEssenceMobile.jsx';
import StanHansenEgnyte from './pages/StanHansenEgnyte.jsx';

const goldenEssenceSections = new Set(['about', 'services', 'policies', 'contact']);

function ResponsiveGoldenEssence() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const sync = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const segment = location.pathname.split('/').filter(Boolean).at(-1);
    const section = goldenEssenceSections.has(segment) ? segment : 'home';
    const timer = window.setTimeout(() => {
      document.title = 'Golden Essence Therapeutics';
      document.getElementById(section)?.scrollIntoView({ block: 'start' });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [isMobile, location.pathname]);

  return isMobile ? <GoldenEssenceMobile /> : <GoldenEssence />;
}

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
        <Route path="/frontier" element={<FrontierMap />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/field-notes" element={<FieldNotes />} />
        <Route path="/field-notes/:slug" element={<FieldNotes />} />
        <Route path="/portfolio" element={<ProofPage />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/portfolio/competitions" element={<Navigate to="/competitions" replace />} />
        <Route path="/developer-test-drive" element={<DeveloperTestDrive />} />
        <Route path="/agentic-governed-fleet" element={<AgenticGovernedFleet />} />
        <Route path="/agent-provider-scorecard" element={<AgentProviderScorecard />} />
        <Route path="/portfolio/ials-turbine-command" element={<IALSTurbineCommand />} />
        <Route path="/portfolio/golden-essence" element={<ResponsiveGoldenEssence />} />
        <Route path="/portfolio/golden-essence/about" element={<ResponsiveGoldenEssence />} />
        <Route path="/portfolio/golden-essence/services" element={<ResponsiveGoldenEssence />} />
        <Route path="/portfolio/golden-essence/policies" element={<ResponsiveGoldenEssence />} />
        <Route path="/portfolio/golden-essence/contact" element={<ResponsiveGoldenEssence />} />
        <Route path="/portfolio/golden-essence-mobile" element={<GoldenEssenceMobile />} />
        <Route path="/agents" element={<AgentControlPlane />} />
        <Route path="/shopify-ai-audit" element={<ShopifyAgenticAudit />} />
        <Route path="/a2a-agent-audit" element={<A2AAgentAudit />} />
        <Route path="/agent-evaluation-lab" element={<AgentEvaluationLab />} />
        <Route path="/identity-signal" element={<IdentitySignal />} />
        <Route path="/stan-hansen" element={<StanHansenEgnyte />} />
        <Route path="/egnyte" element={<Navigate to="/stan-hansen" replace />} />
        <Route path="/signal" element={<WorldForge />} />
        <Route path="/worldforge" element={<Navigate to="/signal" replace />} />
        <Route path="/gta" element={<GTAHub />} />
        <Route path="/gaming" element={<Navigate to="/gta" replace />} />
        <Route path="/command" element={<OwnerCommandCenter />} />
        <Route path="/command-reset" element={<FounderPasswordReset />} />
        <Route path="/heir" element={<HeirOS />} />
        <Route path="/proof" element={<Navigate to="/portfolio" replace />} />
        <Route path="/enterprise-ai" element={<EnterpriseAI />} />
        <Route path="/creator-commerce" element={<CreatorCommerce />} />
        <Route path="/misfit-ai-v2" element={<MisfitAIV2 />} />
        <Route path="/rig-radar" element={<RoadsGarageOSV2 />} />
        <Route path="/roads" element={<Navigate to="/rig-radar" replace />} />
        <Route path="/roads/admin" element={<RoadsAdminGate />} />
        <Route path="/coffee/admin" element={<CoffeeLaunchConsole />} />
        <Route path="/roads-garage" element={<Navigate to="/rig-radar" replace />} />
        <Route path="/tyler-ward" element={<TylerWardLive />} />
        <Route path="/tyler" element={<Navigate to="/tyler-ward" replace />} />
        <Route path="/quotelink" element={<SnapSite />} />
        <Route path="/snapsite" element={<Navigate to="/quotelink" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
