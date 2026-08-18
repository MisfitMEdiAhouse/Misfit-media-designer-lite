const token = process.env.VERCEL_OIDC_TOKEN;
const project = 'prj_nQVmclxNH0gBRnYt23XFQSofnuQI';
const team = 'team_7ZHStyjjCpAKFogk5jXp9gZo';
const domain = 'vtest.coffeeandajoint.co';
if (!token) {
  console.log('DOMAIN_PROBE OIDC_MISSING');
  process.exit(0);
}
try {
  const r = await fetch(`https://api.vercel.com/v10/projects/${project}/domains?teamId=${team}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: domain })
  });
  const text = await r.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch {}
  const message = body?.error?.message || body?.message || null;
  console.log('DOMAIN_PROBE', JSON.stringify({ status: r.status, ok: r.ok, name: body?.name || domain, verified: body?.verified ?? null, code: body?.error?.code || null, message }));
} catch (e) {
  console.log('DOMAIN_PROBE', JSON.stringify({ status: 0, ok: false, message: String(e?.message || e) }));
}
