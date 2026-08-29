const styles = {
  LIVE: 'border-emerald-300/25 bg-emerald-300/[.06] text-emerald-300',
  BETA: 'border-cyan-300/25 bg-cyan-300/[.06] text-cyan-300',
  PROOF: 'border-fuchsia-300/25 bg-fuchsia-300/[.06] text-fuchsia-300',
  BUILDING: 'border-amber-300/25 bg-amber-300/[.06] text-amber-300',
  RESEARCH: 'border-violet-300/25 bg-violet-300/[.06] text-violet-300',
  CONCEPT: 'border-slate-400/25 bg-slate-400/[.05] text-slate-300',
  PRIVATE: 'border-rose-300/25 bg-rose-300/[.06] text-rose-300',
};

export const MATURITY_LABELS = [
  ['LIVE', 'Deployed and functioning'],
  ['BETA', 'Usable now; still being hardened or commercialized'],
  ['PROOF', 'Working or reproducible technical demonstration'],
  ['BUILDING', 'Implementation underway; important gates remain'],
  ['RESEARCH', 'Architecture/spec/simulation; no production-runtime claim'],
  ['CONCEPT', 'Thesis or idea only'],
  ['PRIVATE', 'Real internal system intentionally not inspectable publicly'],
];

export default function MaturityBadge({ status = 'CONCEPT', className = '' }) {
  const key = String(status || 'CONCEPT').toUpperCase();
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[.12em] ${styles[key] || styles.CONCEPT} ${className}`}>{key}</span>;
}
