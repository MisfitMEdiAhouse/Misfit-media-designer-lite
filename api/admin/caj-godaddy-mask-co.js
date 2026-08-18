const ZONE='coffeeandajoint.co';
const HOST='restore-test';
const TXT='_redirect.restore-test';
const TEST_URL='https://restore-test.coffeeandajoint.co/';
const TARGET='http://raw.githack.com/MisfitMEdiAhouse/Misfit-media-designer-lite/main/public/coffee-restored.html';
const BASE='https://api.godaddy.com/v3/domains/zones';
function headers(write=false){const token=process.env.GODADDY_PAT;if(!token)throw new Error('GODADDY_PAT missing');return{Authorization:`Bearer ${token}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})}}
async function call(url,options={}){const r=await fetch(url,{...options,headers:{...headers(Boolean(options.body)),...(options.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text};return{ok:r.ok,status:r.status,data}}
async function list(name,type){const u=new URL(`${BASE}/${ZONE}/dns-records`);u.searchParams.set('name',name);u.searchParams.set('type',type);u.searchParams.set('pageSize','100');u.searchParams.set('totalRequired','true');const x=await call(u.toString());if(!x.ok)throw new Error(`list failed ${x.status}`);return Array.isArray(x.data?.items)?x.data.items:(Array.isArray(x.data)?x.data:[])}
async function del(id){return call(`${BASE}/${ZONE}/dns-records/${encodeURIComponent(id)}`,{method:'DELETE'})}
async function add(record){return call(`${BASE}/${ZONE}/dns-records`,{method:'POST',body:JSON.stringify(record)})}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(!['GET','POST'].includes(req.method))return res.status(405).json({ok:false});try{
 if(req.method==='GET'){try{const r=await fetch(TEST_URL+'?__v='+Date.now(),{redirect:'manual',headers:{'Cache-Control':'no-cache','User-Agent':'MisfitCoffeeProxyVerify/5.0'}});const text=await r.text();return res.status(200).json({ok:r.ok,status:r.status,location:r.headers.get('location'),has_drugs:text.includes('THE DRUGS TRUCKER')&&text.includes('$45'),has_marijuana:text.includes('CLASSIC HERB MARIJUANA')&&text.includes('$65'),has_crate:/crate|\$199|DROP 002|MAKE LOVE\. NOT WAR/i.test(text),body_start:text.slice(0,200)})}catch(e){return res.status(200).json({ok:false,error:String(e?.message||e),cause:e?.cause?String(e.cause):null})}}
 const c=await list(HOST,'CNAME'),t=await list(TXT,'TXT');for(const r of [...c,...t])if(r.recordId){const d=await del(r.recordId);if(!d.ok)throw new Error(`delete test record failed ${d.status}`)}
 const cname=await add({name:HOST,type:'CNAME',data:'proxy.txtd.io',ttl:600});const txt=await add({name:TXT,type:'TXT',data:`v=txtv0;type=proxy;to=${TARGET}`,ttl:600});return res.status(cname.ok&&txt.ok?200:502).json({ok:cname.ok&&txt.ok,host:`${HOST}.${ZONE}`,target:TARGET,cname_status:cname.status,txt_status:txt.status});
 }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
