const PROJECT='prj_nQVmclxNH0gBRnYt23XFQSofnuQI';
const TEAM='team_7ZHStyjjCpAKFogk5jXp9gZo';
const DOMAIN='coffeeandajoint.co';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST') return res.status(405).json({ok:false});
  const token=process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL_TOKEN;
  if(!token) return res.status(503).json({ok:false,error:'no_vercel_token'});
  try{
    const r=await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/domains?teamId=${TEAM}`,{
      method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({name:DOMAIN})
    });
    const text=await r.text(); let data=null; try{data=JSON.parse(text)}catch{data={message:text.slice(0,500)}}
    return res.status(r.ok?200:r.status).json({ok:r.ok,status:r.status,domain:data?.name||DOMAIN,verified:data?.verified??null,error:data?.error?.message||data?.message||null,verification:Array.isArray(data?.verification)?data.verification.map(v=>({type:v.type,domain:v.domain,value:v.value,reason:v.reason})):[]});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
