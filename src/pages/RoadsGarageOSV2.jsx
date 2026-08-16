import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BadgeDollarSign,
  BatteryCharging,
  CarFront,
  ChevronRight,
  CircleGauge,
  ExternalLink,
  Gauge,
  Radio,
  Rocket,
  ShoppingBag,
  Sparkles,
  Upload,
  Users,
  Warehouse,
  Wrench,
  Zap,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const PRIVATE_BACK_OFFICE = 'https://roads-growth-command-center.pricemedia82.chatgpt.site/';

const PARTNER_LINKS = {
  roads_collective: 'https://roadscollective.com/collections/all',
  fifteen52: 'https://fifteen52.com/',
  snap_on: 'https://sbs.snapon.com/automotive/special-projects/special-projectsoem/',
};

const COMMERCE_MODULES = [
  {
    key: 'tool_dna', title: 'Tool DNA', eyebrow: 'TOOLS + SPARES', icon: Wrench,
    copy: 'Vehicle-specific field-service kits built from verified fastener, failure-mode and spare-part data.',
    state: 'LIVE INTAKE / KNOWLEDGE GRAPH BUILDING',
  },
  {
    key: 'wheel_lab', title: 'Wheel Lab', eyebrow: 'FITMENT + VISUAL COMMERCE', icon: CarFront,
    copy: 'Vehicle photo + fitment intent + wheel/tire selection + attributable purchase path.',
    state: 'LIVE INTAKE / RENDER PIPELINE NEXT',
  },
  {
    key: 'power_command', title: 'Power Command', eyebrow: 'SOLAR + DC + BATTERY', icon: BatteryCharging,
    copy: 'Overland electrical builds around actual vehicle loads, charging, refrigeration and emergency power.',
    state: 'LIVE INTAKE / BOM LAYER READY',
  },
  {
    key: 'comms_command', title: 'Comms Command', eyebrow: 'SATELLITE + RADIO + NAV', icon: Radio,
    copy: 'Communications architecture around terrain, range, emergency signaling and power redundancy.',
    state: 'LIVE INTAKE / BOM LAYER READY',
  },
  {
    key: 'tuner_lab', title: 'Tuner Lab', eyebrow: 'VEHICLE MEMORY', icon: Gauge,
    copy: 'OBD/CAN telemetry, DTC history, engine hours, dyno pulls, tune versions and maintenance records.',
    state: 'SCHEMA LIVE / DEVICE INGEST NEXT',
  },
  {
    key: 'roads_supply', title: 'Roads Supply', eyebrow: 'MERCH + HARD GOODS', icon: ShoppingBag,
    copy: 'Roads products, premium supply routing, tracked clickouts and eventual order reconciliation.',
    state: 'ATTRIBUTION LIVE / COMMERCE CONNECTORS NEXT',
  },
];

const ENGINE_STACK = [
  ['growth_engine', 'ROADS ENGINE', 'Garage profiles → segments → personalized drops', Rocket, 'ACTIVE'],
  ['alliance_engine', 'ALLIANCE ENGINE', 'Sponsors → affiliates → ambassadors → payouts', Users, 'ACTIVE'],
  ['supply_engine', 'SUPPLY ENGINE', 'Suppliers → routing → fulfillment → margin', Warehouse, 'ACTIVE'],
  ['xp_engine', 'XP ENGINE', 'Miles / XP → levels → quests → loyalty', Zap, 'SCHEMA LIVE'],
  ['creator_engine', 'CREATOR ENGINE', 'UGC → rights → creators → collab drops', Sparkles, 'SCHEMA LIVE'],
  ['signal_engine', 'SIGNAL ENGINE', 'Metrics → insights → next best moves', CircleGauge, 'SCHEMA LIVE'],
];

const KIT_TIERS = [
  ['roadside', 'Roadside', 'Get-home diagnostics and minimum repair loadout'],
  ['overland', 'Overland', 'Roadside + recovery + common remote failures'],
  ['field_service', 'Field Service', 'System-level field repair without shop equipment'],
  ['master', 'Master', 'Maximum self-reliance with duplicate-weight optimization'],
];

function anonymousId() {
  const key = 'misfit_roads_anon_id';
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const created = `roads_${crypto.randomUUID()}`;
    localStorage.setItem(key, created);
    return created;
  } catch {
    return `roads_${crypto.randomUUID()}`;
  }
}

function trafficContext() {
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get('utm_source') || p.get('source') || 'direct',
    medium: p.get('utm_medium') || '',
    campaign: p.get('utm_campaign') || '',
    creatorToken: p.get('creator') || p.get('creator_id') || '',
    referralToken: p.get('ref') || p.get('referral') || '',
    qrToken: p.get('qr') || '',
    referrer: document.referrer || '',
    landingPage: `${window.location.pathname}${window.location.search}`,
  };
}

