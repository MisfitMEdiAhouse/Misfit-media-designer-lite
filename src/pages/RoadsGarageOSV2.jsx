import { useEffect, useMemo, useState } from 'react';
import {
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
const CYAN = '#00c7f2';
const HERO_IMAGE = 'data:image/webp;base64,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';

const PARTNER_LINKS = {
  roads_collective: 'https://roadscollective.com/collections/all',
  fifteen52: 'https://fifteen52.com/',
  snap_on: 'https://sbs.snapon.com/automotive/special-projects/special-projectsoem/',
};

const COMMERCE_MODULES = [
  ['tool_dna', 'Tool DNA', 'TOOLS + SPARES', Wrench, 'Vehicle-specific field-service kits built from verified fastener, failure-mode and spare-part data.', 'LIVE INTAKE'],
  ['wheel_lab', 'Wheel Lab', 'FITMENT + VISUAL COMMERCE', CarFront, 'Vehicle photo + fitment intent + wheel/tire selection + attributable purchase path.', 'LIVE INTAKE'],
  ['power_command', 'Power Command', 'SOLAR + DC + BATTERY', BatteryCharging, 'Overland electrical builds around actual vehicle loads, charging, refrigeration and emergency power.', 'BOM READY'],
  ['comms_command', 'Comms Command', 'SATELLITE + RADIO + NAV', Radio, 'Communications architecture around terrain, range, emergency signaling and power redundancy.', 'BOM READY'],
  ['tuner_lab', 'Tuner Lab', 'VEHICLE MEMORY', Gauge, 'OBD/CAN telemetry, DTC history, engine hours, dyno pulls, tune versions and maintenance records.', 'SCHEMA LIVE'],
  ['roads_supply', 'Roads Supply', 'MERCH + HARD GOODS', ShoppingBag, 'Roads products, premium supply routing, tracked clickouts and eventual order reconciliation.', 'ATTRIBUTION LIVE'],
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

function RoadsLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="100 15 400 190" role="img" aria-label="Roads Co. graffiti logo">
      <path fill="currentColor" fillRule="evenodd" d="M 481 157 L 474 168 L 484 179 L 491 167 L 489 163 Z M 388 98 L 381 112 L 380 128 L 384 147 L 390 160 L 396 166 L 406 167 L 411 165 L 420 154 L 426 139 L 439 155 L 451 163 L 463 163 L 473 152 L 477 141 L 476 122 L 471 112 L 457 100 L 446 97 L 438 97 L 431 92 L 425 93 L 420 99 L 421 89 L 417 91 L 411 102 L 401 92 L 394 92 Z M 429 110 L 442 125 L 448 136 L 448 140 L 452 137 L 456 130 L 456 124 L 452 116 L 454 115 L 465 127 L 468 135 L 467 152 L 462 152 L 452 146 L 460 136 L 460 131 L 456 134 L 452 141 L 453 145 L 451 146 L 435 129 L 428 116 Z M 390 104 L 393 104 L 402 113 L 412 133 L 418 125 L 426 138 L 413 155 L 403 153 L 395 141 L 388 117 L 388 108 Z M 359 63 L 351 80 L 349 94 L 347 82 L 345 82 L 340 89 L 338 99 L 328 92 L 318 93 L 309 103 L 306 116 L 304 117 L 268 83 L 262 75 L 257 61 L 254 62 L 248 74 L 252 84 L 261 96 L 255 108 L 261 124 L 267 150 L 267 159 L 263 158 L 265 152 L 246 113 L 242 95 L 238 92 L 234 94 L 229 102 L 234 116 L 231 128 L 226 129 L 218 126 L 212 112 L 205 105 L 195 99 L 178 97 L 174 93 L 168 92 L 162 97 L 155 110 L 126 84 L 116 69 L 113 70 L 108 81 L 118 97 L 117 102 L 139 168 L 143 169 L 148 161 L 143 147 L 145 145 L 203 198 L 208 192 L 210 186 L 197 165 L 204 163 L 211 156 L 216 144 L 219 141 L 224 143 L 226 147 L 213 175 L 212 185 L 236 169 L 238 170 L 234 176 L 234 179 L 244 173 L 252 171 L 277 173 L 294 172 L 300 169 L 311 157 L 315 148 L 316 133 L 346 160 L 354 172 L 353 175 L 338 173 L 322 161 L 316 171 L 317 175 L 324 182 L 332 186 L 346 187 L 352 185 L 362 171 L 362 159 L 358 152 L 318 115 L 314 107 L 316 104 L 320 104 L 330 111 L 340 125 L 345 122 L 349 127 L 356 117 L 349 98 L 352 98 L 358 89 L 357 76 Z M 232 147 L 246 155 L 251 160 L 239 169 L 232 160 L 226 163 L 225 162 Z M 200 137 L 207 137 L 209 139 L 208 152 L 203 152 L 193 147 Z M 155 136 L 162 131 L 175 150 L 190 163 L 187 165 Z M 238 126 L 241 130 L 241 135 L 236 132 L 236 128 Z M 194 115 L 202 123 L 198 128 L 193 118 Z M 134 112 L 135 111 L 152 127 L 140 127 L 137 124 Z M 167 107 L 180 121 L 188 134 L 189 140 L 194 135 L 195 136 L 192 141 L 192 146 L 177 131 L 167 112 Z M 268 104 L 300 134 L 307 146 L 307 155 L 304 158 L 297 161 L 279 160 L 276 158 L 278 154 L 277 150 L 271 158 L 269 156 L 272 153 L 276 143 L 267 106 Z M 320 22 L 314 34 L 303 45 L 287 57 L 278 68 L 279 81 L 299 103 L 302 102 L 304 97 L 313 88 L 327 81 L 333 75 L 337 67 L 336 57 L 323 70 L 321 69 L 328 62 L 331 56 L 332 44 L 329 40 L 325 48 L 318 55 L 316 54 L 321 48 L 324 40 L 324 30 Z" />
    </svg>
  );
}

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
  try {
    const response = await fetch('/api/roads-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymousId: anonymousId(), ...trafficContext(), ...payload }),
      keepalive: true,
    });
    return await response.json().catch(() => ({}));
  } catch {
    return { ok: false };
  }
}

