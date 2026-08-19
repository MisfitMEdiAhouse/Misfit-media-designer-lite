import { useEffect, useState } from 'react';
import hero from '../assets/tyler/tyler-eden-mountain-home-hero.webp';
import crateHero from '../assets/tyler/tyler-crate-catalog.webp';

const PHONE = '+18017910165';
const PHONE_DISPLAY = '(801) 791-0165';
const LEAD_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/tyler-contractor-lead';
const CRATE_CHECKOUT = 'https://buy.stripe.com/28E5kD0saeCWfd05Ne8ww0s';

const services = [
  ['⌂', 'General construction', 'Build-outs, repairs, additions and practical construction from scope through finish.'],
  ['▰', 'Remodels & renovations', 'Kitchens, baths, basements, demo, rebuilds and mountain-home updates.'],
  ['▥', 'Flooring & finish work', 'Hardwood, LVP, tile, trim, doors and clean finish details.'],
  ['⚒', 'Repairs & maintenance', 'Drywall, paint, carpentry, decks, punch lists and property fixes.'],
  ['⌁', 'Outdoor builds & hardscape', 'Patios, walls, steps, decks and outdoor spaces built for the terrain.'],
  ['◒', 'Landscaping & property work', 'Grading, planting, cleanup, irrigation support and property improvements.'],
  ['❄', 'Snow removal', 'Driveways, access, walkways and winter property support in the Eden area.'],
  ['✓', 'Year-round property care', 'Ongoing maintenance and seasonal work for mountain homes and properties.'],
];

