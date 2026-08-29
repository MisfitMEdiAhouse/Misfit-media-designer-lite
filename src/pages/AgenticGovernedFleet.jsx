import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const evaluationUrl = 'https://buy.stripe.com/9B6dR90saamGc0Oa3u8ww0J';
const integrationUrl = 'https://buy.stripe.com/5kQ28r2AigL42qeb7y8ww0K';
const A2A_ENDPOINT = 'https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-a2a/message:send';

const presets = {
  allow: { label:'Bounded read', action:'read_status', target:'public_service_health', allowed_actions:'read_status', allowed_targets:'public_service_health' },
  review: { label:'External message', action:'send_message', target:'external_slack', allowed_actions:'', allowed_targets:'external_slack' },
  block: { label:'Out-of-mandate delete', action:'delete_record', target:'production_customer', allowed_actions:'read_record', allowed_targets:'staging_customer' },
};

const panel = {
  minWidth: 0,
  border: '1px solid rgba(103,232,249,.22)',
  background: 'linear-gradient(180deg, rgba(7,18,25,.94), rgba(5,8,13,.98))',
  borderRadius: 24,
  padding: 24,
};
const split = (value) => String(value || '').split(',').map((x) => x.trim()).filter(Boolean);

export default function AgenticGovernedFleet() {
  const [form, setForm] = useState(presets.review);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (key, value) => { setResult(null); setForm((prev) => ({ ...prev, [key]: value })); };

  async function run() {
    setLoading(true); setError('');
    try {
      const messageId = globalThis.crypto?.randomUUID?.() || `fleet-${Date.now()}`;
      const body = { message: { messageId, role:'ROLE_USER', parts:[{ data:{ skill:'governed_agent_action_check', action:form.action, target:form.target, constraints:{ allowed_actions:split(form.allowed_actions), allowed_targets:split(form.allowed_targets) } }, mediaType:'application/json' }] } };
      const response = await fetch(A2A_ENDPOINT, { method:'POST', headers:{ 'content-type':'application/json', 'a2a-version':'1.0' }, body:JSON.stringify(body) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.detail || payload?.title || `HTTP ${response.status}`);
      const parts = Array.isArray(payload?.message?.parts) ? payload.message.parts : [];
      const data = parts.map((part) => part?.data).find((value) => value && typeof value === 'object') || {};
      const text = parts.map((part) => part?.text).find(Boolean) || 'Governance result returned.';
      setResult({ ...data, text, message_id:payload?.message?.messageId || messageId, context_id:payload?.message?.contextId || null });
    } catch (err) { setError(String(err.message || err)); } finally { setLoading(false); }
  }

  return <div style={{ minHeight:'100vh', maxWidth:'100%', overflowX:'hidden', background:'#020408', color:'#f7fafc', fontFamily:'Inter, system-ui, sans-serif' }}>
    <Navbar />
    <main style={{ minHeight:'100vh', padding:'clamp(104px,12vw,132px) 20px 80px' }}>
      <div style={{ width:'min(1120px,100%)', margin:'0 auto', minWidth:0 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center', marginBottom:16 }}>
          <div style={{ color:'#67e8f9', letterSpacing:'.2em', fontSize:12 }}>ALL THINGS AGENTIC · LIVE PRODUCT BUILD</div>
          <a href="/developer-test-drive" style={{ color:'#031019', background:'#6ee7b7', borderRadius:999, padding:'7px 11px', fontSize:11, fontWeight:800, textDecoration:'none' }}>Guided developer test drive →</a>
          <a href="/governed-agent-fleet.json" style={{ color:'#9fb0bf', border:'1px solid rgba(255,255,255,.12)', borderRadius:999, padding:'6px 10px', fontSize:11, textDecoration:'none' }}>Machine contract →</a>
        </div>
        <h1 style={{ fontSize:'clamp(44px,8vw,86px)', lineHeight:.92, margin:0, maxWidth:980 }}>Govern the fleet before the fleet acts.</h1>
        <p style={{ color:'#9fb0bf', fontSize:19, lineHeight:1.65, maxWidth:820, margin:'26px 0 20px' }}>A public-safe governance layer for consequential AI actions. This live proof sends structured action metadata through Misfit Machine Agent's published A2A governance skill and returns ALLOW, REVIEW, or BLOCK before any external action is eligible to execute.</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:38 }}>
          <a href={evaluationUrl} target="_blank" rel="noreferrer" style={{ textDecoration:'none', background:'#67e8f9', color:'#031019', fontWeight:900, borderRadius:14, padding:'14px 18px' }}>BUY EVALUATION · $500</a>
          <a href={integrationUrl} target="_blank" rel="noreferrer" style={{ textDecoration:'none', border:'1px solid rgba(103,232,249,.35)', color:'#e8fbff', fontWeight:800, borderRadius:14, padding:'14px 18px' }}>DEPLOY INTO MY AGENT · $1,500</a>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>{Object.values(presets).map((preset)=><button key={preset.label} onClick={()=>{setForm(preset);setResult(null)}} style={{ minHeight:44, padding:'8px 13px', borderRadius:999, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.025)', color:'#b9c8d3', fontWeight:700 }}>{preset.label}</button>)}</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap:18 }}>
          <section style={panel}>
            <div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>ACTION ENVELOPE</div>
            <label style={{ display:'block', color:'#9fb0bf', marginTop:14 }}>Action<input value={form.action} onChange={(e)=>set('action',e.target.value)} style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440', boxSizing:'border-box', minWidth:0 }} /></label>
            <label style={{ display:'block', color:'#9fb0bf', marginTop:14 }}>Target<input value={form.target} onChange={(e)=>set('target',e.target.value)} style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440', boxSizing:'border-box', minWidth:0 }} /></label>
            <label style={{ display:'block', color:'#9fb0bf', marginTop:14 }}>Allowed actions <span style={{ color:'#5f7281' }}>(comma-separated)</span><input value={form.allowed_actions} onChange={(e)=>set('allowed_actions',e.target.value)} placeholder="read_status" style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440', boxSizing:'border-box', minWidth:0 }} /></label>
            <label style={{ display:'block', color:'#9fb0bf', marginTop:14 }}>Allowed targets <span style={{ color:'#5f7281' }}>(comma-separated)</span><input value={form.allowed_targets} onChange={(e)=>set('allowed_targets',e.target.value)} placeholder="public_service_health" style={{ width:'100%', marginTop:7, padding:12, borderRadius:12, background:'#05080d', color:'#fff', border:'1px solid #263440', boxSizing:'border-box', minWidth:0 }} /></label>
            <button onClick={run} disabled={loading} style={{ width:'100%', minHeight:48, marginTop:22, border:0, borderRadius:14, padding:15, background:'#67e8f9', color:'#031019', fontWeight:900, fontSize:16 }}>{loading?'CHECKING BOUNDARY…':'RUN LIVE A2A GOVERNANCE'}</button>
            {error && <div style={{ color:'#fb7185', marginTop:12, overflowWrap:'anywhere' }}>{error}</div>}
          </section>
          <section style={panel}>
            <div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>FLEET DECISION</div>
            {!result ? <p style={{ color:'#718191', lineHeight:1.6 }}>Run an action through the published governance skill. No payment, message, transfer, credential change, record mutation, or external action is executed by this public proof surface.</p> : <>
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'end', justifyContent:'space-between', gap:12, marginTop:20 }}><strong style={{ fontSize:46, textTransform:'uppercase' }}>{result.decision || 'UNKNOWN'}</strong><div style={{ color:result.requires_human_review?'#fbbf24':'#6ee7b7', fontWeight:800 }}>{result.requires_human_review?'HUMAN REVIEW':'NO HUMAN REVIEW'}</div></div>
              <p style={{ color:'#a7b6c2', lineHeight:1.65 }}>{result.text}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap:10, marginTop:14 }}>
                <div style={{ border:'1px solid #1d2a34', borderRadius:14, padding:13, minWidth:0 }}><div style={{ color:'#718191', fontSize:10 }}>NORMALIZED ACTION</div><div style={{ marginTop:5, overflowWrap:'anywhere' }}>{result.normalized_action?.action || form.action} → {result.normalized_action?.target || form.target}</div></div>
                <div style={{ border:'1px solid #1d2a34', borderRadius:14, padding:13, minWidth:0 }}><div style={{ color:'#718191', fontSize:10 }}>ALLOWED</div><div style={{ marginTop:5 }}>{String(Boolean(result.allowed))}</div></div>
                <div style={{ border:'1px solid #1d2a34', borderRadius:14, padding:13, minWidth:0 }}><div style={{ color:'#718191', fontSize:10 }}>EXTERNAL EXECUTION</div><div style={{ marginTop:5 }}>false</div></div>
              </div>
              <div style={{ border:'1px solid #1d2a34', borderRadius:14, padding:14, background:'#04070b', marginTop:12, minWidth:0 }}><div style={{ color:'#718191', fontSize:10 }}>PUBLIC REASON CODES</div><div style={{ marginTop:7, overflowWrap:'anywhere', color:'#cbd5e1' }}>{result.reasons?.join(' · ') || 'No public reason codes returned'}</div></div>
              <div style={{ color:'#718191', marginTop:14, fontSize:12, overflowWrap:'anywhere' }}>Message receipt: {result.message_id}</div>
            </>}
          </section>
        </div>
        <section style={{ ...panel, marginTop:18 }}>
          <div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>FROM PUBLIC PROOF TO PRODUCTION OFFER</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap:14, marginTop:16 }}>
            <div><strong style={{ fontSize:22 }}>$500 · Evaluate</strong><p style={{ color:'#9fb0bf', lineHeight:1.6 }}>10,000 governed checks plus comparative evidence and integration findings. Use this to test whether the control layer fits your agent before implementation.</p><a href={evaluationUrl} target="_blank" rel="noreferrer" style={{ color:'#67e8f9', fontWeight:800 }}>Buy evaluation →</a></div>
            <div><strong style={{ fontSize:22 }}>$1,500 · Integrate</strong><p style={{ color:'#9fb0bf', lineHeight:1.6 }}>One existing agent workflow gets bounded allow/review/block routing, human-gate hooks, and audit evidence. Private GHOSBC internals stay sealed.</p><a href={integrationUrl} target="_blank" rel="noreferrer" style={{ color:'#67e8f9', fontWeight:800 }}>Buy integration →</a></div>
            <div><strong style={{ fontSize:22 }}>API / MCP / A2A</strong><p style={{ color:'#9fb0bf', lineHeight:1.6 }}>The public-safe governance primitive is available through machine-facing contracts. The browser proof above uses the published A2A skill directly.</p><a href="/agent-evaluation-lab" style={{ color:'#67e8f9', fontWeight:800 }}>Inspect developer contracts →</a></div>
          </div>
        </section>
        <section style={{ ...panel, marginTop:18 }}><div style={{ color:'#67e8f9', fontSize:12, letterSpacing:'.16em' }}>CLAIM BOUNDARY</div><p style={{ color:'#a9b8c5', lineHeight:1.7, marginBottom:0 }}>The public product exposes the governance pattern and evidence, not the protected cognitive kernel. Mother Language, Soul Cipher, GHX/glyph mappings, hidden policy tables, private prompts, credentials, and reconstruction material remain excluded.</p></section>
      </div>
    </main>
    <Footer />
  </div>;
}
