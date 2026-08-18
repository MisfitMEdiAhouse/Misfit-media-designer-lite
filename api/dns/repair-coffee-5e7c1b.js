const DOMAIN='coffeeandajoint.co';
const TARGET='https://coffeeandajoint-corrected.vercel.app/';
const CUSTOMER_ID='219348257';

async function gd(path,token,options={}){
  return fetch(`https://api.godaddy.com${path}`,{
    ...options,
    headers:{Authorization:`Bearer ${token}`,Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}
  });
}

async function deleteApexARecords(token){
  const r=await gd(`/v3/domains/zones/${DOMAIN}/dns-records?type=A&name=%40&pageSize=100&totalRequired=true`,token);
  if(!r.ok)return{ok:false,status:r.status};
  const j=await r.json();
  const items=Array.isArray(j?.items)?j.items:Array.isArray(j)?j:[];
  const deleted=[];
  for(const rec of items){
    if(!rec?.recordId)continue;
    const d=await gd(`/v3/domains/zones/${DOMAIN}/dns-records/${encodeURIComponent(rec.recordId)}`,token,{method:'DELETE'});
    deleted.push({status:d.status});
  }
  return{ok:deleted.every(x=>x.status>=200&&x.status<300),deleted};
}

async function putForward(token){
  const r=await gd(`/v2/customers/${CUSTOMER_ID}/domains/forwards/${DOMAIN}`,token,{
    method:'PUT',
    body:JSON.stringify({fqdn:DOMAIN,type:'REDIRECT_TEMPORARY',url:TARGET})
  });
  const text=await r.text();
  return{ok:r.ok,status:r.status,text};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST')return res.status(405).json({ok:false});
  const token=process.env.GODADDY_PAT;
  if(!token)return res.status(503).json({ok:false,error:'godaddy_not_configured'});
  try{
    let f=await putForward(token);
    const first={status:f.status,error:f.text?f.text.slice(0,400):null};
    let dnsCleanup=null;
    if(!f.ok&&[409,422].includes(f.status)){
      dnsCleanup=await deleteApexARecords(token);
      f=await putForward(token);
    }
    return res.status(f.ok?200:502).json({ok:f.ok,domain:DOMAIN,target:TARGET,redirect_type:'temporary',first_status:first.status,first_error:first.error,dns_cleanup:dnsCleanup,final_status:f.status,final_error:f.ok?null:(f.text?f.text.slice(0,400):null)});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
