import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const weights = [
  ['Capability fit','30%'],['Verified quality','20%'],['Cost efficiency','15%'],['Reliability','10%'],['Latency','10%'],['Safety / governance','10%'],['Reputation','5%']
];
const hard = ['Required capability + protocol compatibility','Policy and safety fit','Availability','Risk and human-gate compatibility','Price ceiling when supplied'];
const evidence = ['Verified settlement or customer outcome','Independent benchmark','Reproducible test','Uptime + reliability telemetry','Third-party registry evidence','Self-published claim'];
const card={border:'1px solid rgba(103,232,249,.2)',background:'linear-gradient(180deg,rgba(7,18,25,.94),rgba(5,8,13,.98))',borderRadius:24,padding:24};

const starterCandidates = [
  { name:'Provider Alpha', protocols:['MCP','API'], capabilities:['agent governance'], available:true, policy_fit:true, human_gate_compatible:true, price:0.05, scores:{capability_fit:92,verified_quality:78,cost_efficiency:88,reliability:91,latency:82,safety_governance:95,reputation:60}, evidence:['reproducible test','uptime telemetry'] },
  { name:'Provider Beta', protocols:['API'], capabilities:['agent governance'], available:true, policy_fit:true, human_gate_compatible:true, price:0.03, scores:{capability_fit:85,verified_quality:90,cost_efficiency:94,reliability:86,latency:90,safety_governance:76,reputation:82}, evidence:['independent benchmark','third-party registry evidence','uptime telemetry'] },
  { name:'Provider Gamma', protocols:['A2A'], capabilities:['general agent'], available:true, policy_fit:true, human_gate_compatible:false, price:0.01, scores:{capability_fit:55,verified_quality:50,cost_efficiency:99,reliability:70,latency:72,safety_governance:52,reputation:95}, evidence:['self-published claim'] },
];

