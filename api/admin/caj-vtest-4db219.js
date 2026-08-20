const DOMAIN='coffeeandajoint.co';
const TARGET='https://misfit-media-designer-lite-git-co-b746a4-misfit-medias-projects.vercel.app/';
function gh(write=false){const t=process.env.GODADDY_PAT;if(!t) throw new Error('GODADDY_PAT missing');return {Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})};}
async function gcall(method,url,body){const r=await fetch(url,{method,headers:gh(method!=='GET'),...(body?{body:JSON.stringify(body)}:{})});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}const safeHeaders={};for(const [k,v] of r.headers.entries()){if(/shopper|customer|account/i.test(k))safeHeaders[k]=v;}return {status:r.status,ok:r.ok,data,safeHeaders};}
function customerCandidates(){const keys=['GODADDY_CUSTOMER_ID','GODADDY_SHOPPER_ID','CUSTOMER_ID','SHOPPER_ID'];return keys.filter(k=>process.env[k]).map(k=>({key:k,value:String(process.env[k]).trim()}));}
async function forwardCall(customer,fqdn,method='GET'){
  const url=`https://api.godaddy.com/v2/customers/${encodeURIComponent(customer)}/domains/forwards/${encodeURIComponent(fqdn)}`;
  const body=(method==='PUT')?{fqdn,type:'REDIRECT_TEMPORARY',url:TARGET}:undefined;
  return gcall(method,url,body);
}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');try{
  const action=String(req.query?.action||'probe');
  if(action==='probe'){
    const candidates=customerCandidates();
    const attempts=[];
    for(const c of candidates){
      const r=await forwardCall(c.value,DOMAIN,'GET');
      attempts.push({key:c.key,status:r.status,ok:r.ok||r.status===404});
      if(r.ok||r.status===404)return res.status(200).json({ok:true,customerKey:c.key,status:r.status,hasRule:r.ok});
    }
    const domains=await gcall('GET','https://api.godaddy.com/v1/domains');
    return res.status(200).json({ok:false,candidateKeys:candidates.map(c=>c.key),attempts,domainsStatus:domains.status,domainFields:Array.isArray(domains.data)&&domains.data[0]?Object.keys(domains.data[0]):[],identityHeaders:domains.safeHeaders});
  }
  if(action==='forward'){
    if(req.method!=='POST')return res.status(405).json({ok:false});
    if(String(req.query?.confirm||'')!=='coffeeandajoint-cutover-495')return res.status(400).json({ok:false,error:'confirmation token required'});
    const candidates=customerCandidates();
    for(const c of candidates){
      const test=await forwardCall(c.value,DOMAIN,'GET');
      if(!(test.ok||test.status===404))continue;
      const apex=await forwardCall(c.value,DOMAIN,'PUT');
      const www=await forwardCall(c.value,`www.${DOMAIN}`,'PUT');
      return res.status(200).json({ok:apex.ok&&www.ok,customerKey:c.key,target:TARGET,apex:{status:apex.status,ok:apex.ok},www:{status:www.status,ok:www.ok}});
    }
    return res.status(503).json({ok:false,error:'No usable GoDaddy customer ID found in runtime'});
  }
  if(action==='cleanup-vtest'){
    if(req.method!=='POST')return res.status(405).json({ok:false});
    const del=await gcall('DELETE',`https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/vtest`);
    return res.status(200).json({ok:del.ok,status:del.status});
  }
  return res.status(404).json({ok:false});
}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
