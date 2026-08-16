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
  ['growth_engine', 'ROADS ENGINE', 'Garage profiles â†’ segments â†’ personalized drops', Rocket, 'ACTIVE'],
  ['alliance_engine', 'ALLIANCE ENGINE', 'Sponsors â†’ affiliates â†’ ambassadors â†’ payouts', Users, 'ACTIVE'],
  ['supply_engine', 'SUPPLY ENGINE', 'Suppliers â†’ routing â†’ fulfillment â†’ margin', Warehouse, 'ACTIVE'],
  ['xp_engine', 'XP ENGINE', 'Miles / XP â†’ levels â†’ quests â†’ loyalty', Zap, 'SCHEMA LIVE'],
  ['creator_engine', 'CREATOR ENGINE', 'UGC â†’ rights â†’ creators â†’ collab drops', Sparkles, 'SCHEMA LIVE'],
  ['signal_engine', 'SIGNAL ENGINE', 'Metrics â†’ insights â†’ next best moves', CircleGauge, 'SCHEMA LIVE'],
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
  return (
    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#00c7f2]">
      {children}
    </div>
  );
}

function Status({ children }) {
  return (
    <span className="rounded-full border border-[#00c7f2]/20 bg-[#00c7f2]/[0.06] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-slate-400">
      {children}
    </span>
  );
}

