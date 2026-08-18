const CUSTOMER='219348257';
const DOMAIN='coffeeandajoint.co';
const TARGET='https://misfit-media-designer-lite.vercel.app/coffee-restored';
const API='https://api.godaddy.com';

async function request(path,token,options={}){
  const r=await fetch(API+path,{...options,headers:{Authorization:`Bearer ${token}`,Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});
  const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:r.ok,status:r.status,data};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST')return res.status(405).json({ok:false});
  const token=process.env.GODADDY_PAT;
  if(!token)return res.status(503).json({ok:false,error:'godaddy_pat_missing'});
  try{
    const path=`/v2/customers/${CUSTOMER}/domains/forwards/${DOMAIN}`;
    const before=await request(path,token);
    const payload={fqdn:DOMAIN,type:'MASKED',url:TARGET,title:'coffee & a joint.',description:'DRUGS $45 · Marijuana $65 · Coffee & A Joint'};
    const put=await request(path,token,{method:'PUT',body:JSON.stringify(payload)});
    const after=await request(path,token);
    return res.status(put.ok?200:502).json({ok:put.ok,domain:DOMAIN,target:TARGET,before_status:before.status,put_status:put.status,put:put.data,after_status:after.status,after:after.data});
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
