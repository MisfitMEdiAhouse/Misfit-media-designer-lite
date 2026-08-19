const ZONE='coffeeandajoint.co';
function headers(){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,Accept:'application/json'};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  try{
    const url=new URL(`https://api.godaddy.com/v3/domains/zones/${ZONE}/dns-records`);
    url.searchParams.set('pageSize','100');
    url.searchParams.set('totalRequired','true');
    const r=await fetch(url,{headers:headers()});
    const text=await r.text();
    let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
    const rows=Array.isArray(data?.records)?data.records:Array.isArray(data)?data:[];
    const normalized=rows.map(x=>({recordId:x.recordId??x.id??null,type:x.type??null,name:x.name??null,data:x.data??x.value??null,ttl:x.ttl??null,priority:x.priority??null}));
    return res.status(200).json({ok:r.ok,upstreamStatus:r.status,zone:ZONE,total:data?.total??normalized.length,records:normalized});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
