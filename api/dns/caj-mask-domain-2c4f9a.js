const CUSTOMER='219348257';
const TARGET='https://www.coffeeandajoint.co/';
const API='https://api.godaddy.com/v2/customers';
const HOSTS=[
  'coffeeandajoint.co',
  'coffeeandjoint.co',
  'www.coffeeandjoint.co'
];

function headers(write=false){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {
    Authorization:`Bearer ${token}`,
    Accept:'application/json',
    ...(write?{'Content-Type':'application/json'}:{})
  };
}

async function call(method,fqdn,body){
  const response=await fetch(`${API}/${CUSTOMER}/domains/forwards/${encodeURIComponent(fqdn)}`,{
    method,
    headers:headers(Boolean(body)),
    ...(body?{body:JSON.stringify(body)}:{})
  });
  const text=await response.text();
  let data=null;
  try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:response.ok,status:response.status,data};
}

async function setPermanent(fqdn){
  return call('PUT',fqdn,{fqdn,type:'REDIRECT_PERMANENT',url:TARGET});
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  try{
    const results=[];
    for(const fqdn of HOSTS){
      const before=await call('GET',fqdn);
      const write=await setPermanent(fqdn);
      const after=await call('GET',fqdn);
      results.push({fqdn,before,write,after});
    }
    const ok=results.every(r=>r.write.ok);
    return res.status(ok?200:207).json({ok,target:TARGET,canonical:'www.coffeeandajoint.co',untouchedCanonicalHost:true,results});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
