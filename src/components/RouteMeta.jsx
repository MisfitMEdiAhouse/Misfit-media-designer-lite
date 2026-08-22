import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findFieldNote } from '../content/fieldNotes.js';

const publicMeta = {
  '/': ['/', 'Run a free Shopify store and business website health scan. Find storefront, conversion, site-health, trust, and AI-readiness leaks.'],
  '/scrub': ['/scrub', 'Scan a Shopify store or business website and get a public-signal health score with prioritized fixes.'],
  '/agency': ['/agency', 'Misfit Mediahouse builds websites, AI intake, commerce, custom software, and managed growth systems.'],
  '/portfolio': ['/portfolio', 'Open the canonical public portfolio of live products, client deployments, commerce builds, and business systems from Misfit Mediahouse.'],
  '/portfolio/ials-turbine-command': ['/portfolio/ials-turbine-command', 'Inspect how Misfit Mediahouse built the IALS aerospace aftermarket operating system across inventory intelligence, repair economics, compliance workflow, document automation, and human-gated deal control.'],
  '/products': ['/products', 'Misfit Business Health Scanner, QuoteLink, Misfit AI V2, Shopify Agentic Audit, and ContextForge.'],
  '/explore': ['/explore', 'Explore Misfit Cloud, Misfit Engines, Misfit Governance, Misfit AI-to-AI, and the protected GHOSBC OS API Brain.'],
  '/operator': ['/operator', 'Skip the resume pile. Give Misfit a live full-stack, AI, revenue, commerce, migration, partnership, dealer, or product challenge and judge the shipped work.'],
  '/field-notes': ['/field-notes', 'Practical field notes from Misfit Mediahouse on Shopify conversion, print-on-demand operations, automotive tools, festival merchandise, and AI revenue systems.'],
  '/quotelink': ['/quotelink', 'Launch a focused mobile quote, call, text, and QR lead page with Misfit QuoteLink.'],
  '/misfit-ai-v2': ['/misfit-ai-v2', 'Misfit AI V2 for lead intake, response, qualification, follow-up, revival, booking, and revenue operations.'],
  '/shopify-ai-audit': ['/shopify-ai-audit', 'Audit the public agentic-commerce readiness of a Shopify storefront.'],
  '/a2a-agent-audit': ['/a2a-agent-audit', 'Audit the public trust and readiness signals declared by an A2A agent.'],
  '/agents': ['/agents', 'Public-safe machine and agent discovery for Misfit Mediahouse.'],
  '/enterprise-ai': ['/enterprise-ai', 'ContextForge enterprise AI and metadata-aware change governance by Misfit Mediahouse.'],
  '/creator-commerce': ['/creator-commerce', 'Creator commerce, campaign attribution, and tracked conversion systems by Misfit Mediahouse.'],
  '/rig-radar': ['/rig-radar', 'Misfit Rig Radar calculators for wheel power, metric and flotation tires, corrected speed, gearing, crawl ratio, vehicle profiles, field kits, vehicle power, and overland comms.'],
  '/tyler-ward': ['/tyler-ward', 'Tyler Ward general contractor services and project intake.'],
  '/coffee/admin': ['/coffee/admin', 'Private owner launch console for Coffee & A Joint revenue, fulfillment, launch-proof, and product-quality gates.'],
};

const privatePaths = new Set(['/command', '/heir', '/roads/admin', '/coffee/admin']);

const publicTitles = {
  '/': 'Misfit Mediahouse | Shopify Store Health Scanner',
  '/scrub': 'Shopify & Business Health Scan | Misfit Mediahouse',
  '/agency': 'Shopify Growth & AI Revenue Agency | Misfit Mediahouse',
  '/portfolio': 'Shipped Work | Misfit Mediahouse',
  '/portfolio/ials-turbine-command': 'IALS Turbine Command | Misfit Mediahouse',
  '/products': 'Products & Revenue Engines | Misfit Mediahouse',
  '/explore': 'Explore Misfit | Misfit Mediahouse',
  '/operator': 'Hire or Partner With Misfit Mediahouse',
  '/field-notes': 'Field Notes | Misfit Mediahouse',
  '/quotelink': 'Misfit QuoteLink',
  '/misfit-ai-v2': 'Misfit AI V2',
  '/shopify-ai-audit': 'Shopify Agentic Audit | Misfit Mediahouse',
  '/a2a-agent-audit': 'A2A Agent Audit | Misfit Mediahouse',
  '/agents': 'Misfit Agent Network',
  '/enterprise-ai': 'ContextForge Enterprise AI | Misfit Mediahouse',
  '/creator-commerce': 'Creator Commerce | Misfit Mediahouse',
  '/rig-radar': 'Misfit Rig Radar',
  '/tyler-ward': 'Tyler Ward Construction',
  '/coffee/admin': 'Coffee & A Joint Launch Console — Private',
};

function upsertMeta(name, content) {
  let node = document.querySelector(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('name', name);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}

function upsertProperty(property, content) {
  let node = document.querySelector(`meta[property="${property}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('property', property);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const fieldNote = pathname.startsWith('/field-notes/') ? findFieldNote(pathname.replace('/field-notes/', '')) : null;
    const route = fieldNote
      ? [pathname, fieldNote.description]
      : publicMeta[pathname];
    const isPrivate = privatePaths.has(pathname);
    const canonicalPath = route?.[0] || '/';
    const title = fieldNote ? `${fieldNote.title} | Misfit Mediahouse` : publicTitles[pathname] || 'Misfit Mediahouse';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://misfitmediahouse.com${canonicalPath}`);
    if (route?.[1]) upsertMeta('description', route[1]);
    upsertMeta('robots', isPrivate ? 'noindex,nofollow,noarchive,nosnippet' : 'index,follow,max-image-preview:large');
    document.title = title;
    upsertProperty('og:title', title);
    upsertProperty('og:description', route?.[1] || publicMeta['/'][1]);
    upsertProperty('og:url', `https://misfitmediahouse.com${canonicalPath}`);
    upsertProperty('og:type', fieldNote ? 'article' : 'website');
  }, [pathname]);

  return null;
}