function Panel({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`border border-white/10 bg-[#0a0d0f]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function RoadsGarageOSV2() {
  const [vehicle, setVehicle] = useState({
    year: '', make: '', model: '', trim: '', engine: '', transmission: '',
    drivetrain: '', tireSize: '', wheelSize: '', mods: '',
  });
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
    emitRoadsEvent({
      eventType: 'page_view',
      moduleKey: 'roads_garage_os_v2',
      metadata: { surface: 'misfit_public_bridge', visual_system: 'black_flag_v3' },
    });
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
    setKitResult(result.ok ? `${KIT_TIERS.find(([key]) => key === kitTier)?.[1]} profile ${result.toolkitBuildId.slice(0,8)} captured. Exact tool sizes remain locked until verified service data is attached.` : result.error);
  }

  function chooseImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    setImageMeta({ name: file.name, type: file.type, size: file.size });
    setWheelResult('');
    emitRoadsEvent({ eventType: 'visualizer_image_selected', moduleKey: 'wheel_lab', partnerKey: 'fifteen52', zV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÂÖWFFF¢²f–ÆU÷G—S¢f–ÆRçG—RÂf–ÆU÷6—¦S¢f–ÆRç6—¦RÒÒ“°¢Ð ¢7–æ2gVæ7F–öâ7&VFUv†VVÄ'&–Vb‚’°¢–b‚fV†–6ÆU&VG’’&WGW&â6WEv†VVÅ&W7VÇB‚t'V–ÆBF†RfV†–6ÆR&öf–ÆRf—'7Bâr“°¢–b‚–ÖvTÖWF’&WGW&â6WEv†VVÅ&W7VÇB‚uWÆöBfV†–6ÆR†÷Fòf—'7Bâr“°¢v—BVÖ—E&öG4WfVçB‡²WfVçEG—S¢wv†VVÅ÷f—7VÆ—¦W%÷7V&Ö—BrÂÖöGVÆT¶W“¢wv†VVÅöÆ"rÂ'FæW$¶W“¢vf–gFVVãS"rÂöffW$¶W“¢wv†VVÅ÷f—7VÆ—¦W"rÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÂÖWFFF¢²v†VVÅöF—&V7F–öã¢v†VVÄF—&V7F–öâÒÒ“°¢6öç7B&W7VÇBÒv—B&öG4–çF¶R‡°¢7F–öã¢v7&VFU÷f—7VÆ—¦W%ö¦ö"rÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÂ'FæW$¶W“¢vf–gFVVãS"rÀ¢6÷W&6T76WE&Vc¢Æö6Å÷VæF–æu÷WÆöC¢G¶–ÖvTÖWFææÖWÖÀ¢v†VVÅ7V3¢²F—&V7F–öã¢v†VVÄF—&V7F–öâÒÂF—&U7V3¢·ÒÀ¢ÖWFFF¢²6÷W&6Uöf–ÆU÷G—S¢–ÖvTÖWFçG—RÂ6÷W&6Uöf–ÆU÷6—¦S¢–ÖvTÖWFç6—¦RÒÀ¢Ò“°¢6WEv†VVÅ&W7VÇB‡&W7VÇBæö²òf—7VÆ—¦W"¦ö"G·&W7VÇBçf—7VÆ—¦W$¦ö$–Bç6Æ–6RƒÃ‚—Ò6fVBâ&VÂ–ÖvR&VæFW&–ær—2æ÷B6öææV7FVB–WBÂ6òvR&Ræ÷Bf¶–ærF†R÷WGWBæ¢&W7VÇBæW'&÷"“°¢Ð ¢7–æ2gVæ7F–öâ6fTwV–FR‡G—R’°¢–b‚fV†–6ÆU&VG’’°¢6öç7B6WGFW"ÒG—RÓÓÒw÷vW"rò6WE÷vW%&W7VÇB¢6WD6öÖ×5&W7VÇC°¢&WGW&â6WGFW"‚t'V–ÆBF†RfV†–6ÆR&öf–ÆRf—'7Bâr“°¢Ð¢6öç7BÖöGVÆT¶W’ÒG—RÓÓÒw÷vW"ròw÷vW%ö6öÖÖæBr¢v6öÖ×5ö6öÖÖæBs°¢v—BVÖ—E&öG4WfVçB‡²WfVçEG—S¢vwV–FUö–çFVçBrÂÖöGVÆT¶W’ÂöffW$¶W“¢ÖöGVÆT¶W’ÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÒ“°¢6öç7B&W7VÇBÒv—B&öG4–çF¶R‡°¢7F–öã¢w6fUö÷fW&ÆæEö–çFW&W7BrÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÂwV–FUG—S¢G—RÀ¢F—FÆS¢G·G—RÓÓÒw÷vW"ròu÷vW"r¢t6öÖ×2wÒ6öÖÖæB(	BG·fV†–6ÆTÆ&VÇÖÀ¢W6T66S¢wfV†–6ÆR×7V6–f–2÷fW&ÆæB&6†—FV7GW&RrÀ¢77V×F–öç3¢²ff–Æ–FUö&öÓ¢wÆææVBrÂfW&–f–VEöf—FÖVçE÷&WV—&VC¢G'VRÒÀ¢Ò“°¢6öç7B6WGFW"ÒG—RÓÓÒw÷vW"rò6WE÷vW%&W7VÇB¢6WD6öÖ×5&W7VÇC°¢6WGFW"‡&W7VÇBæö²ò6fVB'V–ÆBG·&W7VÇBæwV–FT–Bç6Æ–6RƒÃ‚—ÒFò&öG2æ¢&W7VÇBæW'&÷"“°¢Ð ¢7–æ2gVæ7F–öâ÷WF&÷VæB‡'FæW$¶W’ÂöffW$¶W’ÂW&ÂÂÖöGVÆT¶W’’°¢v—BVÖ—E&öG4WfVçB‡°¢WfVçEG—S¢w'FæW%ö6Æ–6¶÷WBrÂ'FæW$¶W’ÂöffW$¶W’ÂÖöGVÆT¶W’Â÷WF&÷VæEW&Ã¢W&ÂÀ¢6Æ–6´–C¢6ÆµòG¶7'—Fòç&æFöÕUT”B‚—ÖÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÀ¢Ò“°¢v–æF÷ræ÷Vâ‡W&ÂÂuö&Ææ²rÂvæö÷VæW"Ææ÷&VfW'&W"r“°¢Ð ¢7–æ2gVæ7F–öâ÷Vå&—fFT&6´öff–6R‚’°¢v—BVÖ—E&öG4WfVçB‡²WfVçEG—S¢v&6µööff–6Uö÷VârÂÖöGVÆT¶W“¢w&öG5ö6öÖÖæEö6VçFW"rÂ÷WF&÷VæEW&Ã¢$•dDUô$4µôôdd”4RÂÖWFFF¢²66W73¢w&—fFUöWF†VçF–6FVE÷7W&f6RrÒÒ“°¢v–æF÷ræ÷Vâ…$•dDUô$4µôôdd”4RÂuö&Ææ²rÂvæö÷VæW"Ææ÷&VfW'&W"r“°¢Ð ¢&WGW&â€¢ÆF—b6Æ74æÖSÒ&Ö–âÖ‚×67&VVâ÷fW&fÆ÷r×‚Ö†–FFVâ&rÕ²3ScuÒFW‡B×v†—FR#à¢ÆÖ–ãà ¢Ç6V7F–öâ6Æ74æÖSÒ'&VÆF—fRÖ–âÖ‚Õ³sc…Ò÷fW&fÆ÷rÖ†–FFVâ&÷&FW"Ö"&÷&FW"×v†—FRó#à¢Æ–Öp¢7&3Ò"÷&öG2Ö6öÖÖæBÖ†W&ò×c"çvV' ¢ÇCÒ%&öG2v&vRõ26öÖÖæB6VçFW" ¢6Æ74æÖSÒ&'6öÇWFR–ç6WBÓ‚ÖgVÆÂ×rÖgVÆÂö&¦V7BÖ6÷fW"ö&¦V7BÖ6VçFW" ¢óà¢ÆF—b6Æ74æÖSÒ&'6öÇWFR–ç6WBÓ&rÖw&F–VçB×Fò×"–g&öÒÖ&Æ6²f–Ö&Æ6²ósRFòÖ&Æ6²ó#R"óà¢ÆF—b6Æ74æÖSÒ&'6öÇWFR–ç6WBÓ&rÖw&F–VçB×Fò×Bg&öÒÕ²3ScuÒf–×G&ç7&VçBFòÖ&Æ6²ó3R"óà¢ÆF—b6Æ74æÖSÒ'&VÆF—fR×‚ÖWFòfÆW‚Ö–âÖ‚Õ³sc…ÒÖ‚×rÓw†ÂfÆW‚Ö6öÂ§W7F–g’Ö&WGvVVâ‚ÓR’Ó‚6Ó§’Ó"#à¢ÆF—b6Æ74æÖSÒ&fÆW‚fÆW‚×w&—FV×2Ö6VçFW"§W7F–g’Ö&WGvVVâvÓR&÷&FW"Ö"&÷&FW"×v†—FRóR"Ób#à¢ÆF—b6Æ74æÖSÒ&fÆW‚—FV×2Ö6VçFW"#à¢Æ–Öp¢7&3Ò"÷&öG2ÖÖ—6f—BÖ&Æ6²ÖfÆrÖÆö6·WçvV' ¢ÇCÒ%&öG26òâ9rÖ—6f—BÖVF–†÷W6R ¢6Æ74æÖSÒ&‚Ó3"rÓ3"&÷VæFVB×6Òö&¦V7BÖ6öçF–âG&÷×6†F÷rÕ³óó#'…÷&v&ƒÃ“’Ã#C"Ãã"•Ò6Ó¦‚ÓC6Ó§rÓC ¢óà¢ÂöF—cà¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×¶÷Vå&—fFT&6´öff–6WÐ¢6Æ74æÖSÒ&–æÆ–æRÖfÆW‚—FV×2Ö6VçFW"vÓ"&÷&FW"&÷&FW"Õ²33vc%ÒóS&rÖ&Æ6²ócR‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³…ÒföçBÖ&öÆBWW&66RG&6¶–ærÕ³ãfVÕÒFW‡BÕ²3vVVfeÒ&6¶G&÷Ö&ÇW"G&ç6—F–öâ†÷fW#¦&rÕ²33vc%Ò†÷fW#§FW‡BÖ&Æ6² ¢à¢÷Vâ&—fFR&öG2&6²öff–6RÄW‡FW&æÄÆ–æ²6—¦S×³GÒóà¢Âö'WGFöãà¢ÂöF—cà ¢ÆF—b6Æ74æÖSÒ&Ö‚×rÓG†Â"Ó‚BÓ#6Ó§BÓ#‚#à¢ÆF—b6Æ74æÖSÒ&–æÆ–æRÖfÆW‚&÷&FW"&÷&FW"×v†—FRóR&rÖ&Æ6²óSR‚Ó2’Ó"föçBÖÖöæòFW‡BÕ³…ÒföçBÖ&öÆBWW&66RG&6¶–ærÕ³ã#fVÕÒFW‡B×6ÆFRÓ3&6¶G&÷Ö&ÇW"#à¢$Ä4²dÄròò$ôE2t$tRõ2òò$4´TB%’Ô•4d•@¢ÂöF—cà¢Æƒ6Æ74æÖSÒ&×BÓbföçBÖF—7Æ’FW‡BÓg†ÂföçBÖ&Æ6²WW&66RÆVF–ærÕ³ãƒ%ÒG&6¶–ærÕ²ÓãCVVÕÒ6Ó§FW‡BÓ‡†ÂÆs§FW‡BÕ³‚ã'&VÕÒ#à¢D„R4#Æ'"óà¢$T4ôÔU2D„SÆ'"óà¢Ç7â6Æ74æÖSÒ'FW‡BÕ²33vc%Ò#ä5U5DôÔU"´U’ãÂ÷7ãà¢Âöƒà¢Ç6Æ74æÖSÒ&×BÓrÖ‚×rÓ'†Â&÷&FW"ÖÂÓ"&÷&FW"Õ²33vc%ÒÂÓRFW‡BÖ&6RÆVF–ærÓrFW‡B×6ÆFRÓ36Ó§FW‡BÖÆr#à¢öæRfV†–6ÆR&öf–ÆR÷vW'2FööÇ2Âv†VVÇ2ÂF—&W2Â6öÆ"Â6öÖ×Væ–6F–öç2ÂFVÆVÖWG'’ÂÖW&6‚À¢7&VF÷'2Â'FæW'2æBgWGW&Rf'&–6F–öâöffW'2â&öG2÷vç2F†R7VÇGW&RâÖ—6f—B'Vç2F†RÖ6†–æRà¢Â÷à¢ÂöF—cà ¢ÆF—b6Æ74æÖSÒ&w&–B&÷&FW"&÷&FW"×v†—FRóR&rÖ&Æ6²óSR&6¶G&÷Ö&ÇW"6Ó¦w&–BÖ6öÇ2Ó2#à¢µ°¢²td•%5BòÄ5Bòd”äÂrÂtGG&–'WF–öâuÒÀ¢²udT„”4ÄR8QDDäCrÂt6öÖÖW&6Rw&‚uÒÀ¢²uTä4ôåE$5DTBM2rÂt6öÖÖ—76–öâG'WF‚uÒÀ¢ÒæÖ‚…·fÇVRÂÆ&VÅÒ’Óâ€¢ÆF—b¶W“×¶Æ&VÇÒ6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"×v†—FRóRÓRÆ7C¦&÷&FW"Ö"Ó6Ó¦&÷&FW"Ö"Ó6Ó¦&÷&FW"×"6Ó¦Æ7C¦&÷&FW"×"Ó#à¢ÆF—b6Æ74æÖSÒ&föçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ã†VÕÒFW‡B×6ÆFRÓS#ç¶Æ&VÇÓÂöF—cà¢ÆF—b6Æ74æÖSÒ&×BÓ"föçBÖF—7Æ’FW‡BÖÆrföçBÖ&Æ6²WW&66R6Ó§FW‡B×†Â#ç·fÇVWÓÂöF—cà¢ÂöF—cà¢’—Ð¢ÂöF—cà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"×v†—FRó&rÕ²3s“%Ò#à¢ÆF—b6Æ74æÖSÒ&×‚ÖWFòÖ‚×rÓw†Â‚ÓR’ÓB#à¢ÄÆ&VÃãòF†R&öG2Væv–æR7F6³ÂôÆ&VÃà¢ÆF—b6Æ74æÖSÒ&×BÓRw&–BvÓ2ÖC¦w&–BÖ6öÇ2Ó"†Ã¦w&–BÖ6öÇ2Ó2#à¢´Tät”äUõ5D4²æÖ‚…¶¶W’ÂF—FÆRÂ6÷’Â–6öâÂ7FFUÒ’Óâ€¢Æ'WGFöâ¶W“×¶¶W—ÒG—SÒ&'WGFöâ"öä6Æ–6³×²‚’ÓâVÖ—E&öG4WfVçB‡²WfVçEG—S¢vVæv–æUö–çFW&W7BrÂÖöGVÆT¶W“¢¶W’ÂfV†–6ÆS¢æ÷&ÖÆ—¦VEfV†–6ÆRÒ—Ò6Æ74æÖSÒ&w&÷W&÷&FW"&÷&FW"×v†—FRó&rÕ²3CeÒÓRFW‡BÖÆVgBG&ç6—F–öâ†÷fW#¢×G&ç6ÆFR×’ÓãR†÷fW#¦&÷&FW"Õ²33vc%ÒóCR†÷fW#¦&rÕ²33EÒ#à¢ÆF—b6Æ74æÖSÒ&fÆW‚—FV×2×7F'B§W7F–g’Ö&WGvVVâvÓB#ãÄ–6öâ6Æ74æÖSÒ'FW‡BÕ²33vc%Ò"óãÅ7FGW3ç·7FFWÓÂõ7FGW3ãÂöF—cà¢ÆF—b6Æ74æÖSÒ&×BÓ‚föçBÖF—7Æ’FW‡BÓ'†ÂföçBÖ&Æ6²WW&66R#ç·F—FÆWÓÂöF—cà¢Ç6Æ74æÖSÒ&×BÓ"FW‡B×6ÒÆVF–ærÓbFW‡B×6ÆFRÓC#ç¶6÷—ÓÂ÷à¢Âö'WGFöãà¢–—Ð¢ÂöF—cà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ–CÒ'fV†–6ÆRÖ–çF¶R"6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"×v†—FRó&rÕ²3ScuÒ#à¢ÆF—b6Æ74æÖSÒ&×‚ÖWFòw&–BÖ‚×rÓw†ÂvÓ‚‚ÓR’ÓbÆs¦w&–BÖ6öÇ2Õ²ãcVg%óã3Vg%Ò#à¢ÆF—cà¢ÄÆ&VÃãòfV†–6ÆR–FVçF—G“ÂôÆ&VÃà¢Æƒ"6Æ74æÖSÒ&×BÓBföçBÖF—7Æ’FW‡BÓW†ÂföçBÖ&Æ6²WW&66RÆVF–ærÕ³ã•Ò#à¢FVÆÂ&öG2v†B–÷RG&—fRöæ6Rà¢Âöƒ#à¢Ç6Æ74æÖSÒ&×BÓRÆVF–ærÓrFW‡B×6ÆFRÓC#à¢F†—2—2F†RGW&&ÆR6öÖÖW&6R¶W’âFööÂDäÂv†VVÂÆ"Â÷vW"Â6öÖ×2æBFVÆVÖWG'’ÆÂGF6‚FòF†R6ÖRfV†–6ÆR&V6÷&Bà¢Â÷à¢ÂöF—cà¢Æf÷&Òöå7V&Ö—C×·6fUfV†–6ÆWÒ6Æ74æÖSÒ&w&–BvÓ2&÷&FW"&÷&FW"×v†—FRó&rÕ²3CeÒÓR6Ó¦w&–BÖ6öÇ2Ó"6Ó§Ór#à¢µ°¢²w–V"rÂu–V"rÂs““ruÒÀ¢²vÖ¶RrÂtÖ¶RrÂt6†Wg&öÆWBuÒÀ¢²vÖöFVÂrÂtÖöFVÂrÂu7V'W&&â³SuÒÀ¢²wG&–ÒrÂuG&–ÒrÂtÅ2uÒÀ¢²vVæv–æRrÂtVæv–æRrÂsRãtÂf÷'FV2Ã3uÒÀ¢²wG&ç6Ö—76–öârÂuG&ç6Ö—76–öârÂsDÆ3RuÒÀ¢²vG&—fWG&–ârÂtG&—fWG&–ârÂsGƒBuÒÀ¢²wF—&U6—¦RrÂuF—&R6—¦RrÂs#ƒRósU#buÒÀ¢²wv†VVÅ6—¦RrÂuv†VVÂ6—¦RrÂsgƒ‚uÒÀ¢ÒæÖ‚…¶¶W’ÂÆ&VÂÂÆ6V†öÆFW%Ò’Óâ€¢ÆÆ&VÂ¶W“×¶¶W—Ò6Æ74æÖSÒ&w&–BvÓ"#à¢Ç7â6Æ74æÖSÒ&föçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ãfVÕÒFW‡B×6ÆFRÓS#ç¶Æ&VÇÓÂ÷7ãà¢Æ–çW@¢fÇVS×·fV†–6ÆU¶¶W•×Ð¢öä6†ævS×²†R’Óâ6WDf–VÆB†¶W’ÂRçF&vWBçfÇVR—Ð¢Æ6V†öÆFW#×·Æ6V†öÆFW'Ð¢6Æ74æÖSÒ&&÷&FW"&÷&FW"×v†—FRó&rÖ&Æ6²‚ÓB’Ó2FW‡B×6Ò÷WFÆ–æRÖæöæRG&ç6—F–öâfö7W3¦&÷&FW"Õ²33vc%Òóc ¢óà¢ÂöÆ&VÃà¢’—Ð¢ÆÆ&VÂ6Æ74æÖSÒ&w&–BvÓ"6Ó¦6öÂ×7âÓ"#à¢Ç7â6Æ74æÖSÒ&föçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ãfVÕÒFW‡B×6ÆFRÓS#äÖöG2òW6R66SÂ÷7ãà¢ÇFW‡F&V¢fÇVS×·fV†–6ÆRæÖöG7Ð¢öä6†ævS×²†R’Óâ6WDf–VÆB‚vÖöG2rÂRçF&vWBçfÇVR—Ð¢&÷w3×³7Ð¢Æ6V†öÆFW#Ò&F–Ç’Â÷fW&ÆæBÂC2ÂF÷v–ærÂG&6²Â&ÆÇ’Â6f&’'V–ÆBâââ ¢6Æ74æÖSÒ&&÷&FW"&÷&FW"×v†—FRó&rÖ&Æ6²‚ÓB’Ó2FW‡B×6Ò÷WFÆ–æRÖæöæRG&ç6—F–öâfö7W3¦&÷&FW"Õ²33vc%Òóc ¢óà¢ÂöÆ&VÃà¢Æ'WGFöâ6Æ74æÖSÒ'6Ó¦6öÂ×7âÓ"–æÆ–æRÖfÆW‚—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"vÓ"&rÕ²33vc%Ò‚ÓR’ÓBföçBÖÖöæòFW‡BÕ³…ÒföçBÖ&Æ6²WW&66RG&6¶–ærÕ³ãvVÕÒFW‡BÖ&Æ6²G&ç6—F–öâ†÷fW#¦&rÕ²3vVVfeÒ#à¢6fRfV†–6ÆRFò&öG2Ä6†Wg&öå&–v‡B6—¦S×³WÒóà¢Âö'WGFöãà¢·fV†–6ÆU&W7VÇBbbÆF—b6Æ74æÖSÒ'6Ó¦6öÂ×7âÓ"&÷&FW"&÷&FW"Õ²33vc%Òó#&rÖ&Æ6²BFW‡B×‡2ÆVF–ærÓbFW‡B×6ÆFRÓ3#ç·fV†–6ÆU&W7VÇGÓÂöF—cçÐ¢Âöf÷&Óà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ6Æ74æÖSÒ&×‚ÖWFòÖ‚×rÓw†Â‚ÓR’Ób#à¢ÄÆ&VÃã"ò&WfVçVR7W&f6W3ÂôÆ&VÃà¢ÆF—b6Æ74æÖSÒ&×BÓRw&–BvÓBÖC¦w&–BÖ6öÇ2Ó"†Ã¦w&–BÖ6öÇ2Ó2#à¢´4ôÔÔU$4UôÔôETÄU2æÖ‚‡²¶W’ÂF—FÆRÂW–V'&÷rÂ–6öã¢–6öâÂ6÷’Â7FFRÒ’Óâ€¢Æ'WGFöà¢¶W“×¶¶W—Ð¢G—SÒ&'WGFöâ ¢öä6Æ–6³×²‚’ÓâFö7VÖVçBævWDVÆVÖVçD'”–B†¶W’“òç67&öÆÄ–çFõf–Wr‡²&V†f–÷#¢w6Öö÷F‚rÂ&Æö6³¢w7F'BrÒ—Ð¢6Æ74æÖSÒ&w&÷WÖ–âÖ‚Ós"&÷&FW"&÷&FW"×v†—FRó&rÕ²3CeÒbFW‡BÖÆVgBG&ç6—F–öâ†÷fW#¢×G&ç6ÆFR×’Ó†÷fW#¦&÷&FW"Õ²33vc%ÒóCR ¢à¢ÆF—b6Æ74æÖSÒ&fÆW‚§W7F–g’Ö&WGvVVâvÓB#ãÄ–6öâ6Æ74æÖSÒ'FW‡BÕ²33vc%Ò"óãÅ7FGW3ç·7FFWÓÂõ7FGW3ãÂöF—cà¢ÆF—b6Æ74æÖSÒ&×BÓföçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ã†VÕÒFW‡B×6ÆFRÓS#ç¶W–V'&÷wÓÂöF—cà¢ÆF—b6Æ74æÖSÒ&×BÓ"föçBÖF—7Æ’FW‡BÓ7†ÂföçBÖ&Æ6²WW&66R#ç·F—FÆWÓÂöF—cà¢Ç6Æ74æÖSÒ&×BÓBFW‡B×6ÒÆVF–ærÓbFW‡B×6ÆFRÓC#ç¶6÷—ÓÂ÷à¢Âö'WGFöãà¢’—Ð¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ–CÒ'FööÅöFæ"6Æ74æÖSÒ'67&öÆÂÖ×BÓ#B&÷&FW"×’&÷&FW"×v†—FRó&rÕ²3s“%Ò#à¢ÆF—b6Æ74æÖSÒ&×‚ÖWFòw&–BÖ‚×rÓw†ÂvÓ‚ÓR’ÓbÆs¦w&–BÖ6öÇ2Ó"#à¢ÆF—cà¢ÄÆ&VÃåFööÂDäÂôÆ&VÃà¢Æƒ"6Æ74æÖSÒ&×BÓBföçBÖF—7Æ’FW‡BÓW†ÂföçBÖ&Æ6²WW&66RÆVF–ærÕ³ã•Ò#ä6''’v†Bf—†W2–÷W"6"âæ÷F†–ærVÇ6RãÂöƒ#à¢Ç6Æ74æÖSÒ&×BÓRÆVF–ærÓrFW‡B×6ÆFRÓC#à¢F†R¶æ÷vÆVFvRÆ–W"7F÷&W2fW&–f–VBf7FVæW"(i"6ö6¶WB÷w&Væ6‚(i"F÷'VR(i"7V6–Â×FööÂ(i"f–ÇW&R(i"7&RÖ–æw2âvR&R'V–ÆF–ærF†RFF&6R6òF†R6Æ7VÆF÷"6âWfVçGVÆÇ’6’W†7FÇ’v†B&VÆöæw2–âF†RG'V6²æBv†BFVBvV–v‡B6öÖW2÷WBà¢Â÷à¢ÆF—b6Æ74æÖSÒ&×BÓb&÷&FW"&÷&FW"Õ²33vc%Òó#R&rÕ²33vc%Òõ³ãUÒÓBFW‡B×‡2ÆVF–ærÓbFW‡B×6ÆFRÓ3#à¢æòf¶R6ö6¶WB6—¦W2âF†R7W7FöÖW"&öf–ÆR6â&RvVæW&FVBæ÷s²W†7BÖæ–fW7G2VæÆö6²öæÇ’26÷W&6R×fW&–f–VBfV†–6ÆR6W'f–6Rf7G2&RÆöFVBà¢ÂöF—cà¢ÂöF—cà¢Æf÷&Òöå7V&Ö—C×¶'V–ÆD¶—GÒ6Æ74æÖSÒ&&÷&FW"&÷&FW"×v†—FRó&rÖ&Æ6²Ób#à¢ÆF—b6Æ74æÖSÒ&föçBÖF—7Æ’FW‡BÓ'†ÂföçBÖ&Æ6²WW&66R#å6VÆb×&VÆ–æ6RF–W#ÂöF—cà¢ÆF—b6Æ74æÖSÒ&×BÓRw&–BvÓ"#à¢´´•EõD”U%2æÖ‚…¶¶W’ÂÆ&VÂÂ6÷•Ò’Óâ€¢ÆÆ&VÂ¶W“×¶¶W—Ò6Æ74æÖS×¶fÆW‚7W'6÷"×ö–çFW"vÓ2&÷&FW"ÓBG&ç6—F–öâG¶¶—EF–W"ÓÓÒ¶W’òv&÷&FW"Õ²33vc%Òóc&rÕ²33vc%Òõ³ãuÒr¢v&÷&FW"×v†—FRówÖÓà¢Æ–çWBG—SÒ'&F–ò"6†V6¶VC×¶¶—EF–W"ÓÓÒ¶W—Òöä6†ævS×²‚’Óâ6WD¶—EF–W"†¶W’—Òóà¢Ç7ããÇ7â6Æ74æÖSÒ&&Æö6²FW‡B×6ÒföçBÖ&öÆB#ç¶Æ&VÇÓÂ÷7ããÇ7â6Æ74æÖSÒ&×BÓ&Æö6²FW‡B×‡2ÆVF–ærÓRFW‡B×6ÆFRÓS#ç¶6÷—ÓÂ÷7ããÂ÷7ãà¢ÂöÆ&VÃà¢’—Ð¢ÂöF—cà¢Æ'WGFöâ6Æ74æÖSÒ&×BÓRrÖgVÆÂ&r×v†—FR‚ÓR’ÓBföçBÖÖöæòFW‡BÕ³…ÒföçBÖ&öÆBWW&66RG&6¶–ærÕ³ãfVÕÒFW‡BÖ&Æ6²G&ç6—F–öâ†÷fW#¦&rÕ²3vVVfeÒ#à¢7&VFRFööÂDä'V–Æ@¢Âö'WGFöãà¢¶¶—E&W7VÇBbbÆF—b6Æ74æÖSÒ&×BÓB&÷&FW"&÷&FW"×v†—FRóÓBFW‡B×‡2ÆVF–ærÓbFW‡B×6ÆFRÓ3#ç¶¶—E&W7VÇGÓÂöF—cçÐ¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×²‚’Óâ÷WF&÷VæB‚w6æööârÂwfV†–6ÆU÷7V6–f–5÷FööÆ¶—BrÂ%DäU%ôÄ”äµ2ç6æööâÂwFööÅöFær—Ð¢6Æ74æÖSÒ&×BÓ2rÖgVÆÂ&÷&FW"&÷&FW"Õ²33vc%Òó#R‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ãVVÕÒFW‡B×6ÆFRÓC†÷fW#§FW‡BÕ²3vVVfeÒ ¢à¢6æÖöâ7W7FöÒÖ¶—GF–ær6&–Æ—G’(iv‡ ¢Âö'WGFöãà¢Âöf÷&Óà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ–CÒ'v†VVÅöÆ""6Æ74æÖSÒ'67&öÆÂÖ×BÓ#B×‚ÖWFòw&–BÖ‚×rÓw†ÂvÓ‚ÓR’ÓbÆs¦w&–BÖ6öÇ2Õ²ã†g%óã&g%Ò#à¢ÆF—cà¢ÄÆ&VÃåv†VVÂÆ#ÂôÆ&VÃà¢Æƒ"6Æ74æÖSÒ&×BÓBföçBÖF—7Æ’FW‡BÓW†ÂföçBÖ&Æ6²WW&66RÆVF–ærÕ³ã•Ò#åWÆöBF†R6"â'V–ÆBF†R7Fæ6Râ'W’F†R6WGWãÂöƒ#à¢Ç6Æ74æÖSÒ&×BÓRÆVF–ærÓrFW‡B×6ÆFRÓC#à¢F†R7W'&VçB—VÆ–æR6fW2fV†–6ÆRÂ6÷W&6R–ÖvRÖWFFFÂv†VVÂF—&V7F–öâÂ'FæW"æBGG&–'WF–öââF†R–ÖvR&VæFW&W"—G6VÆb—2FVÆ–&W&FVÇ’æ÷Bf¶VBà¢Â÷à¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×²‚’Óâ÷WF&÷VæB‚vf–gFVVãS"rÂwv†VVÅö6FÆörrÂ%DäU%ôÄ”äµ2æf–gFVVãS"Âwv†VVÅöÆ"r—Ð¢6Æ74æÖSÒ&×BÓb–æÆ–æRÖfÆW‚—FV×2Ö6VçFW"vÓ"&÷&FW"&÷&FW"Õ²33vc%ÒóC‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³…ÒWW&66RG&6¶–ærÕ³ãfVÕÒFW‡BÕ²3vVVfeÒ#à¢W‡Æ÷&Rf–gFVVãS"ÄW‡FW&æÄÆ–æ²6—¦S×³GÒóà¢Âö'WGFöãà¢ÂöF—cà¢ÅæVÂ6Æ74æÖSÒ'ÓR#à¢ÆÆ&VÂ6Æ74æÖSÒ&fÆW‚Ö–âÖ‚Ós"7W'6÷"×ö–çFW"—FV×2Ö6VçFW"§W7F–g’Ö6VçFW"÷fW&fÆ÷rÖ†–FFVâ&÷&FW"&÷&FW"ÖF6†VB&÷&FW"×v†—FRóR&rÖ&Æ6²#à¢¶–ÖvU&Wf–Wrò€¢Æ–Ör7&3×¶–ÖvU&Wf–WwÒÇCÒ%fV†–6ÆR&Wf–Wr"6Æ74æÖSÒ&Ö‚Ö‚Ó“brÖgVÆÂö&¦V7BÖ6öçF–â"óà¢’¢€¢ÆF—b6Æ74æÖSÒ'FW‡BÖ6VçFW"FW‡B×6ÆFRÓS#à¢ÅWÆöB6Æ74æÖSÒ&×‚ÖWFòÖ"Ó2FW‡BÕ²33vc%Ò"óà¢ÆF—b6Æ74æÖSÒ&föçBÖÖöæòFW‡BÕ³…ÒWW&66RG&6¶–ærÕ³ãfVÕÒ#åWÆöBfV†–6ÆR†÷FóÂöF—cà¢ÂöF—cà¢—Ð¢Æ–çWBG—SÒ&f–ÆR"66WCÒ&–ÖvRö§VrÆ–ÖvR÷ærÆ–ÖvR÷vV'"öä6†ævS×¶6†ö÷6T–ÖvWÒ6Æ74æÖSÒ&†–FFVâ"óà¢ÂöÆ&VÃà¢ÆF—b6Æ74æÖSÒ&×BÓ2w&–BvÓ26Ó¦w&–BÖ6öÇ2Õ³g%öWFõÒ#à¢Ç6VÆV7@¢fÇVS×·v†VVÄF—&V7F–öçÐ¢öä6†ævS×²†R’Óâ6WEv†VVÄF—&V7F–öâ†RçF&vWBçfÇVR—Ð¢6Æ74æÖSÒ&&÷&FW"&÷&FW"×v†—FRó&rÖ&Æ6²‚ÓB’Ó2FW‡B×6Ò#à¢Æ÷F–öâfÇVSÒ#S&öfg&öB#ãS"öfg&öCÂö÷F–öãà¢Æ÷F–öâfÇVSÒ'&ÆÇ•÷7÷'B#å&ÆÇ’7÷'CÂö÷F–öãà¢Æ÷F–öâfÇVSÒ'7WW%÷F÷W&–ær#å7WW"F÷W&–æsÂö÷F–öãà¢Æ÷F–öâfÇVSÒ&÷WFÆr#ãS"÷WFÆsÂö÷F–öãà¢Â÷6VÆV7Cà¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×¶7&VFUv†VVÄ'&–VgÐ¢6Æ74æÖSÒ&&rÕ²33vc%Ò‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³…ÒföçBÖ&Æ6²WW&66RG&6¶–ærÕ³ãFVÕÒFW‡BÖ&Æ6²G&ç6—F–öâ†÷fW#¦&rÕ²3vVVfeÒ ¢à¢7&VFR&VÂ'V–ÆB'&–V`¢Âö'WGFöãà¢ÂöF—cà¢·v†VVÅ&W7VÇBbbÆF—b6Æ74æÖSÒ&×BÓB&÷&FW"&÷&FW"×v†—FRóÓBFW‡B×‡2ÆVF–ærÓbFW‡B×6ÆFRÓ3#ç·v†VVÅ&W7VÇGÓÂöF—cçÐ¢ÂõæVÃà¢Â÷6V7F–öãà ¢Ç6V7F–öâ6Æ74æÖSÒ&&÷&FW"×’&÷&FW"×v†—FRó&rÕ²3s“%Ò#à¢ÆF—b6Æ74æÖSÒ&×‚ÖWFòw&–BÖ‚×rÓw†ÂvÓB‚ÓR’ÓbÖC¦w&–BÖ6öÇ2Ó"#à¢ÅæVÂ–CÒ'÷vW%ö6öÖÖæB"6Æ74æÖSÒ'67&öÆÂÖ×BÓ#BÓr#à¢Ä&GFW'”6†&v–ær6Æ74æÖSÒ'FW‡BÕ²33vc%Ò"óà¢ÆF—b6Æ74æÖSÒ&×BÓrföçBÖF—7Æ’FW‡BÓ7†ÂföçBÖ&Æ6²WW&66R#å÷vW"6öÖÖæCÂöF—cà¢Ç6Æ74æÖSÒ&×BÓBÆVF–ærÓrFW‡B×6ÆFRÓC#à¢6öÆ"ÂÇFW&æF÷"ôD2ÔD2Â&GFW'’&æ²Â–çfW'FW"Â&Vg&–vW&F–öâÂ6×ÆöG2ÂÆ–v‡F–æræBgW6VBF—7G&–'WF–öâ&V6öÖRfV†–6ÆR×7V6–f–2wV–FRæBff–Æ–FR×&VG’$ôÒà¢Â÷à¢Æ'WGFöâG—SÒ&'WGFöâ"öä6Æ–6³×²‚’Óâ6fTwV–FR‚w÷vW"r—Ò6Æ74æÖSÒ&×BÓb&÷&FW"&÷&FW"Õ²33vc%Òó#R‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³…ÒWW&66RG&6¶–ærÕ³ãVVÕÒ#à¢6fR÷vW"'V–Æ@¢Âö'WGFöãà¢·÷vW%&W7VÇBbbÆF—b6Æ74æÖSÒ&×BÓBFW‡B×‡2FW‡B×6ÆFRÓC#ç·÷vW%&W7VÇGÓÂöF—cçÐ¢ÂõæVÃà¢ÅæVÂ–CÒ&6öÖ×5ö6öÖÖæB"6Æ74æÖSÒ'67&öÆÂÖ×BÓ#BÓr#à¢Å&F–ò6Æ74æÖSÒ'FW‡BÕ²33vc%Ò"óà¢ÆF—b6Æ74æÖSÒ&×BÓrföçBÖF—7Æ’FW‡BÓ7†ÂföçBÖ&Æ6²WW&66R#ä6öÖ×26öÖÖæCÂöF—cà¢Ç6Æ74æÖSÒ&×BÓBÆVF–ærÓrFW‡B×6ÆFRÓC#à¢6FVÆÆ—FRÂ&F–òÂçFVææ2Âæf–vF–öâÂVÖW&vVæ7’6–væÆ–æræB÷vW"&VGVæFæ7’GW&â–çFòâ–ç7FÆÆ&ÆR6öÖ×Væ–6F–öç2&6†—FV7GW&Rà¢Â÷à¢Æ'WGFöâG—SÒ&'WGFöâ"öä6Æ–6³×²‚’Óâ6fTwV–FR‚v6öÖ×2r—Ò6Æ74æÖSÒ&×BÓb&÷&FW"&÷&FW"Õ²33vc%Òó#R‚ÓR’Ó2föçBÖÖöæòFW‡BÕ³…ÒWW&66RG&6¶–ærÕ³ãVVÕÒ#à¢6fR6öÖ×2'V–Æ@¢Âö'WGFöãà¢¶6öÖ×5&W7VÇBbbÆF—b6Æ74æÖSÒ&×BÓBFW‡B×‡2FW‡B×6ÆFRÓC#ç¶6öÖ×5&W7VÇGÓÂöF—cçÐ¢ÂõæVÃà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ–CÒ'GVæW%öÆ""6Æ74æÖSÒ'67&öÆÂÖ×BÓ#B×‚ÖWFòÖ‚×rÓw†Â‚ÓR’Ób#à¢ÆF—b6Æ74æÖSÒ&w&–BvÓ‚Æs¦w&–BÖ6öÇ2Õ³g%òã†g%Ò#à¢ÆF—cà¢ÄÆ&VÃåGVæW"Æ#ÂôÆ&VÃà¢Æƒ"6Æ74æÖSÒ&×BÓBföçBÖF—7Æ’FW‡BÓW†ÂföçBÖ&Æ6²WW&66RÆVF–ærÕ³ã•Ò#äv—fRF†RfV†–6ÆRÖVÖ÷'’ãÂöƒ#à¢Ç6Æ74æÖSÒ&×BÓRÖ‚×rÓ7†ÂÆVF–ærÓrFW‡B×6ÆFRÓC#à¢FVÆVÖWG'’6æ6†÷G2ÂED72ÂVæv–æR†÷W'2ÂG–æò'Vç2ÂGVæR&Wf—6–öç2æBÖ–çFVææ6RWfVçG2†fRFVF–6FVB&6¶VæB&V6÷&G2âFWf–6Rôô$B–ævW7F–öâ—2F†RæW‡B6öææV7F÷"Æ–W"à¢Â÷à¢ÂöF—cà¢ÆF—b6Æ74æÖSÒ&w&–Bw&–BÖ6öÇ2Ó"vÓ"#çµ²tô$Bò4ârÂtVæv–æR†÷W'2rÂtED2†—7F÷'’rÂtG–æòVÆÇ2rÂuGVæRfW'6–öç2rÂtÖ–çFVææ6RuÒæÖ‚†—FVÒ’ÓâÆF—b¶W“×¶—FV×Ò6Æ74æÖSÒ&&÷&FW"&÷&FW"×v†—FRó&rÕ²3CeÒBföçBÖÖöæòFW‡BÕ³—…ÒWW&66RG&6¶–ærÕ³ãFVÕÒFW‡B×6ÆFRÓ3#ç¶—FV×ÓÂöF—câ—ÓÂöF—cà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ–CÒ'&öG5÷7WÇ’"6Æ74æÖSÒ'67&öÆÂÖ‚Ó#B&÷&FW"×’&÷&FW"×v†—FRó&rÖ&Æ6²#à¢ÆF—b6Æ74æÖSÒ&×‚ÖWFòw&–BÖ‚×rÓw†Â—FV×2Ö6VçFW"vÓ‚‚ÓR’Ó"ÖC¦w&–BÖ6öÇ2Õ³g%öWFõÒ#à¢ÆF—cà¢ÆF—b6Æ74æÖSÒ&föçBÖF—7Æ’FW‡BÓ7†ÂföçBÖ&Æ6²WW&66R#å&öG27F—2F†R7VÇGW&RâÖ—6f—B'Vç2F†RÖ6†–æRãÂöF—cà¢Ç6Æ74æÖSÒ&×BÓ"Ö‚×rÓ7†ÂFW‡B×6ÒÆVF–ærÓbFW‡B×6ÆFRÓS#à¢7&VF÷"ò"ò6×–vâ(i"v&vR(i"&öGV7B(i"'FæW"(i"6Æ–6²(i"÷&FW"(i"gVÆf–ÆÆÖVçB(i"&WfVçVR(i"6öÖÖ—76–öâG'WF‚à¢Â÷à¢ÂöF—cà¢Æ'WGFöà¢G—SÒ&'WGFöâ ¢öä6Æ–6³×²‚’Óâ÷WF&÷VæB‚w&öG5ö6öÆÆV7F—fRrÂw&öG5öÖW&6‚rÂ%DäU%ôÄ”äµ2ç&öG5ö6öÆÆV7F—fRÂw&öG5÷7WÇ’r—Ð¢6Æ74æÖSÒ&&÷&FW"&÷&FW"Õ²33vc%ÒóC&rÕ²33vc%Òõ³ã…Ò‚Ób’ÓBföçBÖÖöæòFW‡BÕ³…ÒföçBÖ&Æ6²WW&66RG&6¶–ærÕ³ãfVÕÒFW‡BÕ²3vVVfeÒ ¢à¢6†÷&öG2(ip¢Âö'WGFöãà¢ÂöF—cà¢Â÷6V7F–öãà ¢Ç6V7F–öâ6Æ74æÖSÒ&×‚ÖWFòÖ‚×rÓw†Â‚ÓR’Ób#à¢ÆF—b6Æ74æÖSÒ'&VÆF—fR÷fW&fÆ÷rÖ†–FFVâ&÷&FW"&÷&FW"Õ²33vc%Òó3&rÕ²3sEÒÓr6Ó§Ó#à¢ÆF—b6Æ74æÖSÒ&'6öÇWFR×&–v‡BÓ"×F÷Ó#‚ÓcBrÓcB&÷VæFVBÖgVÆÂ&rÕ²33vc%Òó&ÇW"Ó7†Â"óà¢ÆF—b6Æ74æÖSÒ'&VÆF—fRfÆW‚fÆW‚×w&—FV×2×7F'B§W7F–g’Ö&WGvVVâvÓ‚#à¢ÆF—b6Æ74æÖSÒ&Ö‚×rÓ7†Â#à¢ÄÆ&VÃäÖ—6f—B&WfVçVR7–æSÂôÆ&VÃà¢Æƒ"6Æ74æÖSÒ&×BÓBföçBÖF—7Æ’FW‡BÓG†ÂföçBÖ&Æ6²WW&66R#äÖV7W&RWfW'—F†–ærâ–çfVçBæ÷F†–ærãÂöƒ#à¢Ç6Æ74æÖSÒ&×BÓBÆVF–ærÓrFW‡B×6ÆFRÓ3#à¢f—'7BöÆ7Böf–æÂF÷V6‚Â7&VF÷"÷&VfW'&Âõ"Fö¶Vç2Â–ÖvRÂÖöGVÆRÂ'FæW"ÂöffW"Â4µRÂ6Æ–6²æB÷&FW"&W6öÇfR–çFòF†R&öG2ÆVFvW"â&WfVçVR÷÷'GVæ—G’7F—2Væ6öçG&7FVBVçF–Â&VÂw&VVÖVçBÖ¶W2—BV&æVBà¢Â÷à¢ÂöF—cà¢Ä&FvTFöÆÆ%6–vâ6—¦S×³SGÒ6Æ74æÖSÒ'FW‡BÕ²33vc%Ò"óà¢ÂöF—cà¢ÂöF—cà¢Â÷6V7F–öãà¢ÂöÖ–ãà¢ÂöF—cà¢“°§Ð