export default function TylerWard() {
  const [kind, setKind] = useState('bid_request');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const oldTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const oldDescription = description?.getAttribute('content');
    const oldCanonical = canonical?.getAttribute('href');
    document.title = 'Tyler Ward | General Contractor · Eden, Utah';
    description?.setAttribute(
      'content',
      'General construction, remodels, flooring, repairs, outdoor builds, landscaping, snow removal and property work in Eden and Ogden Valley, Utah.'
    );
    canonical?.setAttribute('href', 'https://misfitmediahouse.com/tyler-ward');
    return () => {
      document.title = oldTitle;
      if (description && oldDescription) description.setAttribute('content', oldDescription);
      if (canonical && oldCanonical) canonical.setAttribute('href', oldCanonical);
    };
  }, []);

  function jumpToForm(nextKind) {
    setKind(nextKind);
    window.requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  async function submitLead(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const contact = String(raw.contact || '').trim();
    delete raw.contact;
    raw.kind = kind;
    raw.email = contact.includes('@') ? contact : '';
    raw.phone = contact.includes('@') ? '' : contact;
    raw.contact_preference = contact.includes('@') ? 'email' : 'text';
    raw.time_window = 'flexible';

    if (!raw.phone && !raw.email) {
      setStatus('Add a phone number or email so Tyler can follow up.');
      return;
    }

    setStatus('Sending…');
    try {
      const r = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(raw),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error('save failed');
      setStatus(kind === 'site_visit'
        ? 'Site-visit request saved — Tyler can confirm directly.'
        : 'Request saved — Tyler has your project details.');
      form.reset();
      setKind('bid_request');
    } catch {
      setStatus('Could not save that request yet. Call or text Tyler and we’ll get it handled.');
    }
  }

  return (
    <div className="tw">
      <style>{`
        .tw{
          --black:#0b0d0a;--deep:#11150f;--forest:#1d281c;--moss:#6f825f;
          --paper:#f3ecdf;--paper2:#faf7f0;--sand:#dec99b;--ink:#151713;
          --rust:#ad4e29;--white:#faf6ed;
          background:var(--paper);color:var(--ink);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          line-height:1.35;min-height:100vh;overflow-x:hidden;padding-bottom:0
        }
        .tw *{box-sizing:border-box}
        .tw a{color:inherit}
        .tw button,.tw input,.tw select,.tw textarea{font:inherit}
        .tw .wrap{width:min(1180px,calc(100% - 40px));margin:0 auto}

        .tw .top{
          position:sticky;top:0;z-index:50;background:rgba(9,11,9,.97);
          color:var(--white);border-bottom:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(10px)
        }
        .tw .topbar{min-height:82px;display:flex;align-items:center;gap:22px}
        .tw .brand{font-size:clamp(30px,4vw,44px);font-weight:950;line-height:.86;letter-spacing:-.045em;flex:0 0 auto}
        .tw .brand small{display:block;font-size:10px;line-height:1.25;letter-spacing:.13em;color:#91a175;text-transform:uppercase;margin-top:9px}
        .tw nav{display:flex;align-items:center;gap:22px;margin-left:auto}
        .tw nav a{text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#e9e5da}
        .tw .topCta{display:flex;gap:9px;margin-left:8px}
        .tw .smallBtn{min-height:42px;padding:0 15px;border-radius:8px;text-decoration:none;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.04em}
        .tw .smallCall{background:#283422;border:1px solid #526246}
        .tw .smallText{background:var(--rust)}

        .tw .hero{position:relative;background:#0c0f0c;color:white;overflow:hidden}
        .tw .heroMedia{position:absolute;inset:0}
        .tw .heroMedia img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}
        .tw .heroShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,9,7,.94) 0%,rgba(7,9,7,.79) 31%,rgba(7,9,7,.32) 58%,rgba(7,9,7,.06) 100%)}
        .tw .heroInner{position:relative;z-index:2;min-height:620px;display:flex;align-items:center;padding:58px 0}
        .tw .heroCopy{width:min(620px,56%)}
        .tw .eyebrow,.tw .kicker{font-size:12px;font-weight:950;letter-spacing:.16em;text-transform:uppercase}
        .tw .eyebrow{color:#a7b68d;margin-bottom:16px}
        .tw h1{margin:0;color:#f7f2e8;font-size:clamp(66px,8vw,108px);line-height:.78;letter-spacing:-.07em}
        .tw h1 span{display:block;color:var(--sand)}
        .tw .lede{font-size:19px;max-width:560px;margin:25px 0 24px;color:#e7e2d8}
        .tw .actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;max-width:520px}
        .tw .btn{border:0;text-decoration:none;border-radius:8px;min-height:54px;padding:0 17px;display:flex;align-items:center;justify-content:space-between;font-weight:950;font-size:13px;text-transform:uppercase;letter-spacing:.02em;cursor:pointer}
        .tw .bid{background:#f2e8d1;color:#161913}
        .tw .visit{background:#6f835f;color:white}
        .tw .call{background:#171c15;color:#f5f1e8;border:1px solid rgba(255,255,255,.13)}
        .tw .text{background:#ad4e29;color:white}
        .tw .arr{font-size:23px;font-weight:500}

        .tw .tradeStrip{background:#d8c490;color:#151713;border-top:1px solid rgba(0,0,0,.25);border-bottom:1px solid rgba(0,0,0,.16)}
        .tw .tradeStrip .wrap{padding:11px 0;display:flex;gap:22px;overflow:auto;scrollbar-width:none;white-space:nowrap;font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}
        .tw .tradeStrip .wrap::-webkit-scrollbar{display:none}
        .tw .tradeStrip span:before{content:"■";font-size:7px;color:var(--rust);margin-right:9px;vertical-align:2px}

        .tw .section{padding:44px 0}
        .tw .services{background:var(--paper2)}
        .tw .sectionHead{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:24px}
        .tw .kicker{color:#647653}
        .tw .sectionHead h2,.tw .product h2,.tw .contact h2{font-size:clamp(42px,6vw,70px);line-height:.86;letter-spacing:-.055em;margin:6px 0 0}
        .tw .outlineBtn{border:1px solid #817869;border-radius:999px;padding:11px 18px;text-decoration:none;font-size:11px;font-weight:900;text-transform:uppercase;white-space:nowrap}
        .tw .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .tw .serviceCard{background:#121710;color:#f0ede3;border-radius:12px;padding:18px;min-height:185px;box-shadow:0 12px 28px rgba(17,24,16,.10);border-top:3px solid #71835f}
        .tw .serviceCard:nth-child(-n+4){border-top-color:var(--rust)}
        .tw .serviceIcon{font-size:29px;color:#91a574;line-height:1;margin-bottom:20px}
        .tw .serviceCard:nth-child(-n+4) .serviceIcon{color:#c06a45}
        .tw .serviceCard b{display:block;font-size:12px;letter-spacing:.11em;text-transform:uppercase;margin-bottom:9px}
        .tw .serviceCard p{margin:0;color:#d0cec5;font-size:14px}

        .tw .product{background:#11160f;color:#f6f1e6;padding:44px 0}
        .tw .productShell{border:1px solid rgba(255,255,255,.09);border-radius:15px;overflow:hidden;display:grid;grid-template-columns:.78fr 1.22fr;background:#161b14}
        .tw .productCopy{padding:31px 28px}
        .tw .product .kicker{color:#c1643f}
        .tw .product h2{font-size:clamp(43px,5vw,66px);margin-bottom:16px}
        .tw .productIntro{font-size:18px;max-width:500px;color:#e6e1d7;margin:0 0 20px}
        .tw .features{display:grid;gap:10px;font-size:15px}
        .tw .features div{display:flex;align-items:flex-start;gap:9px}
        .tw .features div:before{content:"✓";flex:0 0 21px;display:grid;place-items:center;width:21px;height:21px;border:1px solid #7e9164;border-radius:50%;color:#93a773;font-size:12px}
        .tw .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
        .tw .chip{border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}
        .tw .catalogSide{background:#fff;display:flex;flex-direction:column;min-width:0}
        .tw .catalogImage{flex:1;min-height:390px;display:grid;place-items:center;background:#fff;padding:24px}
        .tw .catalogImage img{display:block;width:100%;height:100%;max-height:460px;object-fit:contain;object-position:center;background:#fff}
        .tw .buyBar{background:#fff;color:#172017;border-top:1px solid #e4e1d8;display:flex;align-items:stretch;justify-content:flex-end}
        .tw .buyCopy{padding:13px 16px;min-width:220px}
        .tw .buyCopy b{display:block;font-size:12px;text-transform:uppercase}
        .tw .priceRow{display:flex;align-items:end;gap:12px;margin-top:2px}
        .tw .price{font-size:34px;font-weight:950;line-height:1}
        .tw .pickup{font-size:10px;font-weight:900;line-height:1.1;text-transform:uppercase}
        .tw .buyArrow{min-width:80px;background:#70815d;display:grid;place-items:center;font-size:34px;text-decoration:none}

        .tw .contact{background:#f0e8d8;padding:42px 0 46px}
        .tw .contactGrid{display:grid;grid-template-columns:.75fr 1.25fr;gap:44px;align-items:start}
        .tw .contact .kicker{color:#2d3828}
        .tw .benefits{display:grid;gap:10px;margin-top:25px;font-size:14px}
        .tw .benefits div:before{content:"✓";display:inline-grid;place-items:center;width:23px;height:23px;border:1px solid #80916b;border-radius:50%;margin-right:9px;color:#627b51}
        .tw .form{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .tw .form input,.tw .form select,.tw .form textarea{width:100%;border:1px solid #a99e89;background:#f8f2e7;border-radius:6px;padding:14px 13px;color:#191c18;outline:none}
        .tw .form textarea{grid-column:1/-1;min-height:108px;resize:vertical}
        .tw .form button{grid-column:1/-1;background:#637b52;color:white;border:0;border-radius:6px;padding:16px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;cursor:pointer}
        .tw .formStatus{grid-column:1/-1;font-size:13px;font-weight:800;min-height:18px}
        .tw .honeypot{position:absolute;left:-10000px;opacity:0}
        .tw footer{background:#171c15;color:#d0cec4;padding:22px 0}
        .tw .footer{display:flex;align-items:center;justify-content:space-between;gap:20px}
        .tw .footerBrand{font-size:24px;font-weight:950;letter-spacing:-.04em}
        .tw .footerBrand small{display:block;color:#889b6f;font-size:9px;text-transform:uppercase;letter-spacing:.1em}
        .tw .built{display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:900;text-decoration:none;border-bottom:1px solid rgba(220,199,154,.35);padding-bottom:3px}
        .tw .built span{color:#dcc79a}
        .tw .sticky{display:none}

        @media(max-width:980px){
          .tw nav{display:none}
          .tw .topCta{margin-left:auto}
          .tw .cards{grid-template-columns:repeat(2,1fr)}
          .tw .productShell{grid-template-columns:1fr}
          .tw .catalogImage{min-height:420px}
          .tw .contactGrid{grid-template-columns:1fr}
        }

        @media(max-width:640px){
          .tw{padding-bottom:78px}
          .tw .wrap{width:calc(100% - 24px)}
          .tw .topbar{min-height:72px;gap:10px}
          .tw .brand{font-size:28px}
          .tw .brand small{font-size:8px;margin-top:7px;max-width:250px}
          .tw .topCta .smallText{display:none}
          .tw .smallBtn{min-height:44px;padding:0 12px;font-size:10px}
          .tw .hero{display:flex;flex-direction:column}
          .tw .heroMedia{position:relative;inset:auto;height:285px;order:0;background:#111}
          .tw .heroMedia img{object-fit:cover;object-position:62% center}
          .tw .heroShade{display:none}
          .tw .heroInner{order:1;min-height:0;padding:25px 0 26px;background:#0c0f0c;display:block}
          .tw .heroCopy{width:100%}
          .tw .eyebrow{font-size:9px;margin-bottom:10px}
          .tw h1{font-size:clamp(54px,17vw,70px);line-height:.79}
          .tw .lede{font-size:16px;line-height:1.45;margin:17px 0 20px}
          .tw .actions{grid-template-columns:1fr 1fr;max-width:none;gap:8px}
          .tw .btn{min-height:52px;font-size:11px;padding:0 12px}
          .tw .tradeStrip .wrap{padding:10px 0;gap:16px}
          .tw .section{padding:32px 0}
          .tw .sectionHead{align-items:start}
          .tw .sectionHead h2,.tw .product h2,.tw .contact h2{font-size:44px;line-height:.9}
          .tw .outlineBtn{display:none}
          .tw .cards{grid-template-columns:1fr;gap:9px}
          .tw .serviceCard{min-height:0;padding:17px}
          .tw .serviceIcon{margin-bottom:13px}
          .tw .product{padding:30px 0}
          .tw .productShell{border-radius:12px}
          .tw .productCopy{padding:24px 20px 22px}
          .tw .productIntro{font-size:16px;line-height:1.45}
          .tw .features{font-size:14px}
          .tw .catalogSide{background:#fff}
          .tw .catalogImage{min-height:0;height:auto;aspect-ratio:1/1;padding:14px}
          .tw .catalogImage img{width:100%;height:100%;max-height:none;object-fit:contain}
          .tw .buyBar{display:grid;grid-template-columns:1fr 70px}
          .tw .buyCopy{min-width:0;padding:12px 14px}
          .tw .price{font-size:32px}
          .tw .buyArrow{min-width:0}
          .tw .contact{padding:32px 0 38px}
          .tw .contactGrid{gap:23px}
          .tw .benefits{margin-top:17px}
          .tw .form{grid-template-columns:1fr}
          .tw .form textarea,.tw .form button,.tw .formStatus{grid-column:1}
          .tw .form input,.tw .form select,.tw .form textarea{font-size:16px}
          .tw .footer{align-items:flex-start;flex-direction:column}
          .tw .sticky{
            position:fixed;z-index:100;left:12px;right:12px;bottom:10px;
            display:grid;grid-template-columns:1fr 1fr;gap:8px;
            background:#10140f;padding:8px;border-radius:17px;
            box-shadow:0 10px 35px rgba(0,0,0,.38)
          }
          .tw .sticky a{min-height:52px;border-radius:11px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:18px;font-weight:900}
          .tw .stickyCall{background:#738768;color:white}
          .tw .stickyText{background:#ad4e29;color:white}
        }

        @media(max-width:380px){
          .tw .brand{font-size:25px}
          .tw .brand small{max-width:210px}
          .tw .heroMedia{height:250px}
          .tw h1{font-size:52px}
          .tw .actions{grid-template-columns:1fr}
          .tw .topCta .smallBtn{padding:0 10px}
        }
      `}</style>

      <header className="top">
        <div className="wrap topbar">
          <div className="brand">
            TYLER WARD
            <small>General contracting · construction · property & landscape</small>
          </div>
          <nav aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#product">Featured piece</a>
            <a href="#contact">Request a bid</a>
          </nav>
          <div className="topCta">
            <a className="smallBtn smallCall" href={`tel:${PHONE}`}>☎ Call Tyler</a>
            <a className="smallBtn smallText" href={`sms:${PHONE}`}>Text Tyler</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="heroMedia" aria-hidden="true">
            <img src={hero} alt="" fetchPriority="high" />
          </div>
          <div className="heroShade" />
          <div className="wrap heroInner">
            <div className="heroCopy">
              <div className="eyebrow">Eden · Ogden Valley · Mountain homes</div>
              <h1>Built for <span>mountain life.</span></h1>
              <p className="lede">
                General construction, remodels, flooring, repairs, outdoor builds, landscaping,
                snow removal and year-round property work for homes in Eden and the surrounding valley.
              </p>
              <div className="actions">
                <button className="btn bid" type="button" onClick={() => jumpToForm('bid_request')}>
                  Request a bid <span className="arr">→</span>
                </button>
                <button className="btn visit" type="button" onClick={() => jumpToForm('site_visit')}>
                  Book a site visit <span>▣</span>
                </button>
                <a className="btn call" href={`tel:${PHONE}`}>Call Tyler <span>☎</span></a>
                <a className="btn text" href={`sms:${PHONE}`}>Text Tyler <span>▢</span></a>
              </div>
            </div>
          </div>
        </section>

        <div className="tradeStrip">
          <div className="wrap">
            <span>General contractor</span><span>Remodels</span><span>Flooring</span>
            <span>Outdoor builds</span><span>Landscape</span><span>Snow removal</span>
          </div>
        </div>

        <section id="services" className="section services">
          <div className="wrap">
            <div className="sectionHead">
              <div>
                <div className="kicker">What we do</div>
                <h2>Full-service contracting.<br />Built for Eden.</h2>
              </div>
              <a className="outlineBtn" href="#contact">Get a bid →</a>
            </div>
            <div className="cards">
              {services.map(([icon, title, copy]) => (
                <article className="serviceCard" key={title}>
                  <div className="serviceIcon">{icon}</div>
                  <b>{title}</b>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="product">
          <div className="wrap">
            <div className="productShell">
              <div className="productCopy">
                <div className="kicker">Limited. Authentic. One of a kind.</div>
                <h2>Make Love,<br />Not War.</h2>
                <p className="productIntro">
                  Genuine WWII .50 caliber ammunition crates, repurposed and planted with premium soil and seasonal flowers.
                </p>
                <div className="features">
                  <div>Real WWII .50 caliber ammunition crates</div>
                  <div>Planted with premium soil & seasonal flowers</div>
                  <div>Limited supply — each one is unique</div>
                  <div>Local pickup in Eden, Utah</div>
                </div>
                <div className="chips">
                  <span className="chip">Limited supply</span>
                  <span className="chip">WWII .50 cal crates</span>
                  <span className="chip">Pickup in Eden</span>
                </div>
              </div>
              <div className="catalogSide">
                <div className="catalogImage">
                  <img src={crateHero} alt="Flower-filled vintage .50 caliber ammunition crate planter on a white catalog background" loading="lazy" />
                </div>
                <div className="buyBar">
                  <div className="buyCopy">
                    <b>Reserve a crate</b>
                    <div className="priceRow">
                      <span className="price">$495</span>
                      <span className="pickup">Local pickup<br />in Eden, Utah</span>
                    </div>
                  </div>
                  <a className="buyArrow" href={CRATE_CHECKOUT} target="_blank" rel="noreferrer" aria-label="Reserve a crate">→</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap contactGrid">
            <div>
              <div className="kicker">Construction, landscape or property work?</div>
              <h2>Let’s get your<br />project moving.</h2>
              <div className="benefits">
                <div>Fast, local response</div>
                <div>Straight answers</div>
                <div>No obligation</div>
                <div>Call or text: {PHONE_DISPLAY}</div>
              </div>
            </div>
            <form className="form" onSubmit={submitLead}>
              <input name="name" placeholder="Your name" required />
              <input name="contact" placeholder="Phone or email" inputMode="email" required />
              <select name="project_type" defaultValue="">
                <option value="" disabled>Project type</option>
                <option>General construction</option>
                <option>Remodel / renovation</option>
                <option>Flooring / finish work</option>
                <option>Repair / maintenance</option>
                <option>Outdoor build / hardscape</option>
                <option>Landscape / property work</option>
                <option>Snow removal</option>
                <option>Other</option>
              </select>
              <input name="preferred_day" placeholder="Preferred day / time" />
              <textarea name="message" placeholder="Tell us about your project…" required />
              <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" />
              <button type="submit">{kind === 'site_visit' ? 'Request site visit →' : 'Send request →'}</button>
              <div className="formStatus" role="status">{status}</div>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer">
          <div className="footerBrand">
            TYLER WARD
            <small>General contracting · construction · property & landscape</small>
          </div>
          <a className="built" href="/">Built by <span>misfit MEdiAHouse</span></a>
        </div>
      </footer>

      <div className="sticky" aria-label="Quick contact">
        <a className="stickyCall" href={`tel:${PHONE}`}>Call Tyler</a>
        <a className="stickyText" href={`sms:${PHONE}`}>Text Tyler</a>
      </div>
    </div>
  );
}
