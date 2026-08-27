const DEFAULT_WEIGHTS = {
  capability_fit: 0.30,
  verified_quality: 0.20,
  cost_efficiency: 0.15,
  reliability: 0.10,
  latency: 0.10,
  safety_governance: 0.10,
  reputation: 0.05,
};

function clamp(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function normalizeCandidate(candidate = {}) {
  return {
    name: String(candidate.name || 'unnamed-provider').slice(0, 120),
    protocols: Array.isArray(candidate.protocols) ? candidate.protocols.map(String) : [],
    capabilities: Array.isArray(candidate.capabilities) ? candidate.capabilities.map(String) : [],
    available: candidate.available !== false,
    policy_fit: candidate.policy_fit !== false,
    human_gate_compatible: candidate.human_gate_compatible !== false,
    price: Number.isFinite(Number(candidate.price)) ? Number(candidate.price) : null,
    scores: {
      capability_fit: clamp(candidate.scores?.capability_fit),
      verified_quality: clamp(candidate.scores?.verified_quality),
      cost_efficiency: clamp(candidate.scores?.cost_efficiency),
      reliability: clamp(candidate.scores?.reliability),
      latency: clamp(candidate.scores?.latency),
      safety_governance: clamp(candidate.scores?.safety_governance),
      reputation: clamp(candidate.scores?.reputation),
    },
    evidence: Array.isArray(candidate.evidence) ? candidate.evidence.map(String).slice(0, 20) : [],
  };
}

function constraintFailures(candidate, objective = {}) {
  const failures = [];
  const requiredProtocol = objective.required_protocol ? String(objective.required_protocol).toLowerCase() : null;
  const requiredCapability = objective.required_capability ? String(objective.required_capability).toLowerCase() : null;
  const ceiling = Number.isFinite(Number(objective.price_ceiling)) ? Number(objective.price_ceiling) : null;

  if (!candidate.available) failures.push('unavailable');
  if (!candidate.policy_fit) failures.push('policy_or_safety_mismatch');
  if (objective.requires_human_gate_compatibility && !candidate.human_gate_compatible) failures.push('human_gate_incompatible');
  if (requiredProtocol && !candidate.protocols.some((p) => p.toLowerCase() === requiredProtocol)) failures.push(`missing_protocol:${requiredProtocol}`);
  if (requiredCapability && !candidate.capabilities.some((c) => c.toLowerCase().includes(requiredCapability))) failures.push(`missing_capability:${requiredCapability}`);
  if (ceiling !== null && candidate.price !== null && candidate.price > ceiling) failures.push('price_ceiling_exceeded');
  return failures;
}

function weightedScore(candidate, weights) {
  return Object.entries(weights).reduce((sum, [key, weight]) => sum + clamp(candidate.scores[key]) * Number(weight || 0), 0);
}

function confidence(candidate, score) {
  const evidenceCount = candidate.evidence.length;
  const evidenceFactor = Math.min(1, evidenceCount / 4);
  return Math.round(Math.max(20, Math.min(99, score * 0.65 + evidenceFactor * 35)));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const objective = body.objective || {};
    const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, 25).map(normalizeCandidate) : [];
    if (!candidates.length) return res.status(400).json({ error: 'At least one candidate is required.' });

    const suppliedWeights = body.weights && typeof body.weights === 'object' ? body.weights : {};
    const weights = { ...DEFAULT_WEIGHTS, ...suppliedWeights };
    const weightTotal = Object.values(weights).reduce((a, b) => a + Number(b || 0), 0) || 1;
    Object.keys(weights).forEach((k) => { weights[k] = Number(weights[k] || 0) / weightTotal; });

    const ranked = candidates.map((candidate) => {
      const failures = constraintFailures(candidate, objective);
      const eligible = failures.length === 0;
      const score = eligible ? Math.round(weightedScore(candidate, weights) * 100) / 100 : 0;
      const evidenceGaps = [];
      if (candidate.evidence.length === 0) evidenceGaps.push('no_evidence_supplied');
      if (candidate.scores.verified_quality < 50) evidenceGaps.push('weak_verified_quality');
      if (candidate.scores.reliability < 50) evidenceGaps.push('weak_reliability_evidence');
      return {
        name: candidate.name,
        eligible,
        hard_constraint_failures: failures,
        score,
        confidence: eligible ? confidence(candidate, score) : 0,
        score_breakdown: candidate.scores,
        evidence: candidate.evidence,
        evidence_gaps: evidenceGaps,
        price: candidate.price,
        protocols: candidate.protocols,
        capabilities: candidate.capabilities,
      };
    }).sort((a, b) => (Number(b.eligible) - Number(a.eligible)) || (b.score - a.score));

    const winner = ranked.find((c) => c.eligible) || null;
    return res.status(200).json({
      schema: 'misfit.provider-router.v1',
      objective,
      routing_mode: 'recommendation_only',
      execution_enabled: false,
      weights,
      recommended_provider: winner?.name || null,
      recommended_score: winner?.score || null,
      confidence: winner?.confidence || 0,
      ranked_candidates: ranked,
      boundary: 'This endpoint ranks providers only. It cannot execute payments, messages, wallet actions, account changes, or other consequential external actions.',
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request', detail: String(error?.message || error) });
  }
}
