const PROJECT_ID='prj_nQVmclxNH0gBRnYt23XFQSofnuQI';
const TEAM_ID='team_7ZHStyjjCpAKFogk5jXp9gZo';

async function call(path,opts={}){
  const token=process.env.VERCEL_OIDC_TOKEN;
  if(!token) return {ok:false,status:503,data:{error:'VERCEL_OIDC_TOKEN missing'}};
  const r=await fetch(`https://api.vercel.com${path}`,{
    ...opts,
    headers:{Authorization:`Bearer ${token}`,Accept:'application/json',...(opts.body?{'Content-Type':'application/json'}:{}),...(opts.headers||{})}
  });
  const text=await r.text(); let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:r.ok,status:r.status,data};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method==='GET'){
    const p=await call(`/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`);
    return res.status(200).json({ok:p.ok,status:p.status,project:p.ok?{id:p.data?.id,name:p.data?.name}:p.data});
  }
  if(req.method==='POST'){
    const name=String(req.query.name||req.body?.name||'').toLowerCase().trim();
    if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+coffeeandajoint\.co$/.test(name) && name!=='coffeeandajoint.co') return res.status(400).json({ok:false,error:'invalid domain'});
    const gitBranch=String(req.query.gitBranch||req.body?.gitBranch||'coffee-pages').trim();
    const r=await call(`/v10/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}`,{method:'POST',body:JSON.stringify({name,gitBranch})});
    return res.status(200).json({ok:r.ok,status:r.status,data:r.data});
  }
  if(req.method==='DELETE'){
    const name=String(req.query.name||req.body?.name||'').toLowerCase().trim();
    if(!name) return res.status(400).json({ok:false,error:'name required'});
    const r=await call(`/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(name)}?teamId=${TEAM_ID}`,{method:'DELETE'});
    return res.status(200).json({ok:r.ok,status:r.status,data:r.data});
  }
  return res.status(405).json({ok:false});
}
