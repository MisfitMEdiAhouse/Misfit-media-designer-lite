const FQDN='coffeeandajoint.co';
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
    const r=await fetch(`https://api.godaddy.com/v1/domains/${FQDN}`,{headers:headers()});
    const text=await r.text();
    let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
    const idHeaders={};
    for(const [k,v] of r.headers.entries()) if(/shopper|customer|account|owner|client|request|trace|correlation/i.test(k)) idHeaders[k]=v;
    const envCandidates={
      GODADDY_CUSTOMER_ID:process.env.GODADDY_CUSTOMER_ID||null,
      GODADDY_SHOPPER_ID:process.env.GODADDY_SHOPPER_ID||null,
      CUSTOMER_ID:process.env.CUSTOMER_ID||null,
      SHOPPER_ID:process.env.SHOPPER_ID||null
    };
    return res.status(200).json({ok:r.ok,status:r.status,keys:data&&typeof data==='object'?Object.keys(data).sort():[],idHeaders,envCandidates,domainId:data?.domainId??null,customerId:data?.customerId??null,shopperId:data?.shopperId??null});
  }catch(error){return res.status(500).json({ok:false,error:String(error?.message||error)})}
}
