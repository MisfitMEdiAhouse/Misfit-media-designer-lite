const DOMAIN='coffeeandajoint.co';
const CUSTOMER_ID='219348257';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  const token=process.env.GODADDY_PAT;
  if(!token) return res.status(503).json({ok:false,error:'no_godaddy_pat'});
  try{
    const r=await fetch(`https://api.godaddy.com/v2/customers/${CUSTOMER_ID}/domains/forwards/${DOMAIN}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
    const text=await r.text(); let data=null; try{data=JSON.parse(text)}catch{data=text.slice(0,500)}
    return res.status(200).json({ok:r.ok,status:r.status,data});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
