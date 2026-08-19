const DOMAIN='coffeeandajoint.co';
const API=`https://api.godaddy.com/v1/domains/${DOMAIN}/records`;
const DESIRED={
  apex:[{data:'162.159.143.30',ttl:600},{data:'172.66.3.26',ttl:600}],
  www:[{data:'custom-domains.chatgpt.site',ttl:3600}]
};
function headers(){
  const token=process.env.GODADDY_PAT;
  if(!token) throw new Error('GODADDY_PAT missing');
  return {Authorization:`Bearer ${token}`,'Content-Type':'application/json',Accept:'application/json'};
}
async function request(method,path,body){
  const response=await fetch(`${API}${path}`,{method,headers:headers(),...(body?{body:JSON.stringify(body)}:{})});
  const text=await response.text();
  let data=null; try{data=text?JSON.parse(text):null}catch{data=text}
  return {ok:response.ok,status:response.status,data};
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  try{
    const [writeA,writeWww]=await Promise.all([
      request('PUT','/A/%40',DESIRED.apex),
      request('PUT','/CNAME/www',DESIRED.www)
    ]);
    const [afterA,afterWww]=await Promise.all([
      request('GET','/A/%40'),
      request('GET','/CNAME/www')
    ]);
    const ok=writeA.ok&&writeWww.ok&&afterA.ok&&afterWww.ok;
    return res.status(ok?200:207).json({ok,domain:DOMAIN,canonical:'https://www.coffeeandajoint.co/',desired:DESIRED,writeA,writeWww,afterA,afterWww});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
