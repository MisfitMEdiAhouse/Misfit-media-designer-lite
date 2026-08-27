import { ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const products = [
  {
    name: 'Business Health Scanner',
    type: 'Free diagnostic',
    price: 'Free',
    copy: 'Public-signal scan for storefront, conversion, site health, discoverability, trust, and AI readiness.',
    href: '/',
  },
  {
    name: 'Misfit QuoteLink',
    type: 'Conversion tool',
    price: '$49 once',
    copy: 'A focused mobile quote, call, text, and QR lead page for local service businesses.',
    href: '/quotelink',
  },
  {
    name: 'Misfit AI V2',
    type: 'Flagship software',
    price: 'From $297/mo',
    copy: 'Lead intake, response, qualification, follow-up, revival, booking, and revenue operations. The current paid plan is AI Intake + Membership Engine.',
    href: '/misfit-ai-v2',
  },
  {
    name: 'Shopify Agentic Audit',
    type: 'Store diagnostic',
    price: 'Free first pass',
    copy: 'A deeper Shopify-specific read of catalog, commerce, discovery, policy, and agent-readiness signals.',
    href: '/shopify-ai-audit',
  },
  {
    name: 'A2A Agent Trust Audit',
    type: 'Agent diagnostic',
    price: 'Free first pass',
    copy: 'Audit an Agent Card, protocol bindings, declared skills, security signals, and registry verification without executing the target agent.',
    href: '/a2a-agent-audit',
  },
  {
    name: 'ChangePacket',
    type: 'Machine product',
    price: '$9 / 2,000 calls',
    copy: 'Low-token change memory for public webpages and MCP tool surfaces, with an existing hosted API and MCP interface.',
    href: 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed',
  },
  {
    name: 'Misfit Governed Agent Fleet',
    type: 'Governed agent infrastructure',
    price: '$500 evaluation · $1,500 integration',
    copy: 'Put deterministic allow/review/block checks, Gemini explanations, human gates, and audit evidence in front of consequential agent actions. Live proof is public; private GHOSBC internals remain sealed.',
    href: '/agentic-governed-fleet',
  },
  {
    name: 'ContextForge',
    type: 'Enterprise AI',
    price: 'Public demo',
    copy: 'DataHub-aware code generation grounded in metadata, lineage, ownership, governance, and usage context.',
    href: 'https://contextforge-datahub-app.vercel.app/',
  },
];

export default function Products() {
  useEffect(() => {
    document.title = 'Misfit Products | Business Scanner, QuoteLink + AI';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">Products + tools</div>
          <h1 className="mt-5 max-w-6xl font-display text-[clamp(3.3rem,10vw,7rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em]">Use the tool. Buy the product. Hire the agency only when you need it.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">A clean catalog of public products and governed integrations—no owner controls, recovery material, raw private kernels, or duplicated app versions.</p>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.name} className="flex min-h-[300px] flex-col rounded-3xl border border-white/10 bg-white/[0.025] p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{product.type}</div>
                <h2 className="mt-4 font-display text-3xl font-bold">{product.name}</h2>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300">{product.price}</div>
                <p className="mt-5 text-sm leading-7 text-slate-400">{product.copy}</p>
                <a href={product.href} target={product.href.startsWith('http') ? '_blank' : undefined} rel={product.href.startsWith('http') ? 'noreferrer' : undefined} className="mt-auto inline-flex items-center gap-2 pt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                  Open <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
