const BASE = 'https://api.godaddy.com/v3/domains/zones';
const ZONE = 'misfitmediahouse.com';
const TARGETS = {
  apex: { type: 'A', name: '@', oldData: '216.24.57.1', newData: '76.76.21.21' },
  www: { type: 'CNAME', name: 'www', oldData: 'base44.onrender.com.', newData: 'cname.vercel-dns-0.com.' },
};

function headers(write = false) {
  const token = process.env.GODADDY_PAT;
  if (!token) throw new Error('GODADDY_PAT missing');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...(write ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function parse(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

async function readRecord(def) {
  const url = new URL(`${BASE}/${ZONE}/dns-records`);
  url.searchParams.set('type', def.type);
  url.searchParams.set('name', def.name);
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('totalRequired', 'true');
  const res = await fetch(url, { headers: headers(false) });
  const data = await parse(res);
  if (!res.ok) throw new Error(`Read ${def.type} ${def.name} failed (${res.status})`);
  const items = data?.items || [];
  if (items.length !== 1) throw new Error(`Expected exactly one ${def.type} ${def.name} record, found ${items.length}`);
  return items[0];
}

async function deleteRecord(recordId) {
  const res = await fetch(`${BASE}/${ZONE}/dns-records/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
    headers: headers(false),
  });
  const data = await parse(res);
  if (!res.ok) throw new Error(`Delete failed (${res.status}): ${JSON.stringify(data)}`);
}

async function createRecord(type, name, data, ttl) {
  const res = await fetch(`${BASE}/${ZONE}/dns-records`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ type, name, data, ttl }),
  });
  const body = await parse(res);
  if (!res.ok) throw new Error(`Create ${type} ${name} failed (${res.status}): ${JSON.stringify(body)}`);
  return body;
}

async function replaceRecord(snapshot, def) {
  await deleteRecord(snapshot.recordId);
  try {
    const created = await createRecord(def.type, def.name, def.newData, 600);
    return { changed: true, before: snapshot, after: created };
  } catch (error) {
    try { await createRecord(def.type, def.name, snapshot.data, snapshot.ttl || 3600); }
    catch (rollbackError) { error.message += `; rollback also failed: ${rollbackError.message}`; }
    throw error;
  }
}

async function rollbackChange(change) {
  if (!change?.changed) return;
  if (change.after?.recordId) {
    try { await deleteRecord(change.after.recordId); } catch {}
  }
  await createRecord(change.before.type, change.before.name, change.before.data, change.before.ttl || 3600);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).json({ ok: false });

  let apexChange = null;
  try {
    const [apex, www] = await Promise.all([readRecord(TARGETS.apex), readRecord(TARGETS.www)]);

    const apexAlready = apex.data === TARGETS.apex.newData;
    const wwwAlready = www.data === TARGETS.www.newData;
    const apexExpected = apex.data === TARGETS.apex.oldData || apexAlready;
    const wwwExpected = www.data === TARGETS.www.oldData || wwwAlready;

    if (!apexExpected || !wwwExpected) {
      return res.status(409).json({ ok: false, error: 'DNS state changed unexpectedly; no writes performed.', apex, www });
    }

    if (!apexAlready) apexChange = await replaceRecord(apex, TARGETS.apex);

    let wwwChange = null;
    try {
      if (!wwwAlready) wwwChange = await replaceRecord(www, TARGETS.www);
    } catch (error) {
      if (apexChange) await rollbackChange(apexChange);
      throw error;
    }

    const [apexAfter, wwwAfter] = await Promise.all([readRecord(TARGETS.apex), readRecord(TARGETS.www)]);
    const ok = apexAfter.data === TARGETS.apex.newData && wwwAfter.data === TARGETS.www.newData;
    return res.status(ok ? 200 : 502).json({
      ok,
      zone: ZONE,
      changed: { apex: !!apexChange, www: !!wwwChange },
      before: { apex, www },
      after: { apex: apexAfter, www: wwwAfter },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