export default function AgentProviderScorecard(){
  const [objective,setObjective]=useState({required_protocol:'API',required_capability:'agent governance',price_ceiling:0.10,requires_human_gate_compatibility:true});
  const [candidatesText,setCandidatesText]=useState(JSON.stringify(starterCandidates,null,2));
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const setObj=(k,v)=>setObjective(prev=>({...prev,[k]:v}));
  async function route(){
    setLoading(true); setError('');
    try{
      const candidates=JSON.parse(candidatesText);
      const response=await fetch('/api/provider-router',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({objective,candidates})});
      const data=await response.json(); if(!response.ok) throw new Error(data.error||`HTTP ${response.status}`); setResult(data);
    }catch(e){setError(String(e.message||e));} finally{setLoading(false);}
  }

  return <div style={{minHeight:'100vh',background:'#020408',color:'#f7fafc',fontFamily:'Inter,system-ui,sans-serif'}}>
    <Navbar/>
    <main style={{padding:'clamp(104px,12vw,132px) 20px 80px'}}><div style={{width:'min(1120px,100%)',margin:'0 auto'}}>
      <div style={{color:'#67e8f9',letterSpacing:'.2em',fontSize:12,marginBottom:16}}>MISFIT AGENT PROCUREMENT · LIVE OBJECTIVE ROUTER</div>
      <h1 style={{fontSize:'clamp(44px,8vw,84px)',lineHeight:.94,margin:0,maxWidth:1000}}>Best agent for the objective. Not the loudest agent in the room.</h1>
      <p style={{color:'#9fb0bf',fontSize:19,lineHeight:1.65,maxWidth:860,margin:'26px 0 34px'}}>Misfit ranks agents, MCP servers, A2A providers, APIs and internal capabilities against explicit requirements. Hard constraints eliminate bad fits first. Evidence-weighted scoring ranks the survivors. Popularity alone is not a selection criterion.</p>

      <section style={{...card,marginBottom:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>LIVE PROVIDER ROUTER</div><p style={{color:'#9fb0bf',lineHeight:1.6}}>Edit the objective and candidate JSON, then run the same deterministic procurement logic agents can call through the API.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
          <label style={{color:'#9fb0bf'}}>Required protocol<input value={objective.required_protocol} onChange={e=>setObj('required_protocol',e.target.value)} style={{width:'100%',boxSizing:'border-box',marginTop:7,padding:12,borderRadius:12,border:'1px solid #263440',background:'#05080d',color:'#fff'}}/></label>
          <label style={{color:'#9fb0bf'}}>Required capability<input value={objective.required_capability} onChange={e=>setObj('required_capability',e.target.value)} style={{width:'100%',boxSizing:'border-box',marginTop:7,padding:12,borderRadius:12,border:'1px solid #263440',background:'#05080d',color:'#fff'}}/></label>
          <label style={{color:'#9fb0bf'}}>Price ceiling<input type="number" step="0.01" value={objective.price_ceiling} onChange={e=>setObj('price_ceiling',Number(e.target.value))} style={{width:'100%',boxSizing:'border-box',marginTop:7,padding:12,borderRadius:12,border:'1px solid #263440',background:'#05080d',color:'#fff'}}/></label>
        </div>
        <label style={{display:'flex',gap:10,marginTop:14,color:'#cbd5df'}}><input type="checkbox" checked={objective.requires_human_gate_compatibility} onChange={e=>setObj('requires_human_gate_compatibility',e.target.checked)}/> Require human-gate compatibility</label>
        <label style={{display:'block',marginTop:16,color:'#9fb0bf'}}>Candidate providers JSON<textarea value={candidatesText} onChange={e=>setCandidatesText(e.target.value)} style={{width:'100%',minHeight:330,boxSizing:'border-box',marginTop:7,padding:14,borderRadius:14,border:'1px solid #263440',background:'#05080d',color:'#cbd5df',fontFamily:'ui-monospace,SFMono-Regular,monospace',fontSize:12}}/></label>
        <button onClick={route} disabled={loading} style={{width:'100%',marginTop:16,border:0,borderRadius:14,padding:15,background:'#67e8f9',color:'#031019',fontWeight:900,fontSize:16}}>{loading?'SCORING…':'ROUTE OBJECTIVELY'}</button>
        {error&&<div style={{color:'#fb7185',marginTop:12}}>{error}</div>}
        {result&&<div style={{marginTop:20}}><div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:12,alignItems:'end'}}><div><div style={{fontSize:11,color:'#718191'}}>RECOMMENDED PROVIDER</div><strong style={{fontSize:'clamp(30px,6vw,52px)'}}>{result.recommended_provider||'NO ELIGIBLE PROVIDER'}</strong></div><div style={{color:'#9fb0bf'}}>Score <strong style={{fontSize:30,color:'#fff'}}>{result.recommended_score??'—'}</strong> · Confidence <strong style={{color:'#fff'}}>{result.confidence}%</strong></div></div><div style={{display:'grid',gap:10,marginTop:16}}>{result.ranked_candidates?.map((p,i)=><div key={p.name} style={{padding:14,border:'1px solid #1d2a34',borderRadius:14,background:'#04070b'}}><div style={{display:'flex',justifyContent:'space-between',gap:12}}><strong>#{i+1} {p.name}</strong><span style={{color:p.eligible?'#67e8f9':'#fb7185'}}>{p.eligible?`${p.score} / 100`:'INELIGIBLE'}</span></div>{p.hard_constraint_failures?.length>0&&<div style={{color:'#fb7185',fontSize:12,marginTop:7}}>Fails: {p.hard_constraint_failures.join(', ')}</div>}<div style={{color:'#718191',fontSize:12,marginTop:7}}>Evidence: {p.evidence?.length?p.evidence.join(' · '):'none supplied'}{p.evidence_gaps?.length?` · Gaps: ${p.evidence_gaps.join(', ')}`:''}</div></div>)}</div><div style={{fontSize:12,color:'#718191',marginTop:12}}>{result.boundary}</div></div>}
      </section>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
        <section style={card}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>HARD CONSTRAINTS · PASS / FAIL</div><div style={{display:'grid',gap:12,marginTop:18}}>{hard.map((x,i)=><div key={x} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'13px 14px',border:'1px solid #1d2a34',borderRadius:14,background:'#04070b'}}><span style={{color:'#67e8f9',fontWeight:900}}>{String(i+1).padStart(2,'0')}</span><span>{x}</span></div>)}</div></section>
        <section style={card}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>DEFAULT SCORE WEIGHTS</div><div style={{display:'grid',gap:10,marginTop:18}}>{weights.map(([name,val])=><div key={name} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,padding:'12px 0',borderBottom:'1px solid #18232c'}}><span style={{color:'#cbd5df'}}>{name}</span><strong style={{fontSize:22}}>{val}</strong></div>)}</div></section>
      </div>
      <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>EVIDENCE PRIORITY</div><p style={{color:'#9fb0bf',lineHeight:1.65,maxWidth:850}}>The scorecard prefers proof that an agent actually produces outcomes. Marketing copy and self-claims are intentionally the weakest evidence class.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>{evidence.map((x,i)=><div key={x} style={{padding:14,border:'1px solid #1d2a34',borderRadius:14,background:'#04070b'}}><div style={{fontSize:11,color:'#718191',marginBottom:7}}>PRIORITY {i+1}</div><strong>{x}</strong></div>)}</div></section>
      <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>MACHINE ACCESS</div><p style={{color:'#9fb0bf',lineHeight:1.65}}>POST an objective plus candidate array to <code>/api/provider-router</code>. The runtime returns ranked candidates, hard-constraint failures, score breakdown, recommendation, confidence and evidence gaps. Execution remains disabled by design.</p><a href="/agent-provider-scorecard.json" style={{display:'inline-block',textDecoration:'none',background:'#67e8f9',color:'#031019',fontWeight:900,borderRadius:14,padding:'14px 18px'}}>OPEN MACHINE CONTRACT</a></section>
      <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>ROUTING BOUNDARY</div><p style={{color:'#a9b8c5',lineHeight:1.7,marginBottom:0}}>A high score does not bypass human gates. This public runtime recommends only; it cannot execute payments, messages, wallet actions, account mutations, or other consequential external actions. Private GHOSBC kernel material and hidden policies remain excluded.</p></section>
    </div></main><Footer/>
  </div>
}
