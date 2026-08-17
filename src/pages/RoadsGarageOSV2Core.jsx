import { useEffect, useMemo, useState } from 'react';
import {
  BatteryCharging,
  Calculator,
  CarFront,
  ChevronRight,
  ExternalLink,
  Gauge,
  Menu,
  Radio,
  ShoppingBag,
  Upload,
  Wrench,
  X,
} from 'lucide-react';

const PRIVATE_BACK_OFFICE = 'https://roads-growth-command-center.pricemedia82.chatgpt.site/';
const ROADS_SHOP = 'https://roadscollective.com/';
const FIFTEEN52 = 'https://fifteen52.com/';
const SNAP_ON = 'https://sbs.snapon.com/automotive/special-projects/special-projectsoem/';
const HERO_IMAGE = '/roads-command-hero-v2.webp';
const TUNER_PHOTO = '/roads-tuner.webp';
const WHEEL_PHOTO = '/roads-wheel.webp';
const MERCH_PHOTO = '/roads-merch.webp';

const KIT_TIERS = [
  ['roadside', 'Roadside', 'Diagnostics + minimum get-home repair loadout'],
  ['overland', 'Road / Trip', 'Roadside + recovery + common trip-ending failures'],
  ['field_service', 'Field Service', 'System-level field repair without hauling a shop'],
  ['master', 'Master', 'Maximum self-reliance with duplicate-weight optimization'],
];

function RoadsLogo({ className = '' }) {
  return <img src="/roads-co-logo.svg" alt="Roads Co." className={className} />;
}

function MisfitMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} relative shrink-0 overflow-hidden rounded-full border border-white/15 bg-black`}>
        <img src="/misfit-skull.svg" alt="Misfit Mediahouse" className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute left-[49%] top-[57%] h-[3px] w-[3px] rounded-[1px] bg-[#e6b325] shadow-[0_0_5px_rgba(230,179,37,.9)]" />
      </div>
      <div className="leading-none">
        <div className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/35">Software by</div>
        <div className="mt-1 font-display text-[9px] font-black uppercase tracking-[0.07em] text-white/70">Misfit Mediahouse</div>
      </div>
    </div>
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

function tireDiameter(size) {
  const match = String(size || '').trim().match(/^(\d{3})\/(\d{2})R(\d{2})$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const aspect = Number(match[2]);
  const rim = Number(match[3]);
  return rim + (2 * width * (aspect / 100)) / 25.4;
}

function Field({ label, value, onChange, placeholder, inputMode = 'text' }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="min-h-12 rounded-xl border border-white/12 bg-black/70 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#00c7f2]/70"
      />
    </label>
  );
}

function Result({ label, value, suffix = '' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/55 p-3.5 sm:p-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">{label}</div>
      <div className="mt-2 font-display text-xl font-black uppercase text-white sm:text-2xl">
        {value}<span className="ml-1 text-xs text-white/45 sm:text-sm">{suffix}</span>
      </div>
    </div>
  );
}

function SectionHead({ kicker, title, copy }) {
  return (
    <div>
      <div className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00c7f2]">{kicker}</div>
      <h2 className="mt-3 font-display text-[2.15rem] font-black uppercase leading-[0.92] tracking-[-0.03em] sm:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">{copy}</p> : null}
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, copy, gold = false }) {
  return (
    <a href={href} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/25 hover:bg-white/[0.045]">
      <div className="flex items-center justify-between gap-3">
        <Icon size={18} className={gold ? 'text-[#e6b325]' : 'text-[#00c7f2]'} />
        <ChevronRight size={14} className="text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
      </div>
      <div className="mt-4 font-display text-lg font-black uppercase">{title}</div>
      <div className="mt-1 text-xs leading-5 text-white/45">{copy}</div>
    </a>
  );
}

export default function RoadsGarageOSV2Core() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicle, setVehicle] = useState({ year: '', make: '', model: '', trim: '', engine: '', transmission: '', drivetrain: '', tireSize: '', wheelSize: '', mods: '' });
  const [vehicleResult, setVehicleResult] = useState('');
  const [kitTier, setKitTier] = useState('field_service');
  const [kitResult, setKitResult] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [wheelDirection, setWheelDirection] = useState('street');
  const [wheelResult, setWheelResult] = useState('');
  const [powerResult, setPowerResult] = useState('');
  const [commsResult, setCommsResult] = useState('');
  const [hp, setHp] = useState('400');
  const [torque, setTorque] = useState('400');
  const [weight, setWeight] = useState('3400');
  const [loss, setLoss] = useState('15');
  const [stockTire, setStockTire] = useState('245/45R18');
  const [newTire, setNewTire] = useState('275/35R19');
  const [speed, setSpeed] = useState('70');
  const [gearRatio, setGearRatio] = useState('0.80');
  const [finalDrive, setFinalDrive] = useState('3.73');
  const [tuneSaved, setTuneSaved] = useState('');

  useEffect(() => {
    emitRoadsEvent({ eventType: 'page_view', moduleKey: 'roads_garage_os_v4', metadata: { surface: 'public_viral_app', visual_system: 'roads_first_mobile' } });
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

  const tuneMath = useMemo(() => {
    const crankHp = Math.max(0, Number(hp) || 0);
    const crankTorque = Math.max(0, Number(torque) || 0);
    const lbs = Math.max(1, Number(weight) || 1);
    const lossPct = Math.min(50, Math.max(0, Number(loss) || 0));
    const wheelHp = crankHp * (1 - lossPct / 100);
    const wheelTorque = crankTorque * (1 - lossPct / 100);
    const lbPerWhp = wheelHp > 0 ? lbs / wheelHp : 0;
    const et = wheelHp > 0 ? 5.825 * Math.cbrt(lbs / wheelHp) : 0;
    const oldDia = tireDiameter(stockTire);
    const newDia = tireDiameter(newTire);
    const tireDelta = oldDia && newDia ? ((newDia / oldDia) - 1) * 100 : null;
    const actualSpeed = oldDia && newDia ? (Number(speed) || 0) * (newDia / oldDia) : null;
    const rpm = newDia ? ((Number(speed) || 0) * (Number(gearRatio) || 0) * (Number(finalDrive) || 0) * 336) / newDia : null;
    return { wheelHp, wheelTorque, lbPerWhp, et, newDia, tireDelta, actualSpeed, rpm };
  }, [hp, torque, weight, loss, stockTire, newTire, speed, gearRatio, finalDrive]);

  function setVehicleField(key, value) {
    setVehicle((current) => ({ ...current, [key]: value }));
    setVehicleResult('');
  }

  async function saveVehicle(event) {
    event.preventDefault();
    if (!vehicleReady) return setVehicleResult('Year, make and model are required.');
    await emitRoadsEvent({ eventType: 'vehicle_profile_submit', moduleKey: 'vehicle_intake', vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_vehicle_profile', vehicle: normalizedVehicle, metadata: { source_surface: 'roads_public_garage' } });
    setVehicleResult(result.ok ? `Saved ${vehicleLabel} to your Roads garage.` : result.error);
  }

  async function buildKit(event) {
    event.preventDefault();
    if (!vehicleReady) return setKitResult('Build your vehicle profile first.');
    await emitRoadsEvent({ eventType: 'calculator_submit', moduleKey: 'tool_dna', partnerKey: 'snap_on', offerKey: 'vehicle_specific_toolkit', vehicle: normalizedVehicle, metadata: { requested_tier: kitTier } });
    const result = await roadsIntake({ action: 'build_toolkit_profile', vehicle: normalizedVehicle, tier: kitTier, vendorPreferences: { preferred_vendor: 'snap_on', commercial_terms: 'pending' } });
    setKitResult(result.ok ? `${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} profile saved. Exact socket and fastener results unlock only from verified service data.` : result.error);
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
    if (!vehicleReady) return setWheelResult('Build your vehicle profile first.');
    if (!imageMeta) return setWheelResult('Upload a vehicle photo first.');
    await emitRoadsEvent({ eventType: 'wheel_visualizer_submit', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', offerKey: 'wheel_visualizer', vehicle: normalizedVehicle, metadata: { wheel_direction: wheelDirection } });
    const result = await roadsIntake({ action: 'create_visualizer_job', vehicle: normalizedVehicle, partnerKey: 'fifteen52', sourceAssetRef: `local_pending_upload:${imageMeta.name}`, wheelSpec: { direction: wheelDirection }, tireSpec: {}, metadata: { source_file_type: imageMeta.type, source_file_size: imageMeta.size } });
    setWheelResult(result.ok ? 'Fitment brief saved. Your vehicle and wheel direction are now tied together.' : result.error);
  }

  async function saveGuide(type) {
    const setter = type === 'power' ? setPowerResult : setCommsResult;
    if (!vehicleReady) return setter('Build your vehicle profile first.');
    const moduleKey = type === 'power' ? 'power_command' : 'comms_command';
    await emitRoadsEvent({ eventType: 'guide_intent', moduleKey, offerKey: moduleKey, vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_overland_interest', vehicle: normalizedVehicle, guideType: type, title: `${type === 'power' ? 'Vehicle Power' : 'Comms'} — ${vehicleLabel}`, useCase: 'vehicle-specific architecture', assumptions: { affiliate_bom: 'planned', verified_fitment_required: true } });
    setter(result.ok ? 'Saved to your Roads garage.' : result.error);
  }

  async function outbound(partnerKey, offerKey, url, moduleKey) {
    await emitRoadsEvent({ eventType: 'partner_clickout', partnerKey, offerKey, moduleKey, outboundUrl: url, clickId: `clk_${crypto.randomUUID()}`, vehicle: normalizedVehicle });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function saveTuneSnapshot() {
    await emitRoadsEvent({ eventType: 'tune_calculator_snapshot', moduleKey: 'tuner_lab', vehicle: normalizedVehicle, metadata: { crank_hp: Number(hp) || 0, crank_torque: Number(torque) || 0, weight_lb: Number(weight) || 0, drivetrain_loss_pct: Number(loss) || 0, est_wheel_hp: Number(tuneMath.wheelHp.toFixed(1)), est_wheel_torque: Number(tuneMath.wheelTorque.toFixed(1)), stock_tire: stockTire, new_tire: newTire, speed_mph: Number(speed) || 0, gear_ratio: Number(gearRatio) || 0, final_drive: Number(finalDrive) || 0 } });
    setTuneSaved('Build snapshot captured.');
  }

  const nav = [
    ['Tune Lab', '#tune'],
    ['My Garage', '#garage'],
    ['Tool DNA', '#tools'],
    ['Wheel Lab', '#wheels'],
    ['Vehicle Systems', '#systems'],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050607] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <a href="#top" className="flex items-center" onClick={() => setMenuOpen(false)} aria-label="Roads Garage home">
            <RoadsLogo className="h-9 w-28 object-contain object-left invert sm:h-10 sm:w-32" />
          </a>

          <nav className="hidden items-center gap-5 lg:flex">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/55 transition hover:text-white">{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => outbound('roads_collective', 'official_store', ROADS_SHOP, 'roads_merch')}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e6b325]/40 px-3 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-[#f0c84a] sm:h-11 sm:px-4 sm:text-[9px]"
            >
              Shop <ShoppingBag size={13} />
            </button>
            <div className="hidden xl:block"><MisfitMark compact /></div>
            <button type="button" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] sm:h-11 sm:w-11 lg:hidden">
              {menuOpen ? <X size={18} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 bg-[#07090b] px-5 pb-6 pt-2 lg:hidden">
            <div className="grid">
              {nav.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 font-display text-xl font-black uppercase">
                  {label}<ChevronRight size={15} className="text-white/30" />
                </a>
              ))}
              <button type="button" onClick={() => outbound('roads_collective', 'official_store', ROADS_SHOP, 'roads_merch')} className="flex items-center justify-between border-b border-white/10 py-4 text-left font-display text-xl font-black uppercase text-[#f0c84a]">
                Shop Roads <ShoppingBag size={16} />
              </button>
              <div className="mt-5 flex items-center justify-between gap-4">
                <MisfitMark compact />
                <button type="button" onClick={() => outbound('roads_private', 'private_back_office', PRIVATE_BACK_OFFICE, 'roads_command_center')} className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">Private back office ↗</button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="relative min-h-[610px] overflow-hidden border-b border-white/10 sm:min-h-[660px] lg:min-h-[720px]">
          <img src={HERO_IMAGE} alt="Roads Co. street car culture" className="absolute inset-0 h-full w-full object-cover object-center opacity-95 brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/38 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-black/10 to-black/10" />

          <div className="relative mx-auto flex min-h-[610px] max-w-7xl items-end px-5 pb-10 pt-16 sm:min-h-[660px] sm:px-6 sm:pb-14 lg:min-h-[720px] lg:items-center lg:pb-0">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
                Roads Co. Garage <span className="text-[#00c7f2]">//</span> free car tools
              </div>
              <h1 className="mt-5 max-w-[11ch] font-display text-[3.3rem] font-black uppercase leading-[0.84] tracking-[-0.045em] drop-shadow-[0_3px_18px_rgba(0,0,0,.8)] sm:text-7xl lg:text-[6.8rem]">
                Know your car.<br /><span className="text-[#00c7f2]">Build it better.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,.8)] sm:text-lg sm:leading-7">
                Tuning math, your saved garage, vehicle-specific tool planning, wheel direction, power and comms — one free Roads app for people who actually care about their cars.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#tune" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#00c7f2] px-5 py-3.5 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black sm:px-6">Run Tune Lab <Gauge size={15} /></a>
                <a href="#garage" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 bg-black/50 px-5 py-3.5 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-sm sm:px-6">Build my vehicle <CarFront size={15} /></a>
              </div>
              <div className="mt-5 w-fit rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm">
                <MisfitMark compact />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#080a0c]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:py-7">
            <QuickLink href="#tune" icon={Gauge} title="Tune Lab" copy="Power, weight, tire + gearing math" />
            <QuickLink href="#tools" icon={Wrench} title="Tool DNA" copy="Build the road kit for your vehicle" />
            <QuickLink href="#wheels" icon={CarFront} title="Wheel Lab" copy="Photo + fitment direction + partner path" />
            <QuickLink href="#merch" icon={ShoppingBag} title="Shop Roads" copy="Official Roads Collective store" gold />
          </div>
        </section>

        <section id="tune" className="scroll-mt-16 border-b border-white/10 bg-[#07090b]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
              <div>
                <SectionHead kicker="01 / Tune Lab" title="Start with the numbers." copy="Estimate wheel power, power-to-weight, tire-size changes, corrected speed and cruising RPM. Useful math first — before the parking-lot debate starts." />

                <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 lg:hidden">
                  <img src={TUNER_PHOTO} alt="Roads engine work" className="aspect-[16/9] w-full object-cover object-center" />
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Field label="Crank horsepower" value={hp} onChange={setHp} placeholder="400" inputMode="decimal" />
                  <Field label="Crank torque (lb-ft)" value={torque} onChange={setTorque} placeholder="400" inputMode="decimal" />
                  <Field label="Vehicle weight (lb)" value={weight} onChange={setWeight} placeholder="3400" inputMode="decimal" />
                  <Field label="Drivetrain loss %" value={loss} onChange={setLoss} placeholder="15" inputMode="decimal" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Result label="Est. wheel HP" value={tuneMath.wheelHp.toFixed(0)} />
                  <Result label="Est. wheel torque" value={tuneMath.wheelTorque.toFixed(0)} suffix="lb-ft" />
                  <Result label="Weight / WHP" value={tuneMath.lbPerWhp.toFixed(2)} suffix="lb" />
                  <Result label="Rough 1/4 ET" value={tuneMath.et.toFixed(2)} suffix="sec" />
                </div>

                <div className="mt-8 border-t border-white/10 pt-7">
                  <div className="flex items-center gap-2 font-display text-xl font-black uppercase sm:text-2xl"><Calculator size={19} className="text-[#00c7f2]" /> Tire + gearing math</div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Current tire" value={stockTire} onChange={setStockTire} placeholder="245/45R18" />
                    <Field label="New tire" value={newTire} onChange={setNewTire} placeholder="275/35R19" />
                    <Field label="Indicated speed (mph)" value={speed} onChange={setSpeed} placeholder="70" inputMode="decimal" />
                    <Field label="Top gear ratio" value={gearRatio} onChange={setGearRatio} placeholder="0.80" inputMode="decimal" />
                    <Field label="Final drive" value={finalDrive} onChange={setFinalDrive} placeholder="3.73" inputMode="decimal" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Result label="New tire diameter" value={tuneMath.newDia ? tuneMath.newDia.toFixed(2) : '—'} suffix="in" />
                    <Result label="Diameter change" value={tuneMath.tireDelta == null ? '—' : tuneMath.tireDelta.toFixed(2)} suffix="%" />
                    <Result label="Actual speed" value={tuneMath.actualSpeed == null ? '—' : tuneMath.actualSpeed.toFixed(1)} suffix="mph" />
                    <Result label="Engine RPM" value={tuneMath.rpm == null ? '—' : tuneMath.rpm.toFixed(0)} />
                  </div>
                  <button type="button" onClick={saveTuneSnapshot} className="mt-5 inline-flex items-center gap-2 border border-[#00c7f2]/45 px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#7eeaff]">Save build snapshot <ChevronRight size={13} /></button>
                  {tuneSaved ? <span className="ml-3 text-xs text-white/50">{tuneSaved}</span> : null}
                </div>
              </div>

              <div className="relative hidden min-h-[680px] overflow-hidden rounded-3xl border border-white/10 lg:block">
                <img src={TUNER_PHOTO} alt="Roads engine work" className="absolute inset-0 h-full w-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section id="garage" className="scroll-mt-16 border-b border-white/10 bg-[#050607]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
            <SectionHead kicker="02 / My Garage" title="Tell Roads what you drive once." copy="Save the vehicle once. Tune Lab, Tool DNA, Wheel Lab and future garage features can all use the same profile." />
            <form onSubmit={saveVehicle} className="mt-7 grid gap-3 rounded-2xl border border-white/10 bg-[#0a0d0f] p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
              {[
                ['year', 'Year', '1997'],
                ['make', 'Make', 'Chevrolet'],
                ['model', 'Model', 'Suburban K1500'],
                ['trim', 'Trim', 'LS'],
                ['engine', 'Engine', '5.7L Vortec L31'],
                ['transmission', 'Transmission', '4L60E'],
                ['drivetrain', 'Drivetrain', '4x4'],
                ['tireSize', 'Tire size', '285/75R16'],
                ['wheelSize', 'Wheel size', '16x8'],
              ].map(([key, label, placeholder]) => <Field key={key} label={label} value={vehicle[key]} onChange={(value) => setVehicleField(key, value)} placeholder={placeholder} />)}
              <label className="grid gap-2 sm:col-span-2 lg:col-span-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">Mods / use case</span>
                <textarea value={vehicle.mods} onChange={(e) => setVehicleField('mods', e.target.value)} rows={3} placeholder="street, track, drift, rally, towing, daily, build notes..." className="rounded-xl border border-white/12 bg-black/70 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00c7f2]/70" />
              </label>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#00c7f2] px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black sm:col-span-2 lg:col-span-3">Save vehicle to Roads <ChevronRight size={14} /></button>
              {vehicleResult ? <div className="rounded-xl border border-white/10 bg-black p-4 text-xs text-white/60 sm:col-span-2 lg:col-span-3">{vehicleResult}</div> : null}
            </form>
          </div>
        </section>

        <section id="tools" className="scroll-mt-16 border-b border-white/10 bg-[#07090b]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
            <div>
              <SectionHead kicker="03 / Tool DNA" title="Carry what fixes your car. Nothing else." copy="Pick how self-reliant you want to be, then build the road-kit profile around your actual vehicle instead of hauling a generic toolbox." />
              <div className="mt-5 rounded-xl border border-[#00c7f2]/20 bg-[#00c7f2]/[0.04] p-4 text-xs leading-6 text-white/60">Verified service facts unlock exact fastener → socket/wrench → torque → special-tool → failure → spare mappings. No made-up socket sizes.</div>
            </div>
            <form onSubmit={buildKit} className="rounded-2xl border border-white/10 bg-black/55 p-5 sm:p-6">
              <div className="grid gap-2">
                {KIT_TIERS.map(([key, label, copy]) => (
                  <label key={key} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${kitTier === key ? 'border-[#00c7f2]/60 bg-[#00c7f2]/[0.07]' : 'border-white/10'}`}>
                    <input type="radio" checked={kitTier === key} onChange={() => setKitTier(key)} />
                    <span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-white/45">{copy}</span></span>
                  </label>
                ))}
              </div>
              <button className="mt-5 w-full bg-white px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black">Create Tool DNA build</button>
              {kitResult ? <div className="mt-4 rounded-xl border border-white/10 bg-black p-4 text-xs leading-5 text-white/60">{kitResult}</div> : null}
              <button type="button" onClick={() => outbound('snap_on', 'custom_kitting', SNAP_ON, 'tool_dna')} className="mt-4 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-white/40 hover:text-white">Explore Snap-on custom kitting <ExternalLink size={12} /></button>
            </form>
          </div>
        </section>

        <section id="wheels" className="scroll-mt-16 border-b border-white/10 bg-[#080a0c]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
              <div>
                <SectionHead kicker="04 / Wheel Lab" title="Upload the car. Dial the direction." copy="Keep your car photo, vehicle profile and wheel direction together. Save the fitment brief now, then use the same record when the live visualizer is connected." />
                <div className="mt-7 overflow-hidden rounded-2xl border border-white/10">
                  <img src={WHEEL_PHOTO} alt="Roads wheel and fitment" className="aspect-[16/10] w-full object-cover object-center" />
                </div>
                <button type="button" onClick={() => outbound('fifteen52', 'wheels', FIFTEEN52, 'wheel_lab')} className="mt-4 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-white/45 hover:text-white">Explore fifteen52 <ExternalLink size={12} /></button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/45 p-5 sm:p-6">
                <label className="grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.025] text-center sm:min-h-52">
                  {imagePreview ? <img src={imagePreview} alt="Uploaded vehicle" className="h-52 w-full object-cover sm:h-64" /> : <div className="p-7"><Upload className="mx-auto text-[#00c7f2]" /><div className="mt-3 font-display text-xl font-black uppercase">Upload your car</div><div className="mt-1 text-xs text-white/45">JPG, PNG or WebP</div></div>}
                  <input type="file" accept="image/*" onChange={chooseImage} className="hidden" />
                </label>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['street', 'track', 'offroad'].map((direction) => (
                    <button key={direction} type="button" onClick={() => setWheelDirection(direction)} className={`rounded-xl border px-3 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.11em] ${wheelDirection === direction ? 'border-[#00c7f2]/60 bg-[#00c7f2]/[0.07] text-[#7eeaff]' : 'border-white/10 text-white/45'}`}>{direction}</button>
                  ))}
                </div>
                <button type="button" onClick={createWheelBrief} className="mt-4 w-full bg-[#00c7f2] px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black">Save fitment brief</button>
                {wheelResult ? <div className="mt-4 rounded-xl border border-white/10 bg-black p-4 text-xs leading-5 text-white/60">{wheelResult}</div> : null}
              </div>
            </div>
          </div>
        </section>

        <section id="systems" className="scroll-mt-16 border-b border-white/10 bg-[#050607]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
            <SectionHead kicker="05 / Vehicle Systems" title="Power it. Connect it. Keep moving." copy="Vehicle electrical and communications architecture: alternator/DC-DC, auxiliary battery, inverter, fused accessories, radios, satellite, navigation and data. Solar is just one optional input when the build actually needs it." />
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0a0d0f] p-6 sm:p-7">
                <div className="flex items-center justify-between"><BatteryCharging className="text-[#00c7f2]" /><span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Vehicle Power</span></div>
                <h3 className="mt-6 font-display text-2xl font-black uppercase sm:text-3xl">Build the electrical backbone.</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">Charging strategy, auxiliary battery, DC-DC, inverter, fuse/distribution, lighting, refrigeration, compressors and accessory loads — sized around the vehicle.</p>
                <button type="button" onClick={() => saveGuide('power')} className="mt-5 inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.13em] text-white">Save vehicle power build <ChevronRight size={13} /></button>
                {powerResult ? <div className="mt-4 text-xs text-white/55">{powerResult}</div> : null}
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0a0d0f] p-6 sm:p-7">
                <div className="flex items-center justify-between"><Radio className="text-[#00c7f2]" /><span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Comms + Nav</span></div>
                <h3 className="mt-6 font-display text-2xl font-black uppercase sm:text-3xl">Stay connected when the road gets weird.</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">Radio, satellite, antennas, navigation, emergency signaling and redundant power — built around where the car actually goes.</p>
                <button type="button" onClick={() => saveGuide('comms')} className="mt-5 inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.13em] text-white">Save comms build <ChevronRight size={13} /></button>
                {commsResult ? <div className="mt-4 text-xs text-white/55">{commsResult}</div> : null}
              </div>
            </div>
          </div>
        </section>

        <section id="merch" className="scroll-mt-16 border-b border-white/10 bg-[#08090a]">
          <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative overflow-hidden">
              <img src={MERCH_PHOTO} alt="Roads Collective apparel" className="aspect-[16/11] w-full object-cover object-center lg:h-full lg:min-h-[560px] lg:aspect-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#08090a]/65" />
            </div>
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
              <div className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#e6b325]">Official Roads Co. store</div>
              <h2 className="mt-4 font-display text-[2.6rem] font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">Build the car.<br />Wear the culture.</h2>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">Garage nights, car meets, road trips and the people around them. When you want the actual Roads gear, the app sends you straight to the existing Roads Collective store.</p>
              <button onClick={() => outbound('roads_collective', 'official_store', ROADS_SHOP, 'roads_merch')} className="mt-6 inline-flex w-full min-h-12 items-center justify-center gap-2 bg-[#e6b325] px-6 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black sm:w-fit">Shop Roads Collective <ShoppingBag size={15} /></button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-5 md:justify-start">
            <RoadsLogo className="h-9 w-28 object-contain object-left invert opacity-85" />
            <div className="h-7 w-px bg-white/10" />
            <MisfitMark compact />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">
            <button onClick={() => outbound('roads_collective', 'official_store', ROADS_SHOP, 'roads_merch')} className="hover:text-white">Shop Roads</button>
            <button onClick={() => outbound('roads_private', 'private_back_office', PRIVATE_BACK_OFFICE, 'roads_command_center')} className="hover:text-white">Private back office</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
