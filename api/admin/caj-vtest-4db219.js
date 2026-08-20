const DOMAIN='coffeeandajoint.co';
const NAME='vtest';
const TARGET='cname.vercel-dns.com';
const PROJECT_ID='prj_nQVmclxNH0gBRnYt23XFQSofnuQI';
const TEAM_ID='team_7ZHStyjjCpAKFogk5jXp9gZo';
function gh(write=false){const t=process.env.GODADDY_PAT;if(!t) throw new Error('GODADDY_PAT missing');return {Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})};}
async function gcall(method,url,body){const r=await fetch(url,{method,headers:gh(method!=='GET'),...(body?{body:JSON.stringify(body)}:{})});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return {status:r.status,ok:r.ok,data};}
function vcandidates(){const preferred=['VERCEL_TOKEN','VERCEL_ACCESS_TOKEN','VERCEL_API_TOKEN','VERCEL_AUTH_TOKEN','VERCEL_PERSONAL_TOKEN','VERCEL_OIDC_TOKEN'];const discovered=Object.keys(process.env).filter(k=>/^VERCEL.*TOKEN$/i.test(k));return [...new Set([...preferred,...discovered])].filter(k=>process.env[k]);}
async function vone(key,path,opts={}){const t=process.env[key];const r=await fetch(`https://api.vercel.com${path}`,{...opts,headers:{Authorization:`Bearer ${t}`,Accept:'application/json',...(opts.body?{'Content-Type':'application/json'}:{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return {status:r.status,ok:r.ok,data,key};}
async function vcall(path,opts={}){const keys=vcandidates();if(!keys.length)return {status:503,ok:false,data:{error:'No Vercel token credential present'},attempts:[]};const attempts=[];let last=null;for(const key of keys){last=await vone(key,path,opts);attempts.push({key,status:last.status,ok:last.ok});if(last.ok)return {...last,attempts};if(last.status!==401&&last.status!==403)break;}return {...last,attempts};}
function validName(name){return name==='coffeeandajoint.co'||/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+coffeeandajoint\.co$/.test(name)}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');try{
 const action=String(req.query?.action||'godaddy-vtest');
 if(action==='vercel-auth'){
   const p=await vcall(`/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`);
   return res.status(200).json({ok:p.ok,status:p.status,credential:p.ok?p.key:null,attempts:p.attempts||[],project:p.ok?{id:p.data?.id,name:p.data?.name}:p.data});
 }
 if(action==='vercel-domain'){
   const name=String(req.query?.name||req.body?.name||'vtest.coffeeandajoint.co').toLowerCase().trim();
   if(!validName(name))return res.status(400).json({ok:false,error:'invalid domain'});
   if(req.method==='POST'){
     const gitBranch=String(req.query?.gitBranch||req.body?.gitBranch||'coffee-pages').trim();
     const vr=await vcall(`/v10/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}`,{method:'POST',body:JSON.stringify({name,gitBranch})});
     return res.status(200).json({ok:vr.ok,status:vr.status,credential:vr.ok?vr.key:null,attempts:vr.attempts||[],data:vr.data});
   }
   if(req.method==='DELETE'){
     const vr=await vcall(`/v9/projects/${PROJECT_ID}/domains/${encodeURIComponent(name)}?teamId=${TEAM_ID}`,{method:'DELETE'});
     return res.status(200).json({ok:vr.ok,status:vr.status,credential:vr.ok?vr.key:null,attempts:vr.attempts||[],data:vr.data});
   }
   return res.status(405).json({ok:false});
 }
 const base=`https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/${NAME}`;
 if(req.method==='POST'){
   const write=await gcall('PUT',base,[{data:TARGET,ttl:600}]);
   const read=await gcall('GET',base);
   return res.status(200).json({ok:write.ok&&read.ok,write,read,fqdn:`${NAME}.${DOMAIN}`,target:TARGET});
 }
 if(req.method==='DELETE'){
   const del=await gcall('DELETE',base);
   return res.status(200).json({ok:del.ok,del});
 }
 if(req.method==='GET'){
   const read=await gcall('GET',base);return res.status(200).json({ok:read.ok,read});
 }
 return res.status(405).json({ok:false});
}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
