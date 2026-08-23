export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false });
  const api = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/client-referral';
  const session = `smoke-${Date.now()}`;
  try {
    const profileRes = await fetch(`${api}/profile?site=golden-essence`, { cache:'no-store' });
    const profile = await profileRes.json().catch(() => ({}));
    const qrRes = await fetch(`${api}/qr?site=golden-essence`, { cache:'no-store' });
    const qr = await qrRes.text();
    const trackRes = await fetch(`${api}/track`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ referral_code:'golden-essence', event_type:'landing', session_id:session, landing_path:'/agency?ref=golden-essence', source:'production_smoke' }) });
    const track = await trackRes.json().catch(() => ({}));
    const webhookRes = await fetch(`${api}/webhook`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ id:'evt_fake', type:'checkout.session.completed', data:{object:{}} }) });
    const webhook = await webhookRes.json().catch(() => ({}));
    return res.status(200).json({
      ok: profileRes.ok && qrRes.ok && trackRes.ok && webhookRes.status === 400,
      profile:{ http:profileRes.status, display_name:profile.display_name || null, referral_code:profile.referral_code || null, share_url:profile.share_url || null },
      qr:{ http:qrRes.status, svg:qr.includes('<svg'), size:qr.length },
      track:{ http:trackRes.status, ok:track.ok === true, session },
      webhook_security:{ http:webhookRes.status, error:webhook.error || null }
    });
  } catch (error) {
    return res.status(500).json({ ok:false, error:error instanceof Error ? error.message : String(error) });
  }
}
