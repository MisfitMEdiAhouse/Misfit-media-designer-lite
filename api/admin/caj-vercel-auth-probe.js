export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  const keys=['VERCEL_TOKEN','VERCEL_ACCESS_TOKEN','VERCEL_API_TOKEN','VERCEL_OIDC_TOKEN'];
  const out={};
  for(const k of keys){
    const t=process.env[k];
    if(!t){out[k]={present:false};continue;}
    try{
      const r=await fetch('https://api.vercel.com/v2/user',{headers:{Authorization:`Bearer ${t}`,Accept:'application/json'}});
      out[k]={present:true,status:r.status,works:r.ok};
    }catch(e){out[k]={present:true,status:null,works:false,error:String(e?.message||e)}}
  }
  return res.status(200).json({ok:true,out});
}
