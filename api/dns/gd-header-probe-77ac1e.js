export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  const token=process.env.GODADDY_PAT;
  if(!token) return res.status(503).json({ok:false});
  try{
    const r=await fetch('https://api.godaddy.com/v1/domains?limit=10',{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
    const text=await r.text();
    let data=null; try{data=JSON.parse(text)}catch{}
    const hdr={};
    for(const [k,v] of r.headers.entries()) if(/shopper|customer|account|subject|user/i.test(k)) hdr[k]=v;
    const sample=Array.isArray(data)?data[0]:null;
    return res.status(200).json({ok:r.ok,status:r.status,matching_headers:hdr,sample_keys:sample&&typeof sample==='object'?Object.keys(sample):[],top_keys:data&&typeof data==='object'&&!Array.isArray(data)?Object.keys(data):[]});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
