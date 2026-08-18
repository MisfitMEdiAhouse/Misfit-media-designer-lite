const CUSTOMER='219348257';
const ROOT='coffeeandajoint.co';
const WWW='www.coffeeandajoint.co';
const TARGET='https://misfit-media-designer-lite.vercel.app/caj-live';
const API='https://api.godaddy.com/v2/customers';
function h(write=false){const t=process.env.GODADDY_PAT;if(!t)throw new Error('GODADDY_PAT missing');return{Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})}}
async function req(method,fqdn,body){const r=await fetch(`${API}/${CUSTOMER}/domains/forwards/${fqdn}`,{method,headers:h(Boolean(body)),...(body?{body:JSON.stringify(body)}:{})});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text};return{ok:r.ok,status:r.status,data}}
async function setMasked(fqdn){return req('PUT',fqdn,{type:'MASKED',url:TARGET,mask:{title:'Coffee & A Joint',description:'DRUGS trucker $45 and Classic Herb Marijuana embroidered-patch trucker $65.',keywords:'coffee and a joint, drugs hat, classic herb, marijuana hat, trucker hat'}})}
export default async function handler(req0,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(req0.method!=='POST')return res.status(405).json({ok:false});try{const beforeRoot=await req('GET',ROOT);const beforeWww=await req('GET',WWW);const root=await setMasked(ROOT);const www=await setMasked(WWW);const afterRoot=await req('GET',ROOT);const afterWww=await req('GET',WWW);return res.status(root.ok&&www.ok?200:502).json({ok:root.ok&&www.ok,target:TARGET,beforeRoot,beforeWww,root,www,afterRoot,afterWww})}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
