const CUSTOMER='219348257';
const TARGET='https://www.coffeeandajoint.co/';
const API='https://api.godaddy.com/v2/customers';
const HOSTS=['coffeeandajoint.co','coffeeandjoint.co','www.coffeeandjoint.co'];

function headers(){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,'Content-Type':'application/json',Accept:'application/json'};
}

async function setPermanent(fqdn){
  const response=await fetch(`${API}/${CUSTOMER}/domains/forwards/${encodeURIComponent(fqdn)}`,{
    method:'PUT',
    headers:headers(),
    body:JSON.stringify({fqdn,type:'REDIRECT_PERMANENT',url:TARGET})
  });
  const text=await response.text();
  let data=null;
  try{data=text?JSON.parse(text):null}catch{data=text}
  return {fqdn,ok:response.ok,status:response.status,data};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  try{
    const results=await Promise.all(HOSTS.map(setPermanent));
    const ok=results.every(r=>r.ok);
    return res.status(ok?200:207).json({ok,target:TARGET,canonical:'www.coffeeandajoint.co',untouchedCanonicalHost:true,results});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
