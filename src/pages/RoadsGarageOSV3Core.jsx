import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BatteryCharging,
  Calculator,
  CarFront,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  Gauge,
  Menu,
  Radio,
  Share2,
  ShoppingBag,
  Upload,
  Wrench,
  X,
} from 'lucide-react';
import { calculateVehicleMath } from '../lib/vehicleMath.js';

const COFFEE_SHOP = '/coffee-restored#catalog';
const FIFTEEN52 = 'https://fifteen52.com/';
const SNAP_ON = 'https://sbs.snapon.com/automotive/special-projects/special-projectsoem/';
const MEDIA_UPLOAD = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/roads-media-upload';
const HERO_IMAGE = '/misfit-road-lab-hero.webp';
const LAB_MARK = '/misfit-road-lab-mark.webp';

const KIT_TIERS = [
  ['roadside', 'Roadside', 'Diagnostics + minimum get-home repair loadout'],
  ['overland', 'Road / Trip', 'Roadside + recovery + common trip-ending failures'],
  ['field_service', 'Field Service', 'System-level field repair without hauling a shop'],
  ['master', 'Master', 'Maximum self-reliance with duplicate-weight optimization'],
];
const WHEELS = {
  street: '/roads-wheel-street.svg',
  track: '/roads-wheel-track.svg',
  offroad: '/roads-wheel-offroad.svg',
};

function RoadLabLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img src={LAB_MARK} alt="" className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} rounded-full border border-white/15 object-cover`} />
      <div className="leading-none">
        <div className="font-display text-base font-black uppercase tracking-[-0.02em] text-white">Misfit</div>
        <div className="mt-1 font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-[#00c7f2]">Road Lab</div>
      </div>
    </div>
  );
}
function MisfitMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black">
        <img src="/misfit-skull.svg" alt="Misfit Mediahouse" className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute left-[49%] top-[57%] h-[3px] w-[3px] rounded-[1px] bg-[#e6b325] shadow-[0_0_5px_rgba(230,179,37,.9)]" />
      </div>
      <div className="leading-none">
        <div className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/35">Built by</div>
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
    if (!response.ok) throw new Error(data.error || 'Misfit garage intake failed');
    return data;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Misfit garage intake failed' };
  }
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
async function uploadRoadsAsset(file, purpose = 'source') {
  const dataBase64 = await fileToBase64(file);
  const response = await fetch(MEDIA_UPLOAD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anonymousId: anonymousId(),
      fileName: file.name,
      mimeType: file.type,
      dataBase64,
      purpose,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) throw new Error(data.error || 'Image upload failed');
  return data;
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
function Field({ label, value, onChange, placeholder, inputMode = 'text' }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} className="min-h-12 rounded-xl border border-white/12 bg-black/70 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00c7f2]/70" />
    </label>
  );
}
function Result({ label, value, suffix = '' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/55 p-3.5 sm:p-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">{label}</div>
      <div className="mt-2 font-display text-xl font-black uppercase text-white sm:text-2xl">{value}<span className="ml-1 text-xs text-white/45 sm:text-sm">{suffix}</span></div>
    </div>
  );
}
function formatNumber(value, digits = 0) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
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
function Status({ children, good = false }) {
  return <div className={`mt-4 rounded-xl border p-4 text-xs leading-5 ${good ? 'border-[#00c7f2]/25 bg-[#00c7f2]/[0.05] text-white/75' : 'border-white/10 bg-black text-white/60'}`}>{children}</div>;
}
function BuildItems({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4 grid max-h-80 gap-2 overflow-auto pr-1">
      {items.map((entry, index) => (
        <div key={`${entry.name || entry.item_name}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.025] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-bold text-white/90">{entry.name || entry.item_name}</div>
            {entry.verification === 'verified' ? <span className="rounded-full bg-[#00c7f2]/15 px-2 py-1 font-mono text-[7px] uppercase tracking-wider text-[#7eeaff]">Verified</span> : null}
          </div>
          <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-white/30">{entry.category}</div>
          <div className="mt-2 text-xs leading-5 text-white/50">{entry.rationale}</div>
        </div>
      ))}
    </div>
  );
}

