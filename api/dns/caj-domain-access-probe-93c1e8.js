const TARGETS=['coffeeandajoint.co','coffeeandjoint.co'];
function headers(){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,Accept:'application/json'};
}
async function inspect(domain){
  const r=await fetch(`https://api.godaddy.com/v1/domains/${encodeURIComponent(domain)}`,{headers:headers()});
  const text=await r.text();
  let data=null; try{data=text?JSON.parse(text):null}catch{data=null}
  return {
    domain,
    ok:r.ok,
    status:r.status,
    keys:data&&typeof data==='object'?Object.keys(data).sort():[],
    domainId:data?.domainId??null,
    customerId:data?.customerId??null,
    shopperId:data?.shopperId??null,
    statusValue:data?.status??null,
    expires:data?.expires??null,
    nameServers:Array.isArray(data?.nameServers)?data.nameServers:[]
  };
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  try{
    const results=await Promise.all(TARGETS.map(inspect));
    return res.status(200).json({ok:true,results});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
