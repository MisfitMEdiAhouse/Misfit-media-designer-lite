import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const publicMeta = {
  '/': ['/', 'Run a free Shopify store and business website health scan. Find storefront, conversion, site-health, trust, and AI-readiness leaks.'],
  '/scrub': ['/scrub', 'Scan a Shopify store or business website and get a public-signal health score with prioritized fixes.'],
  '/agency': ['/agency', 'Misfit Mediahouse builds websites, AI intake, commerce, custom software, and managed growth systems.'],
  '/portfolio': ['/portfolio', 'Open the canonical public portfolio of live products, client deployments, commerce builds, and business systems from Misfit Mediahouse.'],
  '/products': ['/products', 'Misfit Business Health Scanner, QuoteLink, Misfit AI V2, Shopify Agentic Audit, and ContextForge.'],
  '/explore': ['/explore', 'Explore Misfit Cloud, Misfit Engines, Misfit Governance, Misfit AI-to-AI, and the protected GHOSBC OS API Brain.'],
  '/operator': ['/operator', 'Skip the resume pile. Give Misfit a live full-stack, AI, revenue, commerce, migration, partnership, dealer, or product challenge and judge the shipped work.'],
  '/quotelink': ['/quotelink', 'Launch a focused mobile quote, call, text, and QR lead page with Misfit QuoteLink.'],
  '/misfit-ai-v2': ['/misfit-ai-v2', 'Misfit AI V2 for lead intake, response, qualification, follow-up, revival, booking, and revenue operations.'],
  '/shopify-ai-audit': ['/shopify-ai-audit', 'Audit the public agentic-commerce readiness of a Shopify storefront.'],
  '/a2a-agent-audit': ['/a2a-agent-audit', 'Audit the public trust and readiness signals declared by an A2A agent.'],
  '/agents': ['/agents', 'Public-safe machine and agent discovery for Misfit Mediahouse.'],
  '/enterprise-ai': ['/enterprise-ai', 'ContextForge enterprise AI and metadata-aware change governance by Misfit Mediahouse.'],
  '/creator-commerce': ['/creator-commerce', 'Creator commerce, campaign attribution, and tracked conversion systems by Misfit Mediahouse.'],
  '/roads': ['/roads', 'Roads Garage automotive commerce, wheel, tuning, merchandise, and service workflows.'],
  '/tyler-ward': ['/tyler-ward', 'Tyler Ward general contractor services and project intake.'],
};

const privatePaths = new Set(['/command', '/heir', '/roads/admin']);

function upsertMeta(name, content) {
  let node = document.querySelector(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('name', name);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = publicMeta[pathname];
    const isPrivate = privatePaths.has(pathname);
    const canonicalPath = route?.[0] || '/';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://misfitmediahouse.com${canonicalPath}`);
    if (route?.[1]) upsertMeta('description', route[1]);
    upsertMeta('robots', isPrivate ? 'noindex,nofollow,noarchive,nosnippet' : 'index,follow,max-image-preview:large');
  }, [pathname]);

  return null;
}