export default function RoadsGarageOSV3Core() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicle, setVehicle] = useState({ year: '', make: '', model: '', trim: '', engine: '', transmission: '', drivetrain: '', tireSize: '', wheelSize: '', mods: '' });
  const [vehicleResult, setVehicleResult] = useState('');
  const [kitTier, setKitTier] = useState('field_service');
  const [kitResult, setKitResult] = useState('');
  const [kitData, setKitData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMeta, setImageMeta] = useState(null);
  const [sourceAsset, setSourceAsset] = useState(null);
  const [uploadState, setUploadState] = useState('');
  const [wheelDirection, setWheelDirection] = useState('street');
  const [wheelSize, setWheelSize] = useState(19);
  const [wheelPoints, setWheelPoints] = useState({ front: { x: 72, y: 70 }, rear: { x: 28, y: 70 } });
  const [activeWheel, setActiveWheel] = useState('front');
  const [wheelResult, setWheelResult] = useState('');
  const [renderPreview, setRenderPreview] = useState('');
  const [renderBlob, setRenderBlob] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [powerResult, setPowerResult] = useState('');
  const [powerData, setPowerData] = useState(null);
  const [commsResult, setCommsResult] = useState('');
  const [commsData, setCommsData] = useState(null);
  const [hp, setHp] = useState('260');
  const [torque, setTorque] = useState('335');
  const [weight, setWeight] = useState('5200');
  const [loss, setLoss] = useState('20');
  const [stockTire, setStockTire] = useState('285/75R16');
  const [newTire, setNewTire] = useState('35x12.50R17');
  const [speed, setSpeed] = useState('65');
  const [gearRatio, setGearRatio] = useState('0.70');
  const [finalDrive, setFinalDrive] = useState('3.73');
  const [firstGear, setFirstGear] = useState('3.06');
  const [transferLow, setTransferLow] = useState('2.72');
  const [tuneSaved, setTuneSaved] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    emitRoadsEvent({ eventType: 'page_view', moduleKey: 'misfit_road_lab_v1', metadata: { surface: 'public_lead_engine', visual_system: 'misfit_overland', functional_release: true } });
  }, []);

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
  const wheelAsset = WHEELS[wheelDirection];

  const tuneMath = useMemo(() => calculateVehicleMath({
    crankHp: hp,
    crankTorque: torque,
    weight,
    drivetrainLoss: loss,
    currentTire: stockTire,
    newTire,
    indicatedSpeed: speed,
    topGear: gearRatio,
    finalDrive,
    firstGear,
    transferLow,
  }), [hp, torque, weight, loss, stockTire, newTire, speed, gearRatio, finalDrive, firstGear, transferLow]);

  function setVehicleField(key, value) {
    setVehicle((current) => ({ ...current, [key]: value }));
    setVehicleResult('');
  }
  async function saveVehicle(event) {
    event.preventDefault();
    if (!vehicleReady) return setVehicleResult('Year, make and model are required.');
    setVehicleResult('Saving vehicle…');
    await emitRoadsEvent({ eventType: 'vehicle_profile_submit', moduleKey: 'vehicle_intake', vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_vehicle_profile', vehicle: normalizedVehicle, metadata: { source_surface: 'roads_public_garage' } });
    setVehicleResult(result.ok ? `Saved ${vehicleLabel} to your Misfit garage.` : result.error);
  }
  async function buildKit(event) {
    event.preventDefault();
    if (!vehicleReady) return setKitResult('Build your vehicle profile first.');
    setKitResult('Building Tool DNA…');
    setKitData(null);
    await emitRoadsEvent({ eventType: 'calculator_submit', moduleKey: 'tool_dna', partnerKey: 'snap_on', offerKey: 'vehicle_specific_toolkit', vehicle: normalizedVehicle, metadata: { requested_tier: kitTier } });
    const result = await roadsIntake({ action: 'build_toolkit_profile', vehicle: normalizedVehicle, tier: kitTier, vendorPreferences: { preferred_vendor: 'snap_on', commercial_terms: 'pending' } });
    if (!result.ok) return setKitResult(result.error);
    setKitData(result);
    setKitResult(`${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} build saved — ${result.toolManifest?.length || 0} tools/items, ${result.verifiedFactCount || 0} exact verified service facts.`);
  }
  async function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setUploadState('Use a JPG, PNG or WebP image.');
    if (file.size > 8 * 1024 * 1024) return setUploadState('Image must be 8 MB or smaller.');
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setImageMeta({ name: file.name, type: file.type, size: file.size });
    setSourceAsset(null);
    setRenderPreview('');
    setRenderBlob(null);
    setWheelResult('');
    setUploadState('Uploading securely to your Misfit garage…');
    await emitRoadsEvent({ eventType: 'visualizer_image_selected', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', vehicle: normalizedVehicle, metadata: { file_type: file.type, file_size: file.size } });
    try {
      const uploaded = await uploadRoadsAsset(file, 'source');
      setSourceAsset(uploaded);
      setUploadState('Photo saved. Tap the front and rear wheel centers below.');
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : 'Photo upload failed.');
    }
  }
  function placeWheel(event) {
    if (!imagePreview) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    };
    setWheelPoints((current) => ({ ...current, [activeWheel]: point }));
    setActiveWheel((current) => current === 'front' ? 'rear' : 'front');
    setWheelResult('');
  }
  async function renderWheelBuild() {
    if (!vehicleReady) return setWheelResult('Build your vehicle profile first.');
    if (!imagePreview || !imageMeta) return setWheelResult('Upload a vehicle photo first.');
    if (!sourceAsset?.assetRef) return setWheelResult('The photo is still uploading.');
    setRendering(true);
    setWheelResult('Rendering your wheel concept…');
    try {
      const [car, wheel] = await Promise.all([loadImage(imagePreview), loadImage(wheelAsset)]);
      const canvas = document.createElement('canvas');
      canvas.width = car.naturalWidth || car.width;
      canvas.height = car.naturalHeight || car.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(car, 0, 0, canvas.width, canvas.height);
      const wheelPx = canvas.width * (wheelSize / 100);
      ctx.shadowColor = 'rgba(0,0,0,.35)';
      ctx.shadowBlur = Math.max(4, wheelPx * 0.03);
      for (const point of [wheelPoints.front, wheelPoints.rear]) {
        const x = canvas.width * point.x / 100 - wheelPx / 2;
        const y = canvas.height * point.y / 100 - wheelPx / 2;
        ctx.drawImage(wheel, x, y, wheelPx, wheelPx);
      }
      ctx.shadowBlur = 0;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.92));
      if (!blob) throw new Error('Could not render image.');
      const file = new File([blob], `misfit-${wheelDirection}-wheel-build.webp`, { type: 'image/webp' });
      const renderAsset = await uploadRoadsAsset(file, 'render');
      const result = await roadsIntake({
        action: 'create_visualizer_job',
        vehicle: normalizedVehicle,
        partnerKey: 'fifteen52',
        sourceAssetRef: sourceAsset.assetRef,
        resultAssetRef: renderAsset.assetRef,
        wheelSpec: { direction: wheelDirection, placement: wheelPoints, wheelSizePct: wheelSize, conceptStyle: true },
        tireSpec: { enteredTireSize: vehicle.tireSize || null, enteredWheelSize: vehicle.wheelSize || null },
        metadata: { source_file_type: imageMeta.type, source_file_size: imageMeta.size, renderer: 'roads_client_compositor_v1' },
      });
      if (!result.ok) throw new Error(result.error || 'Visualizer save failed');
      if (renderPreview.startsWith('blob:')) URL.revokeObjectURL(renderPreview);
      setRenderPreview(URL.createObjectURL(blob));
      setRenderBlob(blob);
      setWheelResult('Rendered and saved to your Misfit garage. This is a concept wheel overlay — verify exact product fitment before purchase.');
      await emitRoadsEvent({ eventType: 'wheel_visualizer_rendered', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', offerKey: 'wheel_visualizer', vehicle: normalizedVehicle, metadata: { direction: wheelDirection, visualizer_job_id: result.visualizerJobId } });
    } catch (error) {
      setWheelResult(error instanceof Error ? error.message : 'Wheel render failed.');
    } finally {
      setRendering(false);
    }
  }
  async function shareRender() {
    if (!renderBlob) return;
    const file = new File([renderBlob], `misfit-${wheelDirection}-wheel-build.webp`, { type: 'image/webp' });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try { await navigator.share({ title: `${vehicleLabel} — Misfit Wheel Lab`, files: [file] }); return; } catch { /* download fallback */ }
    }
    const url = URL.createObjectURL(renderBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  async function saveGuide(type) {
    const setter = type === 'power' ? setPowerResult : setCommsResult;
    const dataSetter = type === 'power' ? setPowerData : setCommsData;
    if (!vehicleReady) return setter('Build your vehicle profile first.');
    setter('Building vehicle plan…');
    dataSetter(null);
    const moduleKey = type === 'power' ? 'power_command' : 'comms_command';
    await emitRoadsEvent({ eventType: 'guide_intent', moduleKey, offerKey: moduleKey, vehicle: normalizedVehicle });
    const result = await roadsIntake({ action: 'save_overland_interest', vehicle: normalizedVehicle, guideType: type, title: `${type === 'power' ? 'Vehicle Power' : 'Comms'} — ${vehicleLabel}`, useCase: 'vehicle-specific architecture', assumptions: { exact_loads_and_fitment_require_measurement: true } });
    if (!result.ok) return setter(result.error);
    dataSetter(result);
    setter(`${type === 'power' ? 'Power' : 'Comms'} baseline saved — ${result.items?.length || 0} build items.`);
  }
  async function saveTuneSnapshot() {
    if (!vehicleReady) return setTuneSaved('Build your vehicle profile first to save this snapshot.');
    setTuneSaved('Saving snapshot…');
    const configuration = {
      crank_hp: Number(hp) || 0,
      crank_torque_lbft: Number(torque) || 0,
      weight_lb: Number(weight) || 0,
      drivetrain_loss_pct: Number(loss) || 0,
      estimated_wheel_hp: tuneMath.wheelHp == null ? null : Number(tuneMath.wheelHp.toFixed(1)),
      estimated_wheel_torque_lbft: tuneMath.wheelTorque == null ? null : Number(tuneMath.wheelTorque.toFixed(1)),
      weight_per_whp: tuneMath.weightPerWheelHp == null ? null : Number(tuneMath.weightPerWheelHp.toFixed(2)),
      rough_quarter_mile_et_sec: tuneMath.quarterMileEt == null ? null : Number(tuneMath.quarterMileEt.toFixed(2)),
      rough_quarter_mile_trap_mph: tuneMath.quarterMileTrap == null ? null : Number(tuneMath.quarterMileTrap.toFixed(1)),
      current_tire: stockTire,
      new_tire: newTire,
      indicated_speed_mph: Number(speed) || 0,
      top_gear_ratio: Number(gearRatio) || 0,
      final_drive: Number(finalDrive) || 0,
      first_gear_ratio: Number(firstGear) || 0,
      transfer_case_low_ratio: Number(transferLow) || 0,
      actual_speed_mph: tuneMath.trueSpeed == null ? null : Number(tuneMath.trueSpeed.toFixed(1)),
      rpm_at_speedometer_reading: tuneMath.rpmAtIndicatedSpeed == null ? null : Number(tuneMath.rpmAtIndicatedSpeed.toFixed(0)),
      rpm_at_entered_true_speed: tuneMath.rpmAtTrueSpeed == null ? null : Number(tuneMath.rpmAtTrueSpeed.toFixed(0)),
      effective_final_drive: tuneMath.effectiveFinalDrive == null ? null : Number(tuneMath.effectiveFinalDrive.toFixed(3)),
      restore_stock_feel_final_drive: tuneMath.recommendedFinalDrive == null ? null : Number(tuneMath.recommendedFinalDrive.toFixed(3)),
      mechanical_crawl_ratio: tuneMath.crawlRatio == null ? null : Number(tuneMath.crawlRatio.toFixed(2)),
      tire_adjusted_crawl_ratio: tuneMath.tireAdjustedCrawlRatio == null ? null : Number(tuneMath.tireAdjustedCrawlRatio.toFixed(2)),
    };
    const result = await roadsIntake({ action: 'save_tune_snapshot', vehicle: normalizedVehicle, configuration, versionLabel: `Misfit Tune Lab — ${vehicleLabel}` });
    setTuneSaved(result.ok ? 'Tune snapshot saved to your Misfit garage.' : result.error);
    if (result.ok) await emitRoadsEvent({ eventType: 'tune_calculator_snapshot', moduleKey: 'tuner_lab', vehicle: normalizedVehicle, metadata: { tune_version_id: result.tuneVersionId, ...configuration } });
  }
  async function outbound(partnerKey, offerKey, url, moduleKey) {
    await emitRoadsEvent({ eventType: 'partner_clickout', partnerKey, offerKey, moduleKey, outboundUrl: url, clickId: `clk_${crypto.randomUUID()}`, vehicle: normalizedVehicle });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const nav = [['Tune Lab', '#tune'], ['My Garage', '#garage'], ['Tool DNA', '#tools'], ['Wheel Lab', '#wheels'], ['Vehicle Systems', '#systems']];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050607] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <a href="#top" className="flex items-center" onClick={() => setMenuOpen(false)} aria-label="Misfit Road Lab home"><RoadLabLogo /></a>
          <nav className="hidden items-center gap-5 lg:flex">{nav.map(([label, href]) => <a key={href} href={href} className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/55 hover:text-white">{label}</a>)}</nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => outbound('coffee_and_a_joint', 'misfit_merch', COFFEE_SHOP, 'road_lab_merch')} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e6b325]/40 px-3 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-[#f0c84a] sm:h-11 sm:px-4">Merch <ShoppingBag size={13} /></button>
            <div className="hidden xl:block"><MisfitMark /></div>
            <button type="button" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] lg:hidden">{menuOpen ? <X size={18} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {menuOpen ? <div className="border-t border-white/10 bg-[#07090b] px-5 pb-6 pt-2 lg:hidden">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 font-display text-xl font-black uppercase">{label}<ChevronRight size={15} className="text-white/30" /></a>)}</div> : null}
      </header>

      <main id="top">
        <section className="relative min-h-[610px] overflow-hidden border-b border-white/10 sm:min-h-[660px] lg:min-h-[720px]">
          <img src={HERO_IMAGE} alt="Misfit overland vehicle, motorcycle and expedition trailer" className="absolute inset-0 h-full w-full object-cover object-center opacity-95 brightness-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/38 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-black/10 to-black/10" />
          <div className="relative mx-auto flex min-h-[610px] max-w-7xl items-end px-5 pb-10 pt-16 sm:min-h-[660px] sm:px-6 sm:pb-14 lg:min-h-[720px] lg:items-center lg:pb-0">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">Misfit Road Lab <span className="text-[#00c7f2]">//</span> cars · trucks · overland</div>
              <h1 className="mt-5 max-w-[11ch] font-display text-[3.3rem] font-black uppercase leading-[0.84] tracking-[-0.045em] drop-shadow-[0_3px_18px_rgba(0,0,0,.8)] sm:text-7xl lg:text-[6.8rem]">Run the numbers.<br /><span className="text-[#00c7f2]">Build the machine.</span></h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-lg sm:leading-7">Street, track or dirt: calculate power, tires, gearing and crawl ratio, build a field kit, mock up wheels, and save everything to one garage.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="#garage" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#00c7f2] px-6 py-3.5 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black">Build my vehicle <CarFront size={15} /></a><a href="#wheels" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 bg-black/50 px-6 py-3.5 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-white">Open Wheel Lab <ChevronRight size={14} /></a></div>
              <div className="mt-5 w-fit rounded-full border border-white/10 bg-black/45 px-3 py-2"><MisfitMark /></div>
            </div>
          </div>
        </section>

        <section id="tune" className="scroll-mt-16 border-b border-white/10 bg-[#07090b]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16"><div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
            <div>
              <SectionHead kicker="01 / Tune Lab" title="Numbers before noise." copy="Calculate wheel power, performance estimates, metric or flotation tires, corrected speed, cruising RPM, effective gearing and crawl ratio. Save the snapshot to your Misfit garage." />
              <div className="mt-7 grid gap-4 sm:grid-cols-2"><Field label="Crank horsepower" value={hp} onChange={setHp} placeholder="260" inputMode="decimal" /><Field label="Crank torque (lb-ft)" value={torque} onChange={setTorque} placeholder="335" inputMode="decimal" /><Field label="Vehicle weight (lb)" value={weight} onChange={setWeight} placeholder="5200" inputMode="decimal" /><Field label="Drivetrain loss %" value={loss} onChange={setLoss} placeholder="20" inputMode="decimal" /></div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5"><Result label="Est. wheel HP" value={formatNumber(tuneMath.wheelHp)} /><Result label="Est. wheel torque" value={formatNumber(tuneMath.wheelTorque)} suffix="lb-ft" /><Result label="Weight / WHP" value={formatNumber(tuneMath.weightPerWheelHp, 2)} suffix="lb" /><Result label="Est. 1/4 ET" value={formatNumber(tuneMath.quarterMileEt, 2)} suffix="sec" /><Result label="Est. trap" value={formatNumber(tuneMath.quarterMileTrap, 1)} suffix="mph" /></div>
              <p className="mt-3 text-[11px] leading-5 text-white/35">Wheel power uses the entered drivetrain-loss estimate. Quarter-mile ET and trap speed are physics-based estimates, not dyno or track guarantees.</p>
              <div className="mt-8 border-t border-white/10 pt-7"><div className="flex items-center gap-2 font-display text-xl font-black uppercase"><Calculator size={19} className="text-[#00c7f2]" /> Tire + gearing math</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Current tire" value={stockTire} onChange={setStockTire} placeholder="285/75R16" /><Field label="New tire" value={newTire} onChange={setNewTire} placeholder="35x12.50R17" /><Field label="Speedometer reading (mph)" value={speed} onChange={setSpeed} placeholder="65" inputMode="decimal" /><Field label="Top gear ratio" value={gearRatio} onChange={setGearRatio} placeholder="0.70" inputMode="decimal" /><Field label="Final drive" value={finalDrive} onChange={setFinalDrive} placeholder="3.73" inputMode="decimal" /><Field label="First gear ratio" value={firstGear} onChange={setFirstGear} placeholder="3.06" inputMode="decimal" /><Field label="Transfer-case low" value={transferLow} onChange={setTransferLow} placeholder="2.72 · use 1 for 2WD" inputMode="decimal" /></div>
                {(!tuneMath.currentTire || !tuneMath.newTire) ? <Status>Use a metric tire such as 285/75R16 or a flotation tire such as 35x12.50R17.</Status> : null}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Result label="New tire diameter" value={formatNumber(tuneMath.newTire?.diameter, 2)} suffix="in" /><Result label="Diameter change" value={formatNumber(tuneMath.diameterChangePct, 2)} suffix="%" /><Result label="True speed" value={formatNumber(tuneMath.trueSpeed, 1)} suffix="mph" /><Result label="Speedo error" value={formatNumber(tuneMath.speedometerError, 1)} suffix="mph" /><Result label="Effective axle ratio" value={formatNumber(tuneMath.effectiveFinalDrive, 2)} /><Result label="Ratio to restore feel" value={formatNumber(tuneMath.recommendedFinalDrive, 2)} /><Result label={`RPM at ${speed || '—'} indicated`} value={formatNumber(tuneMath.rpmAtIndicatedSpeed)} /><Result label={`RPM at ${speed || '—'} true`} value={formatNumber(tuneMath.rpmAtTrueSpeed)} /><Result label="Mechanical crawl" value={formatNumber(tuneMath.crawlRatio, 2)} suffix=":1" /><Result label="Tire-adjusted crawl" value={formatNumber(tuneMath.tireAdjustedCrawlRatio, 2)} suffix=":1" /><Result label="New tire revs/mile" value={formatNumber(tuneMath.newTire?.revolutionsPerMile)} /><Result label="New sidewall" value={formatNumber(tuneMath.newTire?.sidewall, 2)} suffix="in" /></div><button type="button" onClick={saveTuneSnapshot} className="mt-5 inline-flex items-center gap-2 border border-[#00c7f2]/45 px-5 py-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-[#7eeaff]">Save tune snapshot <ChevronRight size={13} /></button>{tuneSaved ? <Status good={tuneSaved.includes('saved')}>{tuneSaved}</Status> : null}</div>
            </div>
            <div className="relative hidden min-h-[680px] overflow-hidden rounded-3xl border border-white/10 bg-black lg:block"><img src={LAB_MARK} alt="Misfit neon skull and rose" className="absolute inset-0 h-full w-full object-cover object-center" /></div>
          </div></div>
        </section>

        <section id="garage" className="scroll-mt-16 border-b border-white/10 bg-[#050607]"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16"><SectionHead kicker="02 / My Garage" title="Tell Misfit what you drive once." copy="Tune Lab, Tool DNA, Wheel Lab and Vehicle Systems all use this same saved profile." /><form onSubmit={saveVehicle} className="mt-7 grid gap-3 rounded-2xl border border-white/10 bg-[#0a0d0f] p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">{[['year','Year','1997'],['make','Make','Chevrolet'],['model','Model','Suburban K1500'],['trim','Trim','LS'],['engine','Engine','5.7L Vortec L31'],['transmission','Transmission','4L60E'],['drivetrain','Drivetrain','4x4'],['tireSize','Tire size','285/75R16'],['wheelSize','Wheel size','16x8']].map(([key,label,placeholder]) => <Field key={key} label={label} value={vehicle[key]} onChange={(value) => setVehicleField(key,value)} placeholder={placeholder} />)}<label className="grid gap-2 sm:col-span-2 lg:col-span-3"><span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">Mods / use case</span><textarea value={vehicle.mods} onChange={(e) => setVehicleField('mods',e.target.value)} rows={3} placeholder="street, track, drift, rally, towing, daily, build notes..." className="rounded-xl border border-white/12 bg-black/70 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00c7f2]/70" /></label><button className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#00c7f2] px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black sm:col-span-2 lg:col-span-3">Save vehicle to Misfit <ChevronRight size={14} /></button>{vehicleResult ? <div className="sm:col-span-2 lg:col-span-3"><Status good={vehicleResult.startsWith('Saved')}>{vehicleResult}</Status></div> : null}</form></div></section>

        <section id="tools" className="scroll-mt-16 border-b border-white/10 bg-[#07090b]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16"><div><SectionHead kicker="03 / Tool DNA" title="Carry what fixes your rig. Nothing else." copy="Misfit builds a useful baseline kit and merges exact OEM/service facts only when verified records exist. Exact sizes are never invented." /><div className="mt-5 rounded-xl border border-[#00c7f2]/20 bg-[#00c7f2]/[0.04] p-4 text-xs leading-6 text-white/60">Baseline = universal service coverage. Verified badge = exact vehicle fact backed by service data.</div></div><form onSubmit={buildKit} className="rounded-2xl border border-white/10 bg-black/55 p-5 sm:p-6"><div className="grid gap-2">{KIT_TIERS.map(([key,label,copy]) => <label key={key} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${kitTier===key?'border-[#00c7f2]/60 bg-[#00c7f2]/[0.07]':'border-white/10'}`}><input type="radio" checked={kitTier===key} onChange={() => setKitTier(key)} /><span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-white/45">{copy}</span></span></label>)}</div><button className="mt-5 w-full bg-white px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black">Create Tool DNA build</button>{kitResult ? <Status good={kitResult.includes('saved')}>{kitResult}</Status> : null}{kitData ? <BuildItems items={kitData.toolManifest} /> : null}<button type="button" onClick={() => outbound('snap_on','custom_kitting',SNAP_ON,'tool_dna')} className="mt-4 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-white/40 hover:text-white">View professional custom kitting <ExternalLink size={12} /></button></form></div></section>

        <section id="wheels" className="scroll-mt-16 border-b border-white/10 bg-[#080a0c]"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16"><div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-12"><div><SectionHead kicker="04 / Wheel Lab" title="Put wheels on your actual rig." copy="Upload your photo, tap the front and rear wheel centers, choose a Misfit concept style, size it, render it, save it and share it from your phone." /><div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-black"><img src={HERO_IMAGE} alt="Misfit overland build" className="aspect-[16/10] w-full object-cover object-center" /></div><button type="button" onClick={() => outbound('fifteen52','wheels',FIFTEEN52,'wheel_lab')} className="mt-4 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-white/45 hover:text-white">Open wheel fitment reference <ExternalLink size={12} /></button></div><div className="rounded-2xl border border-white/10 bg-black/45 p-5 sm:p-6">
          {!imagePreview ? <label className="grid min-h-52 cursor-pointer place-items-center rounded-xl border border-dashed border-white/20 bg-white/[0.025] text-center"><div className="p-7"><Upload className="mx-auto text-[#00c7f2]" /><div className="mt-3 font-display text-xl font-black uppercase">Upload your car</div><div className="mt-1 text-xs text-white/45">JPG, PNG or WebP · max 8 MB</div></div><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="hidden" /></label> : <><div ref={previewRef} onClick={placeWheel} className="relative cursor-crosshair overflow-hidden rounded-xl border border-white/15 bg-black"><img src={imagePreview} alt="Uploaded vehicle" className="block max-h-[520px] w-full object-contain" />{['front','rear'].map((key) => <img key={key} src={wheelAsset} alt="" className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_8px_rgba(0,0,0,.55)]" style={{ left:`${wheelPoints[key].x}%`, top:`${wheelPoints[key].y}%`, width:`${wheelSize}%` }} />)}<div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/75 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white/80">Tap {activeWheel} wheel center</div></div><label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-white/45 hover:text-white"><Upload size={13} /> Use another photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="hidden" /></label></>}
          {uploadState ? <Status good={uploadState.startsWith('Photo saved')}>{uploadState}</Status> : null}
          <div className="mt-4 grid grid-cols-3 gap-2">{['street','track','offroad'].map((direction) => <button key={direction} type="button" onClick={() => setWheelDirection(direction)} className={`rounded-xl border px-3 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.11em] ${wheelDirection===direction?'border-[#00c7f2]/60 bg-[#00c7f2]/[0.07] text-[#7eeaff]':'border-white/10 text-white/45'}`}>{direction}</button>)}</div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/45">Wheel overlay size</span><span className="font-display text-lg font-black">{wheelSize}%</span></div><input type="range" min="8" max="36" value={wheelSize} onChange={(e) => setWheelSize(Number(e.target.value))} className="mt-3 w-full" /><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setActiveWheel('front')} className={`rounded-lg border px-3 py-2 font-mono text-[8px] uppercase ${activeWheel==='front'?'border-[#00c7f2]/60 text-[#7eeaff]':'border-white/10 text-white/40'}`}>Place front</button><button type="button" onClick={() => setActiveWheel('rear')} className={`rounded-lg border px-3 py-2 font-mono text-[8px] uppercase ${activeWheel==='rear'?'border-[#00c7f2]/60 text-[#7eeaff]':'border-white/10 text-white/40'}`}>Place rear</button></div></div>
          <button type="button" disabled={rendering} onClick={renderWheelBuild} className="mt-4 w-full bg-[#00c7f2] px-5 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black disabled:opacity-50">{rendering ? 'Rendering…' : 'Render + save wheel build'}</button>{wheelResult ? <Status good={wheelResult.startsWith('Rendered')}>{wheelResult}</Status> : null}{renderPreview ? <div className="mt-4 overflow-hidden rounded-xl border border-[#00c7f2]/25"><img src={renderPreview} alt="Rendered Misfit wheel concept" className="w-full" /><button type="button" onClick={shareRender} className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-white"><Share2 size={13} /> Share / save image <Download size={13} /></button></div> : null}
        </div></div></div></section>

        <section id="systems" className="scroll-mt-16 border-b border-white/10 bg-[#050607]"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16"><SectionHead kicker="05 / Vehicle Systems" title="Power it. Connect it. Keep moving." copy="Build a sane baseline architecture around the vehicle. Final cable sizes, fuse sizes, radio choices and fitment still depend on measured loads, installation and legal requirements." /><div className="mt-7 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#0a0d0f] p-6 sm:p-7"><div className="flex items-center justify-between"><BatteryCharging className="text-[#00c7f2]" /><span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Vehicle Power</span></div><h3 className="mt-6 font-display text-2xl font-black uppercase">Build the electrical backbone.</h3><p className="mt-3 text-sm leading-6 text-white/55">Charging, auxiliary power, distribution, inverter and optional solar — built in the right order.</p><button type="button" onClick={() => saveGuide('power')} className="mt-5 inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.13em] text-white">Build + save power plan <ChevronRight size={13} /></button>{powerResult ? <Status good={powerResult.includes('saved')}>{powerResult}</Status> : null}{powerData ? <BuildItems items={powerData.items} /> : null}</div><div className="rounded-2xl border border-white/10 bg-[#0a0d0f] p-6 sm:p-7"><div className="flex items-center justify-between"><Radio className="text-[#00c7f2]" /><span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Comms + Nav</span></div><h3 className="mt-6 font-display text-2xl font-black uppercase">Stay connected when the road gets weird.</h3><p className="mt-3 text-sm leading-6 text-white/55">Offline navigation, radio, antenna, satellite and clean dedicated power.</p><button type="button" onClick={() => saveGuide('comms')} className="mt-5 inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-mono text-[8px] font-black uppercase tracking-[0.13em] text-white">Build + save comms plan <ChevronRight size={13} /></button>{commsResult ? <Status good={commsResult.includes('saved')}>{commsResult}</Status> : null}{commsData ? <BuildItems items={commsData.items} /> : null}</div></div></div></section>

        <section id="merch" className="scroll-mt-16 border-b border-white/10 bg-[#08090a]"><div className="mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_.95fr]"><div className="relative overflow-hidden"><img src={HERO_IMAGE} alt="Misfit expedition machine" className="aspect-[16/11] w-full object-cover object-center lg:h-full lg:min-h-[560px] lg:aspect-auto" /></div><div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16"><div className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#e6b325]">Coffee &amp; A Joint · Misfit merch</div><h2 className="mt-4 font-display text-[2.6rem] font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-6xl">Build the machine.<br />Wear the bad idea.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-white/65">The calculator stays free. The hats fund the next strange machine.</p><button onClick={() => outbound('coffee_and_a_joint','misfit_merch',COFFEE_SHOP,'road_lab_merch')} className="mt-6 inline-flex w-full min-h-12 items-center justify-center gap-2 bg-[#e6b325] px-6 py-4 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-black sm:w-fit">Shop Coffee &amp; A Joint <ShoppingBag size={15} /></button></div></div></section>
      </main>

      <footer className="bg-black"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-5"><RoadLabLogo compact /><div className="h-7 w-px bg-white/10" /><MisfitMark /></div><div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-white/30"><Check size={12} className="text-[#00c7f2]" /> Live garage storage · functional Wheel Lab · saved builds</div></div></footer>
    </div>
  );
}
