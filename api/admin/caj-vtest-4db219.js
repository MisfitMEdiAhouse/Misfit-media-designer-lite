const DOMAIN='coffeeandajoint.co';
const NAME='vtest';
const TARGET='misfit-media-designer-lite.vercel.app';
function h(write=false){const t=process.env.GODADDY_PAT;if(!t) throw new Error('GODADDY_PAT missing');return {Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})};}
async function call(method,url,body){const r=await fetch(url,{method,headers:h(method!=='GET'),...(body?{body:JSON.stringify(body)}:{})});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return {status:r.status,ok:r.ok,data};}
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');try{
 const base=`https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/${NAME}`;
 if(req.method==='POST'){
   const write=await call('PUT',base,[{data:TARGET,ttl:600}]);
   const read=await call('GET',base);
   return res.status(200).json({ok:write.ok&&read.ok,write,read,fqdn:`${NAME}.${DOMAIN}`,target:TARGET});
 }
 if(req.method==='DELETE'){
   const del=await call('DELETE',base);
   return res.status(200).json({ok:del.ok,del});
 }
 if(req.method==='GET'){
   const read=await call('GET',base);return res.status(200).json({ok:read.ok,read});
 }
 return res.status(405).json({ok:false});
}catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}}
