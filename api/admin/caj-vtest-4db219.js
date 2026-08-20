const DOMAIN='coffeeandajoint.co';
const TARGET='https://misfit-media-designer-lite-git-co-b746a4-misfit-medias-projects.vercel.app/';
const REDIRECT_IP='45.55.126.223';
const REDIRECT_CNAME='alias.redirect.name';
const CONFIRM='caj-495-cutover-20260820';
function gh(write=false){const t=process.env.GODADDY_PAT;if(!t) throw new Error('GODADDY_PAT missing');return {Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})};}
async function gcall(method,url,body){const r=await fetch(url,{method,headers:gh(method!=='GET'),...(body!==undefined?{body:JSON.stringify(body)}:{})});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return {status:r.status,ok:r.ok,data};}
const recordUrl=(type,name)=>`https://api.godaddy.com/v1/domains/${DOMAIN}/records/${type}/${encodeURIComponent(name)}`;
async function put(type,name,data,ttl=600){return gcall('PUT',recordUrl(type,name),[{data,ttl}]);}
async function del(type,name){return gcall('DELETE',recordUrl(type,name));}
async function get(type,name){return gcall('GET',recordUrl(type,name));}
function authorized(req){return String(req.query?.confirm||'')===CONFIRM;}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');try{
 const action=String(req.query?.action||'status');
 if(action==='status'){
   const [apex,www,vtest]=await Promise.all([get('A','@'),get('CNAME','www'),get('CNAME','vtest')]);
   return res.status(200).json({ok:true,target:TARGET,apex:{status:apex.status,data:apex.data},www:{status:www.status,data:www.data},vtest:{status:vtest.status,data:vtest.data}});
 }
 if(req.method!=='POST')return res.status(405).json({ok:false});
 if(!authorized(req))return res.status(403).json({ok:false,error:'confirmation required'});
 if(action==='test-redirect'){
   const cname=await put('CNAME','vtest',REDIRECT_CNAME,600);
   const txt=await put('TXT','_redirect.vtest',`Redirects to ${TARGET}`,600);
   const [cnameRead,txtRead]=await Promise.all([get('CNAME','vtest'),get('TXT','_redirect.vtest')]);
   return res.status(200).json({ok:cname.ok&&txt.ok,target:TARGET,cname:{status:cname.status,ok:cname.ok,read:cnameRead.data},txt:{status:txt.status,ok:txt.ok,read:txtRead.data}});
 }
 if(action==='cutover'){
   const steps=[];
   const apex=await put('A','@',REDIRECT_IP,600);steps.push(['apex_redirect',apex.status,apex.ok]);
   const www=await put('CNAME','www',REDIRECT_CNAME,600);steps.push(['www_redirect',www.status,www.ok]);
   const apexTxt=await put('TXT','_redirect',`Redirects to ${TARGET}`,600);steps.push(['apex_rule',apexTxt.status,apexTxt.ok]);
   const wwwTxt=await put('TXT','_redirect.www',`Redirects to ${TARGET}`,600);steps.push(['www_rule',wwwTxt.status,wwwTxt.ok]);
   for(const [type,name] of [['TXT','_openai-site-verification'],['TXT','_openai-site-verification.www'],['TXT','_cf-custom-hostname'],['TXT','_cf-custom-hostname.www']]){
     const r=await del(type,name);steps.push([`remove_${name}`,r.status,r.ok||r.status===404]);
   }
   const allOk=steps.every(x=>x[2]);
   const [apexRead,wwwRead,apexRule,wwwRule]=await Promise.all([get('A','@'),get('CNAME','www'),get('TXT','_redirect'),get('TXT','_redirect.www')]);
   return res.status(200).json({ok:allOk,target:TARGET,steps,verify:{apex:apexRead.data,www:wwwRead.data,apexRule:apexRule.data,wwwRule:wwwRule.data}});
 }
 if(action==='cleanup-test'){
   const a=await del('CNAME','vtest');const b=await del('TXT','_redirect.vtest');
   return res.status(200).json({ok:(a.ok||a.status===404)&&(b.ok||b.status===404),cname:a.status,txt:b.status});
 }
 return res.status(404).json({ok:false});
}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
