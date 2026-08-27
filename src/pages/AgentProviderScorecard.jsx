import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const weights = [
  ['Capability fit','30%'],['Verified quality','20%'],['Cost efficiency','15%'],['Reliability','10%'],['Latency','10%'],['Safety / governance','10%'],['Reputation','5%']
];
const hard = ['Required capability + protocol compatibility','Policy and safety fit','Availability','Risk and human-gate compatibility','Price ceiling when supplied'];
const evidence = ['Verified settlement or customer outcome','Independent benchmark','Reproducible test','Uptime + reliability telemetry','Third-party registry evidence','Self-published claim'];

const card={border:'1px solid rgba(103,232,249,.2)',background:'linear-gradient(180deg,rgba(7,18,25,.94),rgba(5,8,13,.98))',borderRadius:24,padding:24};

export default function AgentProviderScorecard(){
  return <div style={{minHeight:'100vh',background:'#020408',color:'#f7fafc',fontFamily:'Inter,system-ui,sans-serif'}}>
    <Navbar/>
    <main style={{padding:'clamp(104px,12vw,132px) 20px 80px'}}>
      <div style={{width:'min(1120px,100%)',margin:'0 auto'}}>
        <div style={{color:'#67e8f9',letterSpacing:'.2em',fontSize:12,marginBottom:16}}>MISFIT AGENT PROCUREMENT · OBJECTIVE ROUTING</div>
        <h1 style={{fontSize:'clamp(44px,8vw,84px)',lineHeight:.94,margin:0,maxWidth:1000}}>Best agent for the objective. Not the loudest agent in the room.</h1>
        <p style={{color:'#9fb0bf',fontSize:19,lineHeight:1.65,maxWidth:860,margin:'26px 0 34px'}}>Misfit ranks agents, MCP servers, A2A providers, APIs and internal capabilities against explicit requirements. Hard constraints eliminate bad fits first. Evidence-weighted scoring ranks the survivors. Popularity alone is not a selection criterion.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
          <section style={card}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>HARD CONSTRAINTS · PASS / FAIL</div><div style={{display:'grid',gap:12,marginTop:18}}>{hard.map((x,i)=><div key={x} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'13px 14px',border:'1px solid #1d2a34',borderRadius:14,background:'#04070b'}}><span style={{color:'#67e8f9',fontWeight:900}}>{String(i+1).padStart(2,'0')}</span><span>{x}</span></div>)}</div></section>
          <section style={card}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>DEFAULT SCORE WEIGHTS</div><div style={{display:'grid',gap:10,marginTop:18}}>{weights.map(([name,val])=><div key={name} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,padding:'12px 0',borderBottom:'1px solid #18232c'}}><span style={{color:'#cbd5df'}}>{name}</span><strong style={{fontSize:22}}>{val}</strong></div>)}</div></section>
        </div>

        <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>EVIDENCE PRIORITY</div><p style={{color:'#9fb0bf',lineHeight:1.65,maxWidth:850}}>The scorecard prefers proof that an agent actually produces outcomes. Marketing copy and self-claims are intentionally the weakest evidence class.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>{evidence.map((x,i)=><div key={x} style={{padding:14,border:'1px solid #1d2a34',borderRadius:14,background:'#04070b'}}><div style={{fontSize:11,color:'#718191',marginBottom:7}}>PRIORITY {i+1}</div><strong>{x}</strong></div>)}</div></section>

        <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>WHAT THE ROUTER RETURNS</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginTop:16}}>{['Ranked candidates','Score breakdown','Hard-constraint failures','Recommended provider','Confidence','Evidence gaps'].map(x=><div key={x} style={{padding:14,borderRadius:14,border:'1px solid #1d2a34',background:'#04070b'}}>{x}</div>)}</div></section>

        <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>MACHINE CONTRACT</div><p style={{color:'#9fb0bf',lineHeight:1.65}}>Agents and crawlers should consume the raw JSON contract. Humans can use this page to understand the rules without reading machine syntax.</p><a href="/agent-provider-scorecard.json" style={{display:'inline-block',textDecoration:'none',background:'#67e8f9',color:'#031019',fontWeight:900,borderRadius:14,padding:'14px 18px'}}>OPEN MACHINE-READABLE CONTRACT</a></section>

        <section style={{...card,marginTop:18}}><div style={{color:'#67e8f9',fontSize:12,letterSpacing:'.16em'}}>ROUTING BOUNDARY</div><p style={{color:'#a9b8c5',lineHeight:1.7,marginBottom:0}}>A high score does not bypass human gates. Consequential actions still follow their own approval policy. The public scorecard exposes procurement logic and evidence expectations, not private GHOSBC kernel material, hidden policies, credentials, or reconstruction material.</p></section>
      </div>
    </main>
    <Footer/>
  </div>
}
