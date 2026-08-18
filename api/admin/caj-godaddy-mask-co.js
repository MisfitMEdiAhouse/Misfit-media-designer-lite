const ZONE='coffeeandajoint.co';
const NAME='vtest';
const BASE='https://api.godaddy.com/v3/domains/zones';
function headers(){const token=process.env.GODADDY_PAT;if(!token)throw new Error('GODADDY_PAT missing');return{Authorization:`Bearer ${token}`,Accept:'application/json'}}
async function call(url,options={}){const r=await fetch(url,{...options,headers:{...headers(),...(options.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text};return{ok:r.ok,status:r.status,data}}
async function list(){const u=new URL(`${BASE}/${ZONE}/dns-records`);u.searchParams.set('name',NAME);u.searchParams.set('type','CNAME');u.searchParams.set('pageSize','100');u.searchParams.set('totalRequired','true');const x=await call(u.toString());if(!x.ok)throw new Error(`list failed ${x.status}`);return Array.isArray(x.data?.items)?x.data.items:(Array.isArray(x.data)?x.data:[])}
async function del(id){return call(`${BASE}/${ZONE}/dns-records/${encodeURIComponent(id)}`,{method:'DELETE'})}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(req.method!=='POST')return res.status(405).json({ok:false});try{const deleted=[];for(const r of await list())if(r.recordId){const d=await del(r.recordId);deleted.push({data:r.data,status:d.status});if(!d.ok)throw new Error(`delete failed ${d.status}`)}return res.status(200).json({ok:true,host:`${NAME}.${ZONE}`,deleted})}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
