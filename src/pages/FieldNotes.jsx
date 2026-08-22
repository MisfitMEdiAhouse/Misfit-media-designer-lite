import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { fieldNotes, findFieldNote } from '../content/fieldNotes.js';

function rebrandPublicNote(note) {
  if (!note) return note;
  const serialized = JSON.stringify(note)
    .replaceAll('ROAD LAB', 'RIG RADAR')
    .replaceAll('Road Lab', 'Rig Radar')
    .replaceAll('"/roads"', '"/rig-radar"');
  return JSON.parse(serialized);
}

const publicFieldNotes = fieldNotes.map(rebrandPublicNote);

function JsonLd({ note }) {
  useEffect(() => {
    if (!note) return undefined;
    const id = 'misfit-field-note-jsonld';
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: note.title,
      description: note.description,
      datePublished: note.published,
      dateModified: note.published,
      mainEntityOfPage: `https://misfitmediahouse.com/field-notes/${note.slug}`,
      author: { '@type': 'Organization', name: 'Misfit Mediahouse', url: 'https://misfitmediahouse.com/' },
      publisher: { '@type': 'Organization', name: 'Misfit Mediahouse', url: 'https://misfitmediahouse.com/' },
    });
    return () => script.remove();
  }, [note]);
  return null;
}

function NotesIndex() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="grid-bg border-b border-white/10 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">MISFIT FIELD NOTES</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl">Useful enough to steal.<br /><span className="text-cyan-300">Specific enough to test.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">Shopify conversion, commerce operations, automotive tools, AI revenue systems, and the work between an idea and a shipped result.</p>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {publicFieldNotes.map((note, index) => (
            <article key={note.slug} className={`group flex min-h-[330px] flex-col border border-white/10 bg-white/[0.025] p-7 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.04] sm:p-9 ${index === 0 ? 'lg:col-span-2 lg:min-h-[390px]' : ''}`}>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">{note.kicker}</p>
              <h2 className={`mt-5 font-display font-black uppercase leading-[0.95] ${index === 0 ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-4xl'}`}>{note.title}</h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">{note.description}</p>
              <div className="mt-auto flex items-end justify-between gap-4 pt-10">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">{note.published} · {note.readTime}</span>
                <Link to={`/field-notes/${note.slug}`} className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white transition group-hover:text-cyan-300">Read note <ArrowRight size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function NoteArticle({ note }) {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <JsonLd note={note} />
      <article>
        <header className="grid-bg border-b border-white/10 px-5 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <Link to="/field-notes" className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"><ArrowLeft size={13} /> Field notes</Link>
            <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">{note.kicker}</p>
            <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.92] sm:text-6xl lg:text-7xl">{note.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">{note.description}</p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-600">
              <span>{note.published}</span><span>{note.readTime}</span><span>{note.audience}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
          <div className="space-y-14">
            {note.sections.map((section, index) => (
              <section key={section.heading} className="relative border-l border-white/10 pl-6 sm:pl-9">
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight sm:text-4xl">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-slate-300">{paragraph}</p>)}
                {section.bullets && (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet) => <li key={bullet} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-7 text-slate-300"><span className="mt-3 h-1.5 w-1.5 bg-cyan-300" aria-hidden="true" /><span>{bullet}</span></li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside className="mt-16 border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Primary references</p>
            <div className="mt-5 flex flex-col gap-3">
              {note.sources.map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-300">{source.label}<ExternalLink size={13} /></a>
              ))}
            </div>
          </aside>

          <div className="mt-8 border border-cyan-300/30 bg-cyan-300/[0.06] p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">PUT THE NOTE TO WORK</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">Use the live tool, see the shipped product, or bring Misfit the operating problem behind it.</p>
            </div>
            <a href={note.cta.href} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 bg-cyan-300 px-6 py-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-black sm:mt-0">{note.cta.label}<ArrowRight size={14} /></a>
          </div>
        </div>
      </article>
    </main>
  );
}

export default function FieldNotes() {
  const { slug } = useParams();
  const note = slug ? rebrandPublicNote(findFieldNote(slug)) : null;

  if (slug && !note) return <Navigate to="/field-notes" replace />;

  return (
    <>
      <Navbar />
      {note ? <NoteArticle note={note} /> : <NotesIndex />}
      <Footer />
    </>
  );
}
