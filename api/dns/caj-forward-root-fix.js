const CUSTOMER='219348257';
const FQDN='coffeeandajoint.co';
const TARGET='https://www.coffeeandajoint.co/';
const FORWARD=`https://api.godaddy.com/v2/customers/${CUSTOMER}/domains/forwards/${FQDN}`;
const RECORDS=`https://api.godaddy.com/v1/domains/${FQDN}/records`;
function headers(json=false){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,Accept:'application/json',...(json?{'Content-Type':'application/json'}:{})};
}
async function call(url,opts={}){
  const r=await fetch(url,opts);
  const text=await r.text();
  let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:r.ok,status:r.status,data};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  try{
    const before=await call(FORWARD,{headers:headers()});
    const put=await call(FORWARD,{method:'PUT',headers:headers(true),body:JSON.stringify({fqdn:FQDN,type:'REDIRECT_PERMANENT',url:TARGET})});
    const after=await call(FORWARD,{headers:headers()});
    const dns=await call(RECORDS,{headers:headers()});
    const records=Array.isArray(dns.data)?dns.data.filter(x=>x.name==='@'||x.name==='www').map(x=>({type:x.type,name:x.name,data:x.data,ttl:x.ttl})):dns.data;
    return res.status(200).json({ok:put.ok&&after.ok,fqdn:FQDN,target:TARGET,before,put,after,dns:{ok:dns.ok,status:dns.status,records}});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
