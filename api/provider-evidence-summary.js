const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cibcxqrqiqvzpardbdrw.supabase.co';

async function callSummary(functionName) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('service_key_unavailable');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: '{}',
  });
  if (!response.ok) throw new Error(`summary_rpc_${response.status}`);
  return response.json();
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ ok: false, error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  try {
    const kind = String(req.query?.kind || req.body?.kind || 'all').toLowerCase();
    if (kind === 'probe') return res.status(200).json(await callSummary('provider_probe_evidence_summary'));
    if (kind === 'outcome') return res.status(200).json(await callSummary('provider_outcome_evidence_summary'));
    if (kind !== 'all') return res.status(400).json({ ok: false, error: 'kind must be probe, outcome, or all' });
    const [probe, outcome] = await Promise.all([
      callSummary('provider_probe_evidence_summary'),
      callSummary('provider_outcome_evidence_summary'),
    ]);
    return res.status(200).json({
      schema: 'misfit.provider-evidence-public.v1',
      generated_at: new Date().toISOString(),
      probe,
      outcome,
      boundary: 'Public-safe aggregate evidence only. No credentials, customer identifiers, request bodies, private GHOSBC material, wallet actions, or consequential execution.',
    });
  } catch (error) {
    console.error(JSON.stringify({ type: 'provider_evidence_summary_error', message: String(error?.message || error) }));
    return res.status(503).json({ ok: false, error: 'provider evidence temporarily unavailable' });
  }
}
