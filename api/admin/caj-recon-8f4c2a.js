const DOMAIN='coffeeandajoint.co';
const GD='https://api.godaddy.com';
function auth(write=false){const t=process.env.GODADDY_PAT;if(!t) throw new Error('GODADDY_PAT missing');return {Authorization:`Bearer ${t}`,Accept:'application/json',...(write?{'Content-Type':'application/json'}:{})};}
async function j(url,opts={}){const r=await fetch(url,{...opts,headers:{...auth(Boolean(opts.method&&opts.method!=='GET')),...(opts.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}return {ok:r.ok,status:r.status,data};}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  try{
    const [detail,list,dnsV1,dnsV3]=await Promise.all([
      j(`${GD}/v1/domains/${DOMAIN}`),
      j(`${GD}/v1/domains?limit=100`),
      j(`${GD}/v1/domains/${DOMAIN}/records`),
      j(`${GD}/v3/domains/zones/${DOMAIN}/dns-records?pageSize=100&totalRequired=true`)
    ]);
    const d=detail.data||{};
    const listRows=Array.isArray(list.data)?list.data:(Array.isArray(list.data?.domains)?list.data.domains:[]);
    const match=listRows.find(x=>String(x.domain||x.name||'').toLowerCase()===DOMAIN)||{};
    const v1=Array.isArray(dnsV1.data)?dnsV1.data:[];
    const v3=Array.isArray(dnsV3.data?.records)?dnsV3.data.records:(Array.isArray(dnsV3.data)?dnsV3.data:[]);
    const norm=rows=>rows.map(x=>({id:x.recordId||x.id||null,type:x.type||null,name:x.name||null,data:x.data||x.value||null,ttl:x.ttl||null,priority:x.priority??null}));
    return res.status(200).json({
      ok:true,
      domain:{detail_status:detail.status,list_status:list.status,domain:d.domain||match.domain||DOMAIN,domainId:d.domainId||match.domainId||null,status:d.status||match.status||null,expires:d.expires||match.expires||null,renewAuto:d.renewAuto??match.renewAuto??null,nameServers:d.nameServers||match.nameServers||[],customerId:d.customerId||d.shopperId||match.customerId||match.shopperId||null,keys:Object.keys(d).sort()},
      dns_v1:{status:dnsV1.status,records:norm(v1)},
      dns_v3:{status:dnsV3.status,records:norm(v3),raw_keys:dnsV3.data&&typeof dnsV3.data==='object'?Object.keys(dnsV3.data):[]},
      fulfillment:{printful_token:Boolean(process.env.PRINTFUL_TOKEN||process.env.PRINTFUL_API_TOKEN||process.env.PRINTFUL_PAT),printful_store_id:Boolean(process.env.PRINTFUL_STORE_ID),printify_token:Boolean(process.env.PRINTIFY_TOKEN||process.env.PRINTIFY_API_TOKEN)}
    });
  }catch(e){return res.status(500).json({ok:false,error:String(e?.message||e)})}
}