async function roadsIntake(payload) {
  try {
    const response = await fetch('/api/roads-intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  return <div className="font-mono text-[10px] font-black uppercase tracking-[0.26em]" style={{ color: CYAN }}>{children}</div>;
}

function Status({ children }) {
  return <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-slate-400">{children}</span>;
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
    emitRoadsEvent({ eventType: 'page_view', moduleKey: 'roads_garage_os_v2', metadata: { surface: 'misfit_public_bridge', visual_system: 'black_flag_v3' } });
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
    setKitResult(result.ok ? `${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} profile ${result.toolkitBuildId.slice(0, 8)} captured. Exact tool sizes stay locked until verified service data is attached.` : result.error);
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
    const result = await roadsIntake({ action: 'create_visualizer_job', vehicle: normalizedVehicle, partnerKey: 'fifteen52', sourceAssetRef: `local_pending_upload:${imageMeta.name}`, wheelSpec: { direction: wheelDirection }, tireSpec: {}, metadata: { source_file_type: imageMeta.type, source_file_size: imageMeta.size } });
    setWheelResult(result.ok ? `Visualizer job ${result.visualizerJobId.slice(0, 8)} saved. Real image rendering is not connected yet, so the app does not fake the output.` : result.error);
  }

  async function saveGuide(type) {
    const setter = type === 'power' ? setPowerResult : setCommsResult;
    if (!vehicleReady) return setter('Build the vehicle profile first.');
    const moduleKey = type === 'power' ? 'power_command' : 'comms_command';
    await emitRoadsEvent({ eventType: 'guide_intent', moduleKey, offerKey: moduleKey, vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_overland_interest', vehicle: normalizedVehicle, guideType: type, title: `${type === 'power' ? 'Power' : 'Comms'} Command — ${vehicleLabel}`, useCase: 'vehicle-specific overland architecture', assumptions: { affiliate_bom: 'planned', verified_fitment_required: true } });
    setter(result.ok ? `Saved build ${result.guideId.slice(0, 8)} to Roads.` : result.error);
  }

  async function outbound(partnerKey, offerKey, url, moduleKey) {
    await emitRoadsEvent({ eventType: 'partner_clickout', partnerKey, offerKey, moduleKey, outboundUrl: url, clickId: `clk_${crypto.randomUUID()}`, vehicle: normalizedVehicle });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function openPrivateBackOffice() {
    await emitRoadsEvent({ eventType: 'back_office_open', moduleKey: 'roads_command_center', outboundUrl: PRIVATE_BACK_OFFICE, metadata: { access: 'private_authenticated_surface' } });
    window.open(PRIVATE_BACK_OFFICE, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050607] text-white">
      <Navbar />
      <main className="pt-20">
        <section className="relative min-h-[720px] overflow-hidden border-b border-white/10">
          <img src={HERO_IMAGE} alt="Roads Garage OS command center" className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center blur-[0.2px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-black/35" />
          <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-between px-5 py-8 sm:py-12">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/15 pb-6">
              <div className="flex items-center gap-5">
                <RoadsLogo className="h-14 w-40 text-white drop-shadow-[0_0_12px_rgba(0,199,242,0.3)] sm:h-16 sm:w-48" />
                <span className="font-mono text-xs text-white/30">×</span>
                <div>
                  <div className="font-display text-lg font-black uppercase tracking-[0.08em]">Misfit Mediahouse</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#00c7f2]">Systems · Software · Intelligence · Attribution</div>
                </div>
              </div>
              <button type="button" onClick={openPrivateBackOffice} className="inline-flex items-center gap-2 border border-[#00c7f2]/50 bg-black/65 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#7eeaff] backdrop-blur transition hover:bg-[#00c7f2] hover:text-black">
                Open private Roads back office <ExternalLink size={14} />
              </button>
            </div>

            <div className="max-w-4xl pb-8 pt-20 sm:pt-28">
              <div className="inline-flex border border-white/15 bg-black/55 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-slate-300 backdrop-blur">BLACK FLAG // ROADS GARAGE OS // BACKED BY MISFIT</div>
              <h1 className="mt-6 font-display text-6xl font-black uppercase leading-[0.82] tracking-[-0.045em] sm:text-8xl lg:text-[8.2rem]">
                THE CAR<br />BECOMES THE<br /><span className="text-[#00c7f2]">CUSTOMER KEY.</span>
              </h1>
              <p className="mt-7 max-w-2xl border-l-2 border-[#00c7f2] pl-5 text-base leading-7 text-slate-300 sm:text-lg">One vehicle profile powers tools, wheels, tires, solar, communications, telemetry, merch, creators, partners and fabrication offers. Roads owns the culture. Misfit runs the machine.</p>
            </div>

            <div className="grid border border-white/15 bg-black/55 backdrop-blur sm:grid-cols-3">
              {[['FIRST / LAST / FINAL', 'Attribution'], ['VEHICLE → OFFER → ORDER', 'Commerce graph'], ['UNCONTRACTED ≠ EARNED', 'Commission truth']].map(([value, label]) => (
                <div key={label} className="border-b border-white/15 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
                  <div className="mt-2 font-display text-lg font-black uppercase sm:text-xl">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#07090b]">
          <div className="mx-auto max-w-7xl px-5 py-14">
            <Label>00 / The Roads engine stack</Label>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {ENGINE_STACK.map(([key, title, copy, Icon, state]) => (
                <button key={key} type="button" onClick={() => emitRoadsEvent({ eventType: 'engine_interest', moduleKey: key, vehicle: normalizedVehicle })} className="group border border-white/10 bg-[#0a0d0f] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#00c7f2]/45 hover:bg-[#0c1114]">
                  <div className="flex items-start justify-between gap-4"><Icon className="text-[#00c7f2]" /><Status>{state}</Status></div>
                  <div className="mt-8 font-display text-2xl font-black uppercase">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="vehicle-intake" className="border-b border-white/10 bg-[#050607]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[.65fr_1.35fr]">
            <div><Label>01 / Vehicle identity</Label><h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Tell Roads what you drive once.</h2><p className="mt-5 leading-7 text-slate-400">This becomes the durable commerce key. Tool DNA, Wheel Lab, power, comms and telemetry all attach to the same vehicle record.</p></div>
            <form onSubmit={saveVehicle} className="grid gap-3 border border-white/10 bg-[#0a0d0f] p-5 sm:grid-cols-2 sm:p-7">
              {[['year','Year','1997'],['make','Make','Chevrolet'],['model','Model','Suburban K1500'],['trim','Trim','LS'],['engine','Engine','5.7L Vortec L31'],['transmission','Transmission','4L60E'],['drivetrain','Drivetrain','4x4'],['tireSize','Tire size','285/75R16'],['wheelSize','Wheel size','16x8']].map(([key,label,placeholder]) => (
                <label key={key} className="grid gap-2"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</span><input value={vehicle[key]} onChange={(e) => setField(key,e.target.value)} placeholder={placeholder} className="border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-[#00c7f2]/60" /></label>
              ))}
              <label className="grid gap-2 sm:col-span-2"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Mods / use case</span><textarea value={vehicle.mods} onChange={(e) => setField('mods',e.target.value)} rows={3} placeholder="daily, overland, 40s, towing, track, rally, safari build..." className="border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-[#00c7f2]/60" /></label>
              <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-[#00c7f2] px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[0.17em] text-black transition hover:bg-[#7eeaff]">Save vehicle to Roads <ChevronRight size={15}/></button>
              {vehicleResult && <div className="sm:col-span-2 border border-[#00c7f2]/20 bg-black p-4 text-xs leading-6 text-slate-300">{vehicleResult}</div>}
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <Label>02 / Revenue surfaces</Label>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMMERCE_MODULES.map(([key,title,eyebrow,Icon,copy,state]) => (
              <button key={key} type="button" onClick={() => document.getElementById(key)?.scrollIntoView({ behavior:'smooth', block:'start' })} className="group min-h-72 border border-white/10 bg-[#0a0d0f] p-6 text-left transition hover:-translate-y-1 hover:border-[#00c7f2]/45">
                <div className="flex justify-between gap-4"><Icon className="text-[#00c7f2]"/><Status>{state}</Status></div>
                <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{eyebrow}</div><div className="mt-2 font-display text-3xl font-black uppercase">{title}</div><p className="mt-4 text-sm leading-6 text-slate-400">{copy}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="tool_dna" className="scroll-mt-24 border-y border-white/10 bg-[#07090b]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2">
            <div><Label>Tool DNA</Label><h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Carry what fixes your car. Nothing else.</h2><p className="mt-5 leading-7 text-slate-400">Verified fastener → socket/wrench → torque → special-tool → failure → spare mappings. The calculator can become exact without becoming bullshit.</p><div className="mt-6 border border-[#00c7f2]/25 bg-[#00c7f2]/[0.05] p-4 text-xs leading-6 text-slate-300">No fake socket sizes. Exact manifests unlock only as source-verified service facts are loaded.</div></div>
            <form onSubmit={buildKit} className="border border-white/10 bg-black p-6">
              <div className="font-display text-2xl font-black uppercase">Self-reliance tier</div><div className="mt-5 grid gap-2">{KIT_TIERS.map(([key,label,copy]) => <label key={key} className={`flex cursor-pointer gap-3 border p-4 transition ${kitTier === key ? 'border-[#00c7f2]/60 bg-[#00c7f2]/[0.07]' : 'border-white/10 hover:border-white/20'}`}><input type="radio" checked={kitTier === key} onChange={() => setKitTier(key)} /><span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{copy}</span></span></label>)}</div>
              <button className="mt-5 w-full bg-white px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#7eeaff]">Create Tool DNA build</button>
              {kitResult && <div className="mt-4 border border-white/10 p-4 text-xs leading-6 text-slate-300">{kitResult}</div>}
              <button type="button" onClick={() => outbound('snap_on','vehicle_specific_toolkit',PARTNER_LINKS.snap_on,'tool_dna')} className="mt-3 w-full border border-[#00c7f2]/25 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400 hover:text-[#7eeaff]">Snap-on custom-kitting capability ↗</button>
            </form>
          </div>
        </section>

        <section id="wheel_lab" className="scroll-mt-24 mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div><Label>Wheel Lab</Label><h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Upload the car. Build the stance. Buy the setup.</h2><p className="mt-5 leading-7 text-slate-400">Vehicle, source image metadata, wheel direction, partner and attribution stay tied together. The renderer itself is deliberately not faked.</p><button type="button" onClick={() => outbound('fifteen52','wheel_catalog',PARTNER_LINKS.fifteen52,'wheel_lab')} className="mt-6 inline-flex items-center gap-2 border border-[#00c7f2]/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7eeaff]">Explore fifteen52 <ExternalLink size={14}/></button></div>
          <div className="border border-white/10 bg-[#0a0d0f] p-5"><label className="flex min-h-72 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-white/15 bg-black">{imagePreview ? <img src={imagePreview} alt="Vehicle preview" className="max-h-96 w-full object-contain"/> : <div className="text-center text-slate-500"><Upload className="mx-auto mb-3 text-[#00c7f2]"/><div className="font-mono text-[10px] uppercase tracking-[0.16em]">Upload vehicle photo</div></div>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="hidden"/></label><div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><select value={wheelDirection} onChange={(e) => setWheelDirection(e.target.value)} className="border border-white/10 bg-black px-4 py-3 text-sm"><option value="52offroad">52 Offroad</option><option value="rally_sport">Rally Sport</option><option value="super_touring">Super Touring</option><option value="outlaw">52 Outlaw</option></select><button type="button" onClick={createWheelBrief} className="bg-[#00c7f2] px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-black hover:bg-[#7eeaff]">Create real build brief</button></div>{wheelResult && <div className="mt-4 border border-white/10 p-4 text-xs leading-6 text-slate-300">{wheelResult}</div>}</div>
        </section>

        <section className="border-y border-white/10 bg-[#07090b]"><div className="mx-auto grid max-w-7xl gap-4 px-5 py-16 md:grid-cols-2"><div id="power_command" className="scroll-mt-24 border border-white/10 bg-black p-7"><BatteryCharging className="text-[#00c7f2]"/><div className="mt-7 font-display text-3xl font-black uppercase">Power Command</div><p className="mt-4 leading-7 text-slate-400">Solar, alternator/DC-DC, battery bank, inverter, refrigeration, camp loads, lighting and fused distribution become a vehicle-specific guide and affiliate-ready BOM.</p><button type="button" onClick={() => saveGuide('power')} className="mt-6 border border-[#00c7f2]/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]">Save power build</button>{powerResult && <div className="mt-4 text-xs text-slate-400">{powerResult}</div>}</div><div id="comms_command" className="scroll-mt-24 border border-white/10 bg-black p-7"><Radio className="text-[#00c7f2]"/><div className="mt-7 font-display text-3xl font-black uppercase">Comms Command</div><p className="mt-4 leading-7 text-slate-400">Satellite, radio, antennas, navigation, emergency signaling and power redundancy become an installable communications architecture.</p><button type="button" onClick={() => saveGuide('comms')} className="mt-6 border border-[#00c7f2]/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em]">Save comms build</button>{commsResult && <div className="mt-4 text-xs text-slate-400">{commsResult}</div>}</div></div></section>

        <section id="tuner_lab" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr]"><div><Label>Tuner Lab</Label><h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9]">Give the vehicle a memory.</h2><p className="mt-5 max-w-3xl leading-7 text-slate-400">Telemetry snapshots, DTCs, engine hours, dyno runs, tune revisions and maintenance events have dedicated backend records. Device/OBD ingestion is the next connector layer.</p></div><div className="grid grid-cols-2 gap-2">{['OBD / CAN','Engine hours','DTC history','Dyno pulls','Tune versions','Maintenance'].map((item) => <div key={item} className="border border-white/10 bg-[#0a0d0f] p-4 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-300">{item}</div>)}</div></div></section>

        <section id="roads_supply" className="scroll-mt-24 border-y border-white/10 bg-black"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[auto_1fr_auto]"><RoadsLogo className="h-20 w-56 text-white"/><div><div className="font-display text-3xl font-black uppercase">Roads stays the culture. Misfit runs the machine.</div><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Creator / QR / campaign → garage → product → partner → click → order → fulfillment → revenue → commission truth.</p></div><button type="button" onClick={() => outbound('roads_collective','roads_merch',PARTNER_LINKS.roads_collective,'roads_supply')} className="border border-[#00c7f2]/40 bg-[#00c7f2]/[0.08] px-6 py-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#7eeaff]">Shop Roads ↗</button></div></section>

        <section className="mx-auto max-w-7xl px-5 py-16"><div className="relative overflow-hidden border border-[#00c7f2]/30 bg-[#071014] p-7 sm:p-10"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#00c7f2]/10 blur-3xl"/><div className="relative flex flex-wrap items-start justify-between gap-8"><div className="max-w-3xl"><Label>Misfit revenue spine</Label><h2 className="mt-4 font-display text-4xl font-black uppercase">Measure everything. Invent nothing.</h2><p className="mt-4 leading-7 text-slate-300">First/last/final touch, creator/referral/QR tokens, vehicle, module, partner, offer, SKU, click and order resolve into the Roads ledger. Revenue opportunity stays uncontracted until a real agreement makes it earned.</p></div><BadgeDollarSign size={54} className="text-[#00c7f2]"/></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
