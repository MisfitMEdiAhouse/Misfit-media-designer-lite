const BASE='https://api.godaddy.com/v3/domains/zones';
const ZONE='coffeeandajoint.co';
const REDIRECT_IP='45.55.126.223';
const HOME='https://misfit-media-designer-lite.vercel.app/caj-live';
const AFF='https://misfit-media-designer-lite.vercel.app/caj-affiliate';
function headers(write=false){const token=process.env.GODADDY_PAT;if(!token)throw new Error('GODADDY_PAT missing');return{Authorization:`Bearer ${token}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})}}
async function parse(r){const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text};return{ok:r.ok,status:r.status,data}}
async function read(type,name){const u=new URL(`${BASE}/${ZONE}/dns-records`);u.searchParams.set('type',type);u.searchParams.set('name',name);u.searchParams.set('pageSize','100');u.searchParams.set('totalRequired','true');return parse(await fetch(u,{headers:headers()}))}
async function remove(recordId){return parse(await fetch(`${BASE}/${ZONE}/dns-records/${encodeURIComponent(recordId)}`,{method:'DELETE',headers:headers()}))}
async function create(record){return parse(await fetch(`${BASE}/${ZONE}/dns-records`,{method:'POST',headers:headers(true),body:JSON.stringify(record)}))}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');if(req.method!=='POST')return res.status(405).json({ok:false});let stage='start';try{
 stage='read_apex_a';const apex=await read('A','@');if(!apex.ok)return res.status(502).json({ok:false,stage,upstream:apex});
 stage='read_root_redirect';const rt=await read('TXT','_redirect');if(!rt.ok)return res.status(502).json({ok:false,stage,upstream:rt});
 stage='read_www_a';const wa=await read('A','www');if(!wa.ok)return res.status(502).json({ok:false,stage,upstream:wa});
 stage='read_www_cname';const wc=await read('CNAME','www');if(!wc.ok)return res.status(502).json({ok:false,stage,upstream:wc});
 stage='read_www_redirect';const wt=await read('TXT','_redirect.www');if(!wt.ok)return res.status(502).json({ok:false,stage,upstream:wt});
 const items=x=>Array.isArray(x.data?.items)?x.data.items:(Array.isArray(x.data)?x.data:[]);const snapshot={apexA:items(apex),redirectTxt:items(rt),wwwA:items(wa),wwwCname:items(wc),wwwTxt:items(wt)};
 stage='delete_old';const deleted=[];for(const r of [...snapshot.apexA,...snapshot.redirectTxt,...snapshot.wwwA,...snapshot.wwwCname,...snapshot.wwwTxt]){if(!r.recordId)continue;const d=await remove(r.recordId);deleted.push({name:r.name,type:r.type,data:r.data,status:d.status});if(!d.ok)return res.status(502).json({ok:false,stage,snapshot,deleted,failed:d})}
 const desired=[{name:'@',type:'A',data:REDIRECT_IP,ttl:600},{name:'_redirect',type:'TXT',data:`Redirects from /affiliate to ${AFF}`,ttl:600},{name:'_redirect',type:'TXT',data:`Redirects from /r/* to ${HOME}?ref=*`,ttl:600},{name:'_redirect',type:'TXT',data:`Redirects to ${HOME}`,ttl:600},{name:'www',type:'CNAME',data:'alias.redirect.name',ttl:600},{name:'_redirect.www',type:'TXT',data:`Redirects from /affiliate to ${AFF}`,ttl:600},{name:'_redirect.www',type:'TXT',data:`Redirects from /r/* to ${HOME}?ref=*`,ttl:600},{name:'_redirect.www',type:'TXT',data:`Redirects to ${HOME}`,ttl:600}];
 stage='create_new';const created=[];for(const record of desired){const c=await create(record);created.push({record,status:c.status,data:c.data});if(!c.ok)return res.status(502).json({ok:false,stage,snapshot,deleted,created})}
 return res.status(200).json({ok:true,zone:ZONE,target:HOME,snapshot,deleted,created});
}catch(e){return res.status(500).json({ok:false,stage,error:String(e?.message||e),cause:e?.cause?String(e.cause):null})}}
