const ZONE='coffeeandajoint.co';
const BASE='https://api.godaddy.com/v3/domains/zones';
const ORIGINAL_A=['15.197.148.33','3.33.130.190'];
const ORIGINAL_WWW='drugs-hat-shop.pricemedia82.chatgpt.site';
function headers(write=false){const token=process.env.GODADDY_PAT;if(!token)throw new Error('GODADDY_PAT missing');return{Authorization:`Bearer ${token}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})}}
async function call(url,options={}){const r=await fetch(url,{...options,headers:{...headers(Boolean(options.body)),...(options.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text};return{ok:r.ok,status:r.status,data}}
async function listAll(){const u=new URL(`${BASE}/${ZONE}/dns-records`);u.searchParams.set('pageSize','100');u.searchParams.set('totalRequired','true');const x=await call(u.toString());if(!x.ok)throw new Error(`list failed ${x.status}`);return Array.isArray(x.data?.items)?x.data.items:(Array.isArray(x.data)?x.data:[])}
async function del(id){return call(`${BASE}/${ZONE}/dns-records/${encodeURIComponent(id)}`,{method:'DELETE'})}
async function add(record){return call(`${BASE}/${ZONE}/dns-records`,{method:'POST',body:JSON.stringify(record)})}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(!['GET','POST'].includes(req.method))return res.status(405).json({ok:false});try{
 if(req.method==='GET'){const rows=await listAll();const relevant=rows.filter(r=>r.name==='@'||r.name==='www'||r.name==='restore-test'||String(r.name).startsWith('_openai')||String(r.name).startsWith('_redirect')).map(r=>({recordId:r.recordId,type:r.type,name:r.name,data:r.data,ttl:r.ttl}));return res.status(200).json({ok:true,zone:ZONE,relevant})}
 const rows=await listAll();const preserveSnapshot=rows.map(r=>({recordId:r.recordId,type:r.type,name:r.name,data:r.data,ttl:r.ttl}));
 const remove=rows.filter(r=>(r.type==='A'&&r.name==='@')||(r.type==='CNAME'&&r.name==='www')||(r.type==='CNAME'&&r.name==='restore-test')||String(r.name).startsWith('_redirect'));
 const deleted=[];for(const r of remove){if(!r.recordId)continue;const d=await del(r.recordId);deleted.push({type:r.type,name:r.name,data:r.data,status:d.status});if(!d.ok)throw new Error(`delete ${r.type} ${r.name} failed ${d.status}`)}
 const desired=[...ORIGINAL_A.map(data=>({type:'A',name:'@',data,ttl:600})),{type:'CNAME',name:'www',data:ORIGINAL_WWW,ttl:3600}];
 const created=[];for(const record of desired){const a=await add(record);created.push({record,status:a.status,data:a.data});if(!a.ok)throw new Error(`add ${record.type} ${record.name} failed ${a.status}`)}
 const finalRows=await listAll();const final=finalRows.filter(r=>r.name==='@'||r.name==='www'||String(r.name).startsWith('_openai')||String(r.name).startsWith('_redirect')||r.name==='restore-test').map(r=>({type:r.type,name:r.name,data:r.data,ttl:r.ttl}));
 const okA=ORIGINAL_A.every(ip=>final.some(r=>r.type==='A'&&r.name==='@'&&String(r.data).replace(/\.$/,'')===ip));const okW=final.some(r=>r.type==='CNAME'&&r.name==='www'&&String(r.data).replace(/\.$/,'')===ORIGINAL_WWW);const redirectsGone=!final.some(r=>String(r.name).startsWith('_redirect'));const verifyPreserved=final.some(r=>r.type==='TXT'&&r.name==='_openai-site-verification')&&final.some(r=>r.type==='TXT'&&r.name==='_openai-site-verification.www');
 return res.status(okA&&okW&&redirectsGone&&verifyPreserved?200:500).json({ok:okA&&okW&&redirectsGone&&verifyPreserved,zone:ZONE,deleted,created,checks:{original_apex_a:okA,original_www:okW,redirects_gone:redirectsGone,openai_verification_preserved:verifyPreserved},final});
 }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
