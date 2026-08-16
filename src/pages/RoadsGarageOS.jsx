import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BatteryCharging,
  Boxes,
  CarFront,
  ChevronRight,
  Gauge,
  Radio,
  ShoppingBag,
  Sparkles,
  Upload,
  Wrench,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MODULES = [
  {
    key: 'tool_dna',
    title: 'Tool DNA',
    eyebrow: 'VEHICLE-SPECIFIC FIELD KIT',
    icon: Wrench,
    description: 'Build the tool, spare-parts and consumables loadout for your exact vehicle instead of hauling a generic toolbox.',
    bullets: ['Roadside → Overland → Field Service → Master tiers', 'Tool-size + failure-mode mapping', 'Future Snap-on custom-kitting pathway'],
  },
  {
    key: 'wheel_lab',
    title: 'Wheel Lab',
    eyebrow: 'FITMENT + VISUAL COMMERCE',
    icon: CarFront,
    description: 'Upload your vehicle, save your fitment profile, compare wheel/tire directions and hand the exact build intent into commerce.',
    bullets: ['fifteen52 discovery path', 'AI-render pipeline staged next', 'Fitment + purchase attribution retained'],
  },
  {
    key: 'overland_power',
    title: 'Power Command',
    eyebrow: 'SOLAR + BATTERY + DC',
    icon: BatteryCharging,
    description: 'Vehicle-specific power architecture for camp loads, charging, refrigeration, recovery, lighting and communications.',
    bullets: ['Solar + DC-DC + alternator strategy', 'Battery / inverter / fuse sizing guides', 'Affiliate-ready bill of materials'],
  },
  {
    key: 'comms_command',
    title: 'Comms Command',
    eyebrow: 'SATELLITE + RADIO + NAV',
    icon: Radio,
    description: 'Build the communications stack around how and where the vehicle actually travels.',
    bullets: ['Satellite + radio + antenna architecture', 'Emergency and navigation redundancy', 'Install guides + tracked parts paths'],
  },
  {
    key: 'tuner_lab',
    title: 'Tuner Lab',
    eyebrow: 'TELEMETRY + DYNO HISTORY',
    icon: Gauge,
    description: 'A vehicle health and performance notebook for OBD/CAN telemetry, dyno results, maintenance hours and configuration history.',
    bullets: ['RPM / temperature / pressure / DTC logs', 'Dyno pull and tune-version history', 'Maintenance-hour and service records'],
  },
  {
    key: 'roads_merch',
    title: 'Roads Supply',
    eyebrow: 'MERCH + CULTURE',
    icon: ShoppingBag,
    description: 'Roads Co. apparel and automotive culture products inside the same measurable customer journey.',
    bullets: ['Campaign / creator / QR source retained', 'Clickout attribution', 'Order reconciliation ready'],
  },
];

const KIT_TIERS = [
  ['roadside', 'Roadside', 'Minimum get-home tools + diagnostics'],
  ['overland', 'Overland', 'Roadside + recovery + common field failures'],
  ['field_service', 'Field Service', 'System-level repairs without shop equipment'],
  ['master', 'Master', 'Maximum self-reliance; optimized against duplicate weight'],
];

const PARTNER_LINKS = {
  roads_collective: 'https://roadscollective.com/collections/all',
  fifteen52: 'https://fifteen52.com/',
  snap_on: 'https://sbs.snapon.com/automotive/special-projects/special-projectsoem/',
};

function getAnonymousId() {
  const key = 'misfit_roads_anon_id';
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = `roads_${crypto.randomUUID()}`;
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return `roads_${crypto.randomUUID()}`;
  }
}

function getTrafficContext() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || params.get('source') || 'direct',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    referrer: document.referrer || '',
    landingPage: `${window.location.pathname}${window.location.search}`,
  };
}

