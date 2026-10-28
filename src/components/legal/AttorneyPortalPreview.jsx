import { ArrowUpRight, FileLock2, FolderOpen, Gavel, LockKeyhole, ShieldCheck, UserRoundCheck } from 'lucide-react';

/**
 * OWNER-ONLY PREVIEW. The parent LegalOSMigration component must authenticate the
 * owner BEFORE mounting this component. No cases, evidence or client details are
 * compiled into this public repository or fetched through a public endpoint.
 *
 * This interface is intentionally NOT Wayne's live login or a data room. A
 * server-verified invitation, per-case authorization, private storage, audit
 * events and successful access-isolation tests are required before activation.
 */
const workstreams = [
  {
    icon: Gavel,
    title: 'Court case index',
    source: 'Utah First District (Cache County) and other verified jurisdictions',
    state: 'Awaiting authenticated MyCourtCase / Xchange export',
    gate: 'Official docket and documents must be matched to the correct person, court and case number.',
  },
  {
    icon: FolderOpen,
    title: 'Police & arrest reports',
    source: 'Smithfield City Police Department; other agencies only as discovered',
    state: 'Awaiting approved records requests',
    gate: 'Police records are obtained through the agency GRAMA process, not inferred from search results.',
  },
  {
    icon: FileLock2,
    title: 'Evidence & correspondence',
    source: 'Owner-authorized original emails, recordings, police and court documents',
    state: 'Private inventory and chain of custody not yet imported',
    gate: 'Verify document owner, source, SHA-256 digest, record classification and permission before ingest.',
  },
  {
    icon: UserRoundCheck,
    title: 'Attorney review access',
    source: 'Dedicated case-scoped reviewer invitation after owner approval',
    state: 'Access disabled — no invitation issued',
    gate: 'Require server-side authentication, case membership, RLS, audit logging and access revocation.',
  },
];

const sources = [
  {
    title: 'Utah MyCourtCase',
    description: 'Owner-only case access; link eligible district and justice court cases and download filings.',
    href: 'https://www.utcourts.gov/en/self-help/services/mycase.html',
  },
  {
    title: 'Utah Xchange',
    description: 'Public district / justice court search, with account or payment gates where required.',
    href: 'https://www.utcourts.gov/en/court-records-publications/records/xchange.html',
  },
  {
    title: 'Smithfield police GRAMA',
    description: 'Official police records form and submission instructions; requester verification may be required.',
    href: 'https://smithfieldutah.gov/248/Request-for-Records',
  },
];

export default function AttorneyPortalPreview() {
  return (
    <section aria-labelledby="legal-attorney-heading" className="mt-6 rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.08),transparent_48%),#080c0e] p-5 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.17em] text-cyan-300">Protected attorney intake / owner preview</div>
          <h2 id="legal-attorney-heading" className="mt-2 font-display text-3xl font-black md:text-4xl">
            Counsel Review Workspace
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            A proposed case-scoped workspace for Wayne Caldwell. This screen organizes the verified
            evidence-acquisition workflow; it is not a shared attorney account or a migrated case database.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-amber-200">
          <LockKeyhole size={14} /> Attorney access inactive
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          ['Verified court records imported', '0'],
          ['Police records imported', '0'],
          ['Attorney accounts activated', '0'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <div className="text-3xl font-black tabular-nums">{value}</div>
            <div className="mt-2 text-xs leading-5 text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      <h3 className="mt-8 font-display text-xl font-bold">Intake lanes</h3>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {workstreams.map(({ icon: Icon, title, source, state, gate }) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200"><Icon size={19} /></span>
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-1 text-xs leading-5 text-slate-400">{source}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-amber-300/15 bg-amber-300/5 px-3 py-2 text-xs text-amber-200">{state}</div>
            <p className="mt-3 text-xs leading-5 text-slate-400">{gate}</p>
          </article>
        ))}
      </div>

      <h3 className="mt-8 font-display text-xl font-bold">Official records gateways</h3>
      <p className="mt-2 text-xs leading-6 text-slate-400">These open the source agencies. They do not import documents automatically.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {sources.map((source) => (
          <a key={source.title} href={source.href} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-cyan-300/40">
            <div className="flex items-center justify-between gap-3 text-sm font-semibold">
              {source.title}<ArrowUpRight className="text-cyan-200" size={17} />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{source.description}</p>
          </a>
        ))}
      </div>

      <div className="mt-7 flex gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={20} />
        <p className="text-xs leading-6 text-slate-300">
          No uploaded case documents, arrests, police reports, private names or counsel invitations
          are stored in this public frontend. The source Base44 app is unchanged; migration parity,
          writable private storage and owner-approved attorney access remain mandatory gates.
        </p>
      </div>
    </section>
  );
}
