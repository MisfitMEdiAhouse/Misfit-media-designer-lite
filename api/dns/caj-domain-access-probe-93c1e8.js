const DOMAIN='coffeeandajoint.co';
function headers(){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,Accept:'application/json'};
}
async function getJson(url){
  const r=await fetch(url,{headers:headers()});
  const text=await r.text();
  let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:r.ok,status:r.status,data};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  try{
    const [domainResp,recordsResp]=await Promise.all([
      getJson(`https://api.godaddy.com/v1/domains/${DOMAIN}`),
      getJson(`https://api.godaddy.com/v1/domains/${DOMAIN}/records`)
    ]);
    const d=domainResp.data||{};
    const rows=Array.isArray(recordsResp.data)?recordsResp.data:[];
    return res.status(200).json({
      ok:domainResp.ok&&recordsResp.ok,
      domain:{ok:domainResp.ok,status:domainResp.status,domainId:d.domainId??null,statusValue:d.status??null,expires:d.expires??null,nameServers:Array.isArray(d.nameServers)?d.nameServers:[]},
      dns:{ok:recordsResp.ok,status:recordsResp.status,records:rows.map(x=>({type:x.type??null,name:x.name??null,data:x.data??null,ttl:x.ttl??null,priority:x.priority??null}))}
    });
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
