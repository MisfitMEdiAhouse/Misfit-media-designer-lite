const DOMAIN='coffeeandajoint.co';
const BASE='https://api.godaddy.com/v3/domains/zones';
const REDIRECT_IP='45.55.126.223';
const HOME='https://misfit-media-designer-lite.vercel.app/caj-live';
const AFF='https://misfit-media-designer-lite.vercel.app/caj-affiliate';
function h(write=false){const t=process.env.GODADDY_PAT;if(!t)return null;return{Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})}}
async function call(path,opts={}){const r=await fetch(`https://api.godaddy.com${path}`,{...opts,headers:{...h(Boolean(opts.body)),...(opts.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return{ok:r.ok,status:r.status,data}}
async function list(name,type){const q=new URLSearchParams({pageSize:'100',totalRequired:'true',name});if(type)q.set('type',type);const x=await call(`${BASE}/${DOMAIN}/dns-records?${q}`);if(!x.ok)throw new Error(`list ${name} ${type||''} ${x.status}`);return Array.isArray(x.data?.items)?x.data.items:(Array.isArray(x.data)?x.data:[])}
async function del(id){return call(`${BASE}/${DOMAIN}/dns-records/${encodeURIComponent(id)}`,{method:'DELETE'})}
async function add(record){return call(`${BASE}/${DOMAIN}/dns-records`,{method:'POST',body:JSON.stringify(record)})}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(req.method!=='POST')return res.status(405).json({ok:false});if(!process.env.GODADDY_PAT)return res.status(503).json({ok:false,error:'GODADDY_PAT missing'});try{
 const apexA=await list('@','A'); const redirectTxt=await list('_redirect','TXT'); const wwwA=await list('www','A'); const wwwC=await list('www','CNAME'); const wwwTxt=await list('_redirect.www','TXT');
 const snapshot={apexA,redirectTxt,wwwA,wwwC,wwwTxt}; const deleted=[];
 for(const r of [...apexA,...redirectTxt,...wwwA,...wwwC,...wwwTxt]){if(!r.recordId)continue;const d=await del(r.recordId);deleted.push({name:r.name,type:r.type,data:r.data,status:d.status});if(!d.ok)throw new Error(`delete ${r.name}/${r.type} ${d.status}`)}
 const records=[
  {name:'@',type:'A',data:REDIRECT_IP,ttl:600},
  {name:'_redirect',type:'TXT',data:`Redirects from /affiliate to ${AFF}`,ttl:600},
  {name:'_redirect',type:'TXT',data:`Redirects from /r/* to ${HOME}?ref=*`,ttl:600},
  {name:'_redirect',type:'TXT',data:`Redirects to ${HOME}`,ttl:600},
  {name:'www',type:'CNAME',data:'alias.redirect.name',ttl:600},
  {name:'_redirect.www',type:'TXT',data:`Redirects from /affiliate to ${AFF}`,ttl:600},
  {name:'_redirect.www',type:'TXT',data:`Redirects from /r/* to ${HOME}?ref=*`,ttl:600},
  {name:'_redirect.www',type:'TXT',data:`Redirects to ${HOME}`,ttl:600}
 ];
 const created=[];for(const r of records){const a=await add(r);created.push({record:r,status:a.status,data:a.data});if(!a.ok)throw new Error(`add ${r.name}/${r.type} ${a.status}: ${JSON.stringify(a.data).slice(0,240)}`)}
 return res.status(200).json({ok:true,domain:DOMAIN,target:HOME,snapshot,deleted,created});
}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