async function emitRoadsEvent(payload) {
  const body = { anonymousId: anonymousId(), ...trafficContext(), ...payload };
  try {
    const response = await fetch('/api/roads-event', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true,
    });
    return await response.json().catch(() => ({}));
  } catch {
    return { ok: false };
  }
}

async function roadsIntake(payload) {
  try {
    const response = await fetch('/api/roads-intake', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymousId: anonymousId(), ...payload }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Roads intake failed');
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Roads intake failed' };
  }
}

function Label({ children }) {
  return <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff5733]">{children}</div>;
}

function Status({ children }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-slate-400">{children}</span>;
}

export default function RoadsGarageOSV2() {
  const [vehicle, setVehicle] = useState({ year: '', make: '', model: '', trim: '', engine: '', transmission: '', drivetrain: '', tireSize: '', wheelSize: '', mods: '' });
  const [vehicleResult, setVehicleResult] = useState('');
  const [kitTier, setKitTier] = useState('field_service');
  const [kitResult, setKitResult] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [wheelDirection, setWheelDirection] = useState('52offroad');
  const [wheelResult, setWheelResult] = useState('');
  const [powerResult, setPowerResult] = useState('');
  const [commsResult, setCommsResult] = useState('');

  useEffect(() => {
    emitRoadsEvent({ eventType: 'page_view', moduleKey: 'roads_garage_os_v2', metadata: { surface: 'misfit_public_bridge' } });
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
    transmission: vehicle.transmission,
    drivetrain: vehicle.drivetrain,
    tireSize: vehicle.tireSize,
    wheelSize: vehicle.wheelSize,
    mods: vehicle.mods ? { notes: vehicle.mods } : {},
    useCases: ['automotive_commerce'],
  }), [vehicle]);

  const vehicleReady = Boolean(vehicle.year && vehicle.make && vehicle.model);
  const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');

  function setField(key, value) {
    setVehicle((current) => ({ ...current, [key]: value }));
    setVehicleResult('');
  }

  async function saveVehicle(event) {
    event.preventDefault();
    if (!vehicleReady) return setVehicleResult('Year, make and model are required.');
    await emitRoadsEvent({ eventType: 'vehicle_profile_submit', moduleKey: 'vehicle_intake', vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_vehicle_profile', vehicle: normalizedVehicle, metadata: { source_surface: 'roads_garage_v2' } });
    setVehicleResult(result.ok ? `Saved ${vehicleLabel} to the Roads vehicle graph.` : result.error);
  }

  async function buildKit(event) {
    event.preventDefault();
    if (!vehicleReady) return setKitResult('Build the vehicle profile first.');
    await emitRoadsEvent({ eventType: 'calculator_submit', moduleKey: 'tool_dna', partnerKey: 'snap_on', offerKey: 'vehicle_specific_toolkit', vehicle: normalizedVehicle, metadata: { requested_tier: kitTier } });
    const result = await roadsIntake({ action: 'build_toolkit_profile', vehicle: normalizedVehicle, tier: kitTier, vendorPreferences: { preferred_vendor: 'snap_on', commercial_terms: 'pending' } });
    setKitResult(result.ok
      ? `${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} profile ${result.toolkitBuildId.slice(0, 8)} captured. Exact tool sizes remain locked until verified service data is attached.`
      : result.error);
  }

  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    setImageMeta({ name: file.name, type: file.type, size: file.size });
    setWheelResult('');
    emitRoadsEvent({ eventType: 'visualizer_image_selected', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', vehicle: normalizedVehicle, metadata: { file_type: file.type, file_size: file.size } });
  }

  async function createWheelBrief() {
    if (!vehicleReady) return setWheelResult('Build the vehicle profile first.');
    if (!imageMeta) return setWheelResult('Upload a vehicle photo first.');
    await emitRoadsEvent({ eventType: 'wheel_visualizer_submit', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', offerKey: 'wheel_visualizer', vehicle: normalizedVehicle, metadata: { wheel_direction: wheelDirection } });
    const result = await roadsIntake({
      action: 'create_visualizer_job', vehicle: normalizedVehicle, partnerKey: 'fifteen52',
      sourceAssetRef: `local_pending_upload:${imageMeta.name}`,
      wheelSpec: { direction: wheelDirection }, tireSpec: {},
      metadata: { source_file_type: imageMeta.type, source_file_size: imageMeta.size },
    });
    setWheelResult(result.ok
      ? `Visualizer job ${result.visualizerJobId.slice(0, 8)} saved. Real image rendering is not connected yet, so we are not faking the output.`
      : result.error);
  }

  async function saveGuide(type) {
    if (!vehicleReady) {
      const setter = type === 'power' ? setPowerResult : setCommsResult;
      return setter('Build the vehicle profile first.');
    }
    const moduleKey = type === 'power' ? 'power_command' : 'comms_command';
    await emitRoadsEvent({ eventType: 'guide_intent', moduleKey, offerKey: moduleKey, vehicle: normalizedVehicle });
    const result = await roadsIntake({
      action: 'save_overland_interest', vehicle: normalizedVehicle, guideType: type,
      title: `${type === 'power' ? 'Power' : 'Comms'} Command — ${vehicleLabel}`,
      useCase: 'vehicle-specific overland architecture',
      assumptions: { affiliate_bom: 'planned', verified_fitment_required: true },
    });
    const setter = type === 'power' ? setPowerResult : setCommsResult;
    setter(result.ok ? `Saved build ${result.guideId.slice(0, 8)} to Roads.` : result.error);
  }

  async function outbound(partnerKey, offerKey, url, moduleKey) {
    await emitRoadsEvent({
      eventType: 'partner_clickout', partnerKey, offerKey, moduleKey, outboundUrl: url,
      clickId: `clk_${crypto.randomUUID()}`, vehicle: normalizedVehicle,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function openPrivateBackOffice() {
    await emitRoadsEvent({ eventType: 'back_office_open', moduleKey: 'roads_command_center', outboundUrl: PRIVATE_BACK_OFFICE, metadata: { access: 'private_authenticated_surface' } });
    window.open(PRIVATE_BACK_OFFICE, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0d0d] text-white">
      <Navbar />
      <main className="pt-20">
        <section className="border-b border-white/10 bg-[#f2efe7] text-[#0b0d0d]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-black/15 pb-7">
              <div className="flex items-center gap-4">
                <img src="/roads-co-logo.svg" alt="Roads Co." className="h-14 w-auto mix-blend-multiply" />
                <span className="font-mono text-xs text-black/35">×</span>
                <div>
                  <div className="font-display text-xl font-black uppercase">Misfit Mediahouse</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45">Systems · Software · Intelligence · Attribution</div>
                </div>
              </div>
              <button type="button" onClick={openPrivateBackOffice} className="inline-flex items-center gap-2 bg-[#ff5733] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                Open private Roads back office <ExternalLink size={14} />
              </button>
            </div>

            <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-black/45">Roads Garage OS / Growth Command Commerce Layer</div>
                <h1 className="mt-5 max-w-5xl font-display text-6xl font-black uppercase leading-[0.82] sm:text-8xl lg:text-9xl">
                  The car becomes<br/><span className="font-serif font-normal italic lowercase text-[#ff5733]">the customer key.</span>
                </h1>
              </div>
              <div className="border-l border-black/15 pl-6">
                <p className="text-lg leading-8 text-black/65">One vehicle profile powers tools, wheels, tires, solar, communications, telemetry, merch, creators, partners and future fabrication offers. Misfit retains the measurable revenue trail underneath it.</p>
              </div>
            </div>

            <div className="grid border border-black/15 sm:grid-cols-3">
              {[
                ['FIRST / LAST / FINAL', 'Attribution'],
                ['VEHICLE → OFFER → ORDER', 'Commerce graph'],
                ['UNCONTRACTED ≠ EARNED', 'Commission truth'],
              ].map(([value, label]) => (
                <div key={label} className="border-b border-black/15 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">{label}</div>
                  <div className="mt-2 font-display text-xl font-black uppercase">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#101313]">
          <div className="mx-auto max-w-7xl px-5 py-14">
            <Label>00 / The Roads engine stack</Label>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ENGINE_STACK.map(([key, title, copy, Icon, state]) => (
                <button key={key} type="button" onClick={() => emitRoadsEvent({ eventType: 'engine_interest', moduleKey: key, vehicle: normalizedVehicle })} className="group border border-white/10 bg-white/[0.025] p-5 text-left transition hover:border-[#ff5733]/50 hover:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-4"><Icon className="text-[#ff5733]"/><Status>{state}</Status></div>
                  <div className="mt-8 font-display text-2xl font-black uppercase">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="vehicle-intake" className="border-b border-white/10 bg-[#0b0d0d]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <Label>01 / Vehicle identity</Label>
              <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Tell Roads what you drive once.</h2>
              <p className="mt-5 leading-7 text-slate-400">This is the durable commerce key. Tool DNA, Wheel Lab, power, comms and telemetry all attach to the same vehicle record.</p>
            </div>
            <form onSubmit={saveVehicle} className="grid gap-3 border border-white/10 bg-white/[0.025] p-5 sm:grid-cols-2 sm:p-7">
              {[
                ['year','Year','1997'], ['make','Make','Chevrolet'], ['model','Model','Suburban K1500'], ['trim','Trim','LS'],
                ['engine','Engine','5.7L Vortec L31'], ['transmission','Transmission','4L60E'], ['drivetrain','Drivetrain','4x4'],
                ['tireSize','Tire size','285/75R16'], ['wheelSize','Wheel size','16x8'],
              ].map(([key,label,placeholder]) => (
                <label key={key} className="grid gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
                  <input value={vehicle[key]} onChange={(e) => setField(key,e.target.value)} placeholder={placeholder} className="border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#ff5733]/60" />
                </label>
              ))}
              <label className="grid gap-2 sm:col-span-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Mods / use case</span>
                <textarea value={vehicle.mods} onChange={(e) => setField('mods',e.target.value)} rows={3} placeholder="daily, overland, 40s, towing, track, rally, safari build..." className="border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-[#ff5733]/60" />
              </label>
              <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-[#ff5733] px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-black">Save vehicle to Roads <ChevronRight size={15}/></button>
              {vehicleResult && <div className="sm:col-span-2 border border-white/10 bg-black p-4 text-xs leading-6 text-slate-300">{vehicleResult}</div>}
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <Label>02 / Revenue surfaces</Label>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMMERCE_MODULES.map(({ key,title,eyebrow,icon:Icon,copy,state }) => (
              <button key={key} type="button" onClick={() => document.getElementById(key)?.scrollIntoView({ behavior:'smooth', block:'start' })} className="group min-h-72 border border-white/10 bg-white/[0.025] p-6 text-left transition hover:-translate-y-1 hover:border-[#ff5733]/45">
                <div className="flex justify-between gap-4"><Icon className="text-[#ff5733]"/><Status>{state}</Status></div>
                <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{eyebrow}</div>
                <div className="mt-2 font-display text-3xl font-black uppercase">{title}</div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{copy}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="tool_dna" className="scroll-mt-24 border-y border-white/10 bg-[#101313]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2">
            <div>
              <Label>Tool DNA</Label>
              <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Carry what fixes your car. Nothing else.</h2>
              <p className="mt-5 leading-7 text-slate-400">The knowledge layer stores verified fastener → socket/wrench → torque → special-tool → failure → spare mappings. We are building the database so the calculator can eventually say exactly what belongs in the truck and what dead weight comes out.</p>
              <div className="mt-6 border border-[#ff5733]/30 bg-[#ff5733]/[0.06] p-4 text-xs leading-6 text-slate-300">No fake socket sizes. The customer profile can be generated now; exact manifests unlock only as source-verified vehicle service facts are loaded.</div>
            </div>
            <form onSubmit={buildKit} className="border border-white/10 bg-black p-6">
              <div className="font-display text-2xl font-black uppercase">Self-reliance tier</div>
              <div className="mt-5 grid gap-2">
                {KIT_TIERS.map(([key,label,copy]) => (
                  <label key={key} className={`flex cursor-pointer gap-3 border p-4 ${kitTier === key ? 'border-[#ff5733]/60 bg-[#ff5733]/[0.07]' : 'border-white/10'}`}>
                    <input type="radio" checked={kitTier === key} onChange={() => setKitTier(key)} />
                    <span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{copy}</span></span>
                  </label>
                ))}
              </div>
              <button className="mt-5 w-full bg-white px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black">Create Tool DNA build</button>
              {kitResult && <div className="mt-4 border border-white/10 p-4 text-xs leading-6 text-slate-300">{kitResult}</div>}
              <button type="button" onClick={() => outbound('snap_on','vehicle_specific_toolkit',PARTNER_LINKS.snap_on,'tool_dna')} className="mt-3 w-full border border-white/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">Snap-on custom-kitting capability ↗</button>
            </form>
          </div>
        </section>

        <section id="wheel_lab" className="scroll-mt-24 mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Label>Wheel Lab</Label>
            <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Upload the car. Build the stance. Buy the setup.</h2>
            <p className="mt-5 leading-7 text-slate-400">The current pipeline saves the vehicle, source image metadata, wheel direction, partner and attribution. The image renderer itself is deliberately not faked.</p>
            <button type="button" onClick={() => outbound('fifteen52','wheel_catalog',PARTNER_LINKS.fifteen52,'wheel_lab')} className="mt-6 inline-flex items-center gap-2 border border-[#ff5733]/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ff8a70]">Explore fifteen52 <ExternalLink size={14}/></button>
          </div>
          <div className="border border-white/10 bg-white/[0.025] p-5">
            <label className="flex min-h-72 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-white/15 bg-black">
              {imagePreview ? <img src={imagePreview} alt="Vehicle preview" className="max-h-96 w-full object-contain"/> : <div className="text-center text-slate-500"><Upload className="mx-auto mb-3"/><div className="font-mono text-[10px] uppercase tracking-[0.16em]">Upload vehicle photo</div></div>}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="hidden"/>
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <select value={wheelDirection} onChange={(e) => setWheelDirection(e.target.value)} className="border border-white/10 bg-black px-4 py-3 text-sm">
                <option value="52offroad">52 Offroad</option><option value="rally_sport">Rally Sport</option><option value="super_touring">Super Touring</option><option value="outlaw">52 Outlaw</option>
              </select>
              <button type="button" onClick={createWheelBrief} className="bg-[#ff5733] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-black">Create real build brief</button>
            </div>
            {wheelResult && <div className="mt-4 border border-white/10 p-4 text-xs leading-6 text-slate-300">{wheelResult}</div>}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#101313]">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-16 md:grid-cols-2">
            <div id="power_command" className="scroll-mt-24 border border-white/10 bg-black p-7">
              <BatteryCharging className="text-[#ff5733]"/><div className="mt-7 font-display text-3xl font-black uppercase">Power Command</div>
              <p className="mt-4 leading-7 text-slate-400">Solar, alternator/DC-DC, battery bank, inverter, refrigeration, camp loads, lighting and fused distribution become a vehicle-specific guide and affiliate-ready BOM.</p>
              <button type="button" onClick={() => saveGuide('power')} className="mt-6 border border-white/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]">Save power build</button>
              {powerResult && <div className="mt-4 text-xs text-slate-400">{powerResult}</div>}
            </div>
            <div id="comms_command" className="scroll-mt-24 border border-white/10 bg-black p-7">
              <Radio className="text-[#ff5733]"/><div className="mt-7 font-display text-3xl font-black uppercase">Comms Command</div>
              <p className="mt-4 leading-7 text-slate-400">Satellite, radio, antennas, navigation, emergency signaling and power redundancy turn into an installable communications architecture.</p>
              <button type="button" onClick={() => saveGuide('comms')} className="mt-6 border border-white/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]">Save comms build</button>
              {commsResult && <div className="mt-4 text-xs text-slate-400">{commsResult}</div>}
            </div>
          </div>
        </section>

        <section id="tuner_lab" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
            <div><Label>Tuner Lab</Label><h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Give the vehicle a memory.</h2><p className="mt-5 max-w-3xl leading-7 text-slate-400">Telemetry snapshots, DTCs, engine hours, dyno runs, tune revisions and maintenance events now have dedicated backend records. Device/OBD ingestion is the next connector layer.</p></div>
            <div className="grid grid-cols-2 gap-2">{['OBD / CAN','Engine hours','DTC history','Dyno pulls','Tune versions','Maintenance'].map((item) => <div key={item} className="border border-white/10 bg-white/[0.025] p-4 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-300">{item}</div>)}</div>
          </div>
        </section>

        <section id="roads_supply" className="scroll-mt-24 bg-[#f2efe7] text-black">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[auto_1fr_auto]">
            <img src="/roads-co-logo.svg" alt="Roads Co." className="h-20 w-auto max-w-full mix-blend-multiply"/>
            <div><div className="font-display text-3xl font-black uppercase">Roads stays the culture. Misfit runs the machine.</div><p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">Creator / QR / campaign → garage → product → partner → click → order → fulfillment → revenue → commission truth.</p></div>
            <button type="button" onClick={() => outbound('roads_collective','roads_merch',PARTNER_LINKS.roads_collective,'roads_supply')} className="bg-black px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">Shop Roads ↗</button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="border border-[#ff5733]/35 bg-[#ff5733]/[0.05] p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-3xl"><Label>Misfit revenue spine</Label><h2 className="mt-4 font-display text-4xl font-black uppercase">Measure everything. Invent nothing.</h2><p className="mt-4 leading-7 text-slate-300">First/last/final touch, creator/referral/QR tokens, vehicle, module, partner, offer, SKU, click and order can all resolve into the Roads ledger. Revenue opportunity stays marked uncontracted until a real agreement makes it earned.</p></div>
              <BadgeDollarSign size={54} className="text-[#ff5733]"/>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