async function emitRoadsEvent(payload) {
  const body = {
    anonymousId: getAnonymousId(),
    ...getTrafficContext(),
    ...payload,
  };
  try {
    await fetch('/api/roads-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Attribution should never block the customer experience.
  }
}

function SectionLabel({ children }) {
  return <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">{children}</div>;
}

function PartnerBadge({ children, status }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="text-sm font-semibold text-white">{children}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{status}</div>
    </div>
  );
}

export default function RoadsGarageOS() {
  const [vehicle, setVehicle] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    engine: '',
    drivetrain: '',
    mods: '',
  });
  const [vehicleSaved, setVehicleSaved] = useState(false);
  const [kitTier, setKitTier] = useState('field_service');
  const [kitStatus, setKitStatus] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [wheelStatus, setWheelStatus] = useState('');
  const [wheelDirection, setWheelDirection] = useState('52offroad');

  useEffect(() => {
    emitRoadsEvent({ eventType: 'page_view', moduleKey: 'roads_garage_os' });
  }, []);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const normalizedVehicle = useMemo(() => ({
    year: vehicle.year ? Number(vehicle.year) : undefined,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    engine: vehicle.engine,
    drivetrain: vehicle.drivetrain,
    mods: vehicle.mods ? { notes: vehicle.mods } : {},
  }), [vehicle]);

  const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');

  function updateVehicle(key, value) {
    setVehicle((current) => ({ ...current, [key]: value }));
    setVehicleSaved(false);
  }

  async function saveVehicle(event) {
    event.preventDefault();
    if (!vehicle.year || !vehicle.make || !vehicle.model) return;
    await emitRoadsEvent({
      eventType: 'vehicle_profile',
      moduleKey: 'vehicle_intake',
      vehicle: normalizedVehicle,
      metadata: { trim: vehicle.trim, mods_text: vehicle.mods },
    });
    setVehicleSaved(true);
  }

  async function openModule(module) {
    await emitRoadsEvent({
      eventType: 'module_open',
      moduleKey: module.key,
      vehicle: normalizedVehicle,
    });
    document.getElementById(module.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function buildKit(event) {
    event.preventDefault();
    if (!vehicle.year || !vehicle.make || !vehicle.model) {
      setKitStatus('Add your year, make and model above first.');
      document.getElementById('vehicle-intake')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    await emitRoadsEvent({
      eventType: 'calculator_submit',
      moduleKey: 'tool_dna',
      offerKey: 'snap_on_vehicle_kit',
      partnerKey: 'snap_on',
      vehicle: normalizedVehicle,
      metadata: { requested_tier: kitTier },
    });
    setKitStatus(`${vehicleLabel}: ${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} build profile captured. Exact fastener/tool mapping is generated only from verified vehicle service data.`);
  }

  function selectVehicleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const next = URL.createObjectURL(file);
    setImagePreview(next);
    setWheelStatus('');
    emitRoadsEvent({
      eventType: 'visualizer_image_selected',
      moduleKey: 'wheel_lab',
      offerKey: 'fifteen52_wheels',
      partnerKey: 'fifteen52',
      vehicle: normalizedVehicle,
      metadata: { file_type: file.type, file_size: file.size },
    });
  }

  async function queueWheelBrief() {
    if (!imagePreview) {
      setWheelStatus('Upload a vehicle photo first.');
      return;
    }
    await emitRoadsEvent({
      eventType: 'wheel_visualizer_open',
      moduleKey: 'wheel_lab',
      offerKey: 'fifteen52_wheels',
      partnerKey: 'fifteen52',
      vehicle: normalizedVehicle,
      metadata: { wheel_direction: wheelDirection, render_pipeline: 'staged_not_live' },
    });
    setWheelStatus('Build brief captured. The attribution + fitment profile is live; photoreal AI wheel rendering is the next pipeline connection, so this screen will not fake a render.');
  }

  async function outbound(partnerKey, offerKey, url, moduleKey) {
    const clickId = `clk_${crypto.randomUUID()}`;
    await emitRoadsEvent({
      eventType: 'partner_clickout',
      partnerKey,
      offerKey,
      moduleKey,
      outboundUrl: url,
      clickId,
      vehicle: normalizedVehicle,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <Navbar />

      <main className="pt-20">
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(244,63,94,0.12),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl bg-white p-2">
                  <img src="/roads-co-logo.svg" alt="Roads Co." className="h-12 w-auto" />
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">×</div>
                <img src="/misfit-skull.svg" alt="Misfit Mediahouse" className="h-16 w-16 rounded-2xl border border-cyan-400/30 object-cover" />
              </div>

              <SectionLabel>Roads Co. × Misfit Mediahouse</SectionLabel>
              <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.86] sm:text-7xl lg:text-8xl">
                Roads<br /><span className="text-cyan-300">Garage OS</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                Vehicle intelligence becomes commerce: exact-tool profiles, wheel and tire visualization, overland power, communications, telemetry, merch and fabrication paths — with Misfit attribution underneath every measurable touch.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="rounded-full border border-white/15 px-4 py-2 text-white">Roads Co. → Brand + Culture</span>
                <span className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-cyan-200">Misfit → Systems + Software + Intelligence</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-2xl font-bold uppercase">Revenue instrumentation</div>
                  <div className="mt-1 text-sm text-slate-400">Live architecture, honest commercial status.</div>
                </div>
                <Activity className="text-cyan-300" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <PartnerBadge status="OWNED SYSTEM LAYER">Misfit Mediahouse</PartnerBadge>
                <PartnerBadge status="BRAND COLLABORATION PLANNED">Roads Co.</PartnerBadge>
                <PartnerBadge status="COMMERCIAL TERMS PENDING">fifteen52</PartnerBadge>
                <PartnerBadge status="CUSTOM-KITTING OUTREACH PENDING">Snap-on</PartnerBadge>
              </div>
              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-6 text-slate-500">
                Traffic and conversion attribution can be recorded now. Commission is not booked as earned until an active partner agreement and order-level reconciliation support it.
              </p>
            </div>
          </div>
        </section>

        <section id="vehicle-intake" className="border-b border-white/10 bg-[#090909]">
          <div className="mx-auto max-w-7xl px-5 py-14">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <SectionLabel>01 / Vehicle identity</SectionLabel>
                <h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">Build the profile once.</h2>
                <p className="mt-4 max-w-xl leading-7 text-slate-400">The vehicle profile becomes the common key for tools, spares, wheels, tires, power, communications and telemetry.</p>
              </div>
              <form onSubmit={saveVehicle} className="grid gap-3 rounded-3xl border border-white/10 bg-black p-5 sm:grid-cols-2 sm:p-7">
                {[
                  ['year', 'Year', '1997'],
                  ['make', 'Make', 'Chevrolet'],
                  ['model', 'Model', 'Suburban K1500'],
                  ['trim', 'Trim', 'LS'],
                  ['engine', 'Engine', '5.7L Vortec L31'],
                  ['drivetrain', 'Drivetrain', '4x4'],
                ].map(([key, label, placeholder]) => (
                  <label key={key} className="grid gap-2 text-sm text-slate-300">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
                    <input
                      value={vehicle[key]}
                      onChange={(e) => updateVehicle(key, e.target.value)}
                      placeholder={placeholder}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/60"
                    />
                  </label>
                ))}
                <label className="grid gap-2 text-sm text-slate-300 sm:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Mods / use</span>
                  <textarea
                    value={vehicle.mods}
                    onChange={(e) => updateVehicle('mods', e.target.value)}
                    placeholder="40s, overland, tow rig, track car, daily driver..."
                    rows={3}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/60"
                  />
                </label>
                <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black">
                  {vehicleSaved ? 'Vehicle profile saved' : 'Save vehicle profile'} <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <SectionLabel>02 / Commerce modules</SectionLabel>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <button key={module.key} type="button" onClick={() => openModule(module)} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-left transition hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-white/[0.055]">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="text-cyan-300" />
                    <ChevronRight className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{module.eyebrow}</div>
                  <div className="mt-2 font-display text-3xl font-black uppercase">{module.title}</div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{module.description}</p>
                  <div className="mt-5 space-y-2 text-xs text-slate-500">
                    {module.bullets.map((bullet) => <div key={bullet}>• {bullet}</div>)}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="tool_dna" className="scroll-mt-24 border-y border-white/10 bg-[#090909]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2">
            <div>
              <SectionLabel>Tool DNA</SectionLabel>
              <h2 className="mt-3 font-display text-5xl font-black uppercase">Stop carrying dead weight.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-400">The target product is a verified fastener → tool → failure → spare map for the exact vehicle. We do not invent socket sizes when service data has not been verified.</p>
              <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/80">
                Snap-on supports custom kitted solutions, but Misfit does not currently claim a Snap-on commission agreement. The system records demand now so a commercial relationship can be negotiated against real pipeline data.
              </div>
            </div>
            <form onSubmit={buildKit} className="rounded-3xl border border-white/10 bg-black p-6">
              <div className="font-display text-2xl font-bold uppercase">Choose self-reliance level</div>
              <div className="mt-5 grid gap-3">
                {KIT_TIERS.map(([key, label, description]) => (
                  <label key={key} className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${kitTier === key ? 'border-cyan-400/50 bg-cyan-400/[0.08]' : 'border-white/10 bg-white/[0.025]'}`}>
                    <input type="radio" name="kitTier" value={key} checked={kitTier === key} onChange={() => setKitTier(key)} className="mt-1" />
                    <span>
                      <span className="block font-semibold text-white">{label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black">Build my Tool DNA profile</button>
              {kitStatus && <div className="mt-4 rounded-xl border border-white/10 p-4 text-sm leading-6 text-slate-300">{kitStatus}</div>}
              <button type="button" onClick={() => outbound('snap_on', 'snap_on_vehicle_kit', PARTNER_LINKS.snap_on, 'tool_dna')} className="mt-4 w-full rounded-xl border border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-white">See Snap-on custom-kitting capability</button>
            </form>
          </div>
        </section>

        <section id="wheel_lab" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionLabel>Wheel Lab</SectionLabel>
              <h2 className="mt-3 font-display text-5xl font-black uppercase">See it. Fit it. Attribute it.</h2>
              <p className="mt-5 leading-7 text-slate-400">The wheel flow binds the vehicle image, fitment intent, wheel family, source campaign and eventual order together. Fifteen52 is the wheel path currently surfaced in Roads content; dealer/commercial terms remain pending.</p>
              <button type="button" onClick={() => outbound('fifteen52', 'fifteen52_wheels', PARTNER_LINKS.fifteen52, 'wheel_lab')} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">Explore fifteen52 <ChevronRight size={16} /></button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <label className="flex min-h-64 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-black">
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded vehicle preview" className="h-full max-h-96 w-full object-contain" />
                ) : (
                  <div className="text-center text-slate-500">
                    <Upload className="mx-auto mb-3" />
                    <div className="font-mono text-xs uppercase tracking-[0.16em]">Upload your vehicle</div>
                    <div className="mt-2 text-xs">JPG / PNG / WEBP</div>
                  </div>
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectVehicleImage} className="hidden" />
              </label>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <select value={wheelDirection} onChange={(e) => setWheelDirection(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none">
                  <option value="52offroad">52 Offroad</option>
                  <option value="rally_sport">Rally Sport</option>
                  <option value="super_touring">Super Touring</option>
                  <option value="outlaw">52 Outlaw</option>
                </select>
                <button type="button" onClick={queueWheelBrief} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.13em] text-black"><Sparkles size={16} /> Create render brief</button>
              </div>
              {wheelStatus && <div className="mt-4 rounded-xl border border-white/10 p-4 text-xs leading-6 text-slate-400">{wheelStatus}</div>}
            </div>
          </div>
        </section>

        <section id="overland_power" className="scroll-mt-24 border-y border-white/10 bg-[#090909]">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black p-7">
              <BatteryCharging className="text-cyan-300" />
              <div className="mt-6 font-display text-3xl font-black uppercase">Overland Power Command</div>
              <p className="mt-4 leading-7 text-slate-400">Solar, alternator, DC-DC, battery, inverter, fuse, refrigeration, camp-load and emergency-power architecture built from the actual vehicle and load profile.</p>
              <button type="button" onClick={() => emitRoadsEvent({ eventType: 'lead_intent', moduleKey: 'overland_power', offerKey: 'overland_power', vehicle: normalizedVehicle })} className="mt-6 rounded-xl border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em]">Save power build interest</button>
            </div>
            <div id="comms_command" className="scroll-mt-24 rounded-3xl border border-white/10 bg-black p-7">
              <Radio className="text-cyan-300" />
              <div className="mt-6 font-display text-3xl font-black uppercase">Comms Command</div>
              <p className="mt-4 leading-7 text-slate-400">Satellite, radio, antennas, navigation, emergency signaling and redundant charging organized around terrain, distance and failure modes.</p>
              <button type="button" onClick={() => emitRoadsEvent({ eventType: 'lead_intent', moduleKey: 'comms_command', offerKey: 'overland_comms', vehicle: normalizedVehicle })} className="mt-6 rounded-xl border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em]">Save comms build interest</button>
            </div>
          </div>
        </section>

        <section id="tuner_lab" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_.85fr]">
            <div>
              <SectionLabel>Tuner Lab</SectionLabel>
              <h2 className="mt-3 font-display text-5xl font-black uppercase">The car gets a memory.</h2>
              <p className="mt-5 max-w-3xl leading-7 text-slate-400">Capture the information that normally dies in screenshots and shop conversations: DTCs, engine hours, temperatures, boost, AFR where equipped, dyno pulls, tune versions, maintenance events and hardware changes.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Engine hours', 'DTC history', 'Dyno pulls', 'Tune versions', 'Service log', 'Sensor trends'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 font-mono text-[11px] uppercase tracking-[0.13em] text-slate-300">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="roads_merch" className="scroll-mt-24 border-y border-white/10 bg-white text-black">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[auto_1fr_auto]">
            <img src="/roads-co-logo.svg" alt="Roads Co." className="h-20 w-auto max-w-full" />
            <div>
              <div className="font-display text-3xl font-black uppercase">Roads culture stays Roads.</div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">Misfit powers the measurable journey underneath it: source → vehicle → module → offer → click → conversion → commission status.</p>
            </div>
            <button type="button" onClick={() => outbound('roads_collective', 'roads_merch', PARTNER_LINKS.roads_collective, 'roads_merch')} className="rounded-xl bg-black px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">Shop Roads Co.</button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-[2rem] border border-cyan-400/25 bg-cyan-400/[0.06] p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-3xl">
                <SectionLabel>Misfit attribution spine</SectionLabel>
                <h2 className="mt-3 font-display text-4xl font-black uppercase">Every angle points back to the system.</h2>
                <p className="mt-4 leading-7 text-slate-300">The backend records first touch, last touch, campaign, vehicle, module, partner, offer, outbound click and eventual conversion reconciliation. Contracted commission and uncontracted modeled opportunity remain deliberately separate.</p>
              </div>
              <div className="grid min-w-64 gap-2 font-mono text-[11px] uppercase tracking-[0.13em] text-slate-400">
                {['Creator + QR traffic', 'Tool kit demand', 'Wheel visualizer intent', 'Roads merch clickouts', 'Overland affiliate paths', 'Telemetry product leads'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">{item}</div>)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
