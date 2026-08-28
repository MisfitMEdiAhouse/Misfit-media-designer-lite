const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cibcxqrqiqvzpardbdrw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_X-bcgz-3xMIgNZ4rYmAjZA_QNUb69hU';

async function readSnapshot(kind) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/provider_evidence_public_snapshots?kind=eq.${encodeURIComponent(kind)}&select=payload,updated_at&limit=1`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error(`snapshot_${kind}_${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows) || !rows[0]?.payload) throw new Error(`snapshot_${kind}_missing`);
  return { ...rows[0].payload, snapshot_updated_at: rows[0].updated_at };
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ ok: false, error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  try {
    const kind = String(req.query?.kind || req.body?.kind || 'all').toLowerCase();
    if (kind === 'probe') return res.status(200).json(await readSnapshot('probe'));
    if (kind === 'outcome') return res.status(200).json(await readSnapshot('outcome'));
    if (kind !== 'all') return res.status(400).json({ ok: false, error: 'kind must be probe, outcome, or all' });
    const [probe, outcome] = await Promise.all([readSnapshot('probe'), readSnapshot('outcome')]);
    return res.status(200).json({
      schema: 'misfit.provider-evidence-public.v1',
      generated_at: new Date().toISOString(),
      probe,
      outcome,
      boundary: 'Public-safe aggregate snapshots only. Underlying evidence tables and SECURITY DEFINER aggregation RPCs are not callable by anonymous or ordinary authenticated clients. No credentials, customer identifiers, request bodies, private GHOSBC material, wallet actions, or consequential execution.',
    });
  } catch (error) {
    console.error(JSON.stringify({ type: 'provider_evidence_summary_error', message: String(error?.message || error) }));
    return res.status(503).json({ ok: false, error: 'provider evidence temporarily unavailable' });
  }
}
