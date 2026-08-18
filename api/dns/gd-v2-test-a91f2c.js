const DOMAIN='coffeeandajoint.co';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  const token=process.env.GODADDY_PAT;
  if(!token) return res.status(503).json({ok:false});
  try{
    const d=await fetch(`https://api.godaddy.com/v1/domains/${DOMAIN}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
    const j=d.ok?await d.json():{};
    const id=j?.subaccountId||j?.domainId;
    if(!id) return res.status(409).json({ok:false,domain_status:d.status,id_found:false});
    const f=await fetch(`https://api.godaddy.com/v2/customers/${encodeURIComponent(String(id))}/domains/forwards/${DOMAIN}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
    return res.status(200).json({ok:true,domain_status:d.status,id_source:j?.subaccountId?'subaccountId':'domainId',forward_status:f.status,usable:[200,404].includes(f.status)});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
