import { useState } from 'react';

const initial = {
  requested_action: 'Send a customer refund of $850 after an AI support agent detects a duplicate charge.',
  data_sensitivity: 'medium',
  financial_impact: 850,
  reversibility: 'hard',
  external_side_effects: true,
  human_approval: false,
};

const panel = {
  border: '1px solid rgba(103,232,249,.22)',
  background: 'linear-gradient(180deg, rgba(7,18,25,.94), rgba(5,8,13,.98))',
  borderRadius: 24,
  padding: 24,
};

export default function AgenticGovernedFleet() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function run() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/agentic-governance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
      setResult(data);
    } catch (err) { setError(String(err.message || err)); } finally { setLoading(false); }
  }

  return <main style={{ minHeight:'100vh', background:'#020408', color:'#f7fafc', padding:'clamp(24px,5vw,64px) 20px 80px', fontFamily:'Inter, system-ui, sans-serif' }}>
    <div style={{ width:'min(1120px,100%)', margin:'0 auto' }}>
      <div style={{ color:'#67e8f9', letterSpacing:'.2em', fontSize:12, marginBottom:16 }}>ALL THINGS AGENTIC · CLEAN-ROOM BUILD</div>
      <h1 style={{ fontSize:'clamp(44px,8vw,86px)', lineHeight:.92, margin:0, maxWidth:980 }}>Govern the fleet before the fleet acts.</h1>
      <p style={{ color:'#9fb0bf', fontSize:19, lineHeight:1.65, maxWidth:820, margin:'26px 0 38px' }}>A public-safe multi-agent governance layer for consequential AI actions. Intent is parsed, risk is scored, policy is applied, Gemini can explain the decision, and an audit artifact is returned before any external action is eligible to execute.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18 }}>
        <section style={panel}>
          <div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>ACTION UNDER REVIEW</div>
          <textarea value={form.requested_action} onChange={(e)=>set('requested_action',e.target.value)} style={{ width:'100%', minHeight:128, marginTop:12, borderRadius:14, border:'1px solid #263440', background:'#05080d', color:'#fff', padding:14, fontSize:16, boxSizing:'border-box' }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
            <label style={{ color:'#9fb0bf' }}>Data sensitivity<select value={form.data_sensitivity} onChange={(e)=>set('data_sensitivity',e.target.value)} style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440' }}><option>low</option><option>medium</option><option>high</option></select></label>
            <label style={{ color:'#9fb0bf' }}>Reversibility<select value={form.reversibility} onChange={(e)=>set('reversibility',e.target.value)} style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440' }}><option value="reversible">reversible</option><option value="hard">hard</option><option value="irreversible">irreversible</option></select></label>
          </div>
          <label style={{ display:'block', color:'#9fb0bf', marginTop:14 }}>Financial impact (USD)<input type="number" value={form.financial_impact} onChange={(e)=>set('financial_impact',Number(e.target.value))} style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440', boxSizing:'border-box' }} /></label>
          <label style={{ display:'flex', gap:10, marginTop:16, color:'#c6d2dc' }}><input type="checkbox" checked={form.external_side_effects} onChange={(e)=>set('external_side_effects',e.target.checked)} /> External side effects</label>
          <label style={{ display:'flex', gap:10, marginTop:10, color:'#c6d2dc' }}><input type="checkbox" checked={form.human_approval} onChange={(e)=>set('human_approval',e.target.checked)} /> Human approval already present</label>
          <button onClick={run} disabled={loading} style={{ width:'100%', marginTop:22, border:0, borderRadius:14, padding:15, background:'#67e8f9', color:'#031019', fontWeight:900, fontSize:16 }}>{loading?'EVALUATING…':'RUN GOVERNANCE'}</button>
          {error && <div style={{ color:'#fb7185', marginTop:12 }}>{error}</div>}
        </section>
        <section style={panel}>
          <div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>FLEET DECISION</div>
          {!result ? <p style={{ color:'#718191', lineHeight:1.6 }}>Run an action through the fleet. No payment, message, transfer, credential change, or external action is executed by this demo.</p> : <><div style={{ display:'flex', alignItems:'end', justifyContent:'space-between', gap:12, marginTop:20 }}><strong style={{ fontSize:46, textTransform:'uppercase' }}>{result.decision}</strong><div style={{ color:'#9fb0bf' }}>Risk <strong style={{ color:'#fff', fontSize:26 }}>{result.risk_score}</strong>/100</div></div><div style={{ marginTop:18, display:'grid', gap:10 }}>{result.agents?.map((agent)=><div key={agent.name} style={{ border:'1px solid #1d2a34', borderRadius:14, padding:14, background:'#04070b' }}><div style={{ display:'flex', justifyContent:'space-between', gap:12 }}><strong>{agent.name}</strong><span style={{ color:'#67e8f9' }}>{agent.status}</span></div><pre style={{ whiteSpace:'pre-wrap', wordBreak:'break-word', color:'#94a3b8', fontSize:12, marginBottom:0 }}>{JSON.stringify(agent.output,null,2)}</pre></div>)}</div><div style={{ color:'#718191', marginTop:14, fontSize:12 }}>Audit ID: {result.audit_id}</div></>}
        </section>
      </div>
      <section style={{ ...panel, marginTop:18 }}><div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>CLAIM BOUNDARY</div><p style={{ color:'#a9b8c5', lineHeight:1.7, marginBottom:0 }}>This competition build is a new clean-room project. It demonstrates a bounded governance pattern and does not publish Mother Language, Soul Cipher, GHX/glyph mappings, hidden policy tables, private prompts, credentials, or private GHOSBC reconstruction material.</p></section>
    </div>
  </main>;
}
