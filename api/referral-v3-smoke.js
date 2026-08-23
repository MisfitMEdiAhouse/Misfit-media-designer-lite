export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false });
  const api = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/client-referral';
  const label = `Smoke-${Date.now()}`;
  const out = {};
  try {
    const misfitRes = await fetch(`${api}/profile?site=golden-essence`, { cache:'no-store' });
    out.misfit = await misfitRes.json(); out.misfit_http = misfitRes.status;
    const customerRes = await fetch(`${api}/customer-profile?site=golden-essence`, { cache:'no-store' });
    out.customer = await customerRes.json(); out.customer_http = customerRes.status;
    const codeRes = await fetch(`${api}/customer-code`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ site_key:'golden-essence', referrer_label:label }) });
    out.code = await codeRes.json(); out.code_http = codeRes.status;
    const qrRes = await fetch(`${api}/customer-qr?site=golden-essence&code=${encodeURIComponent(out.code.referrer_code || '')}`, { cache:'no-store' });
    const qr = await qrRes.text(); out.qr_http = qrRes.status; out.qr_svg = qr.includes('<svg');
    const session = `smoke-${Date.now()}`;
    const trackRes = await fetch(`${api}/customer-track`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ site_key:'golden-essence', referrer_code:out.code.referrer_code, event_type:'landing', action:'visit', session_id:session, landing_path:'/portfolio/golden-essence?client_ref='+out.code.referrer_code }) });
    out.track = await trackRes.json(); out.track_http = trackRes.status;
    const leadRes = await fetch(`${api}/customer-track`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ site_key:'golden-essence', referrer_code:out.code.referrer_code, event_type:'lead_action', action:'phone', session_id:session, landing_path:'/portfolio/golden-essence?client_ref='+out.code.referrer_code }) });
    out.lead = await leadRes.json(); out.lead_http = leadRes.status;
    const statsRes = await fetch(`${api}/customer-stats?site=golden-essence`, { cache:'no-store' });
    const stats = await statsRes.json(); out.stats_http = statsRes.status; out.smoke_stats = (stats.referrals || []).find(x => x.referrer_code === out.code.referrer_code) || null;
    out.ok = misfitRes.ok && customerRes.ok && codeRes.ok && qrRes.ok && out.qr_svg && trackRes.ok && leadRes.ok && statsRes.ok && out.misfit.commission_bps === 1000 && out.misfit.commission_cap_cents === 250000 && out.smoke_stats?.visits === 1 && out.smoke_stats?.leads === 1;
    return res.status(200).json(out);
  } catch (error) {
    return res.status(500).json({ ok:false, error:error instanceof Error ? error.message : String(error), ...out });
  }
}
