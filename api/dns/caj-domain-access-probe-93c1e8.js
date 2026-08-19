const URLS=['https://coffeeandajoint.co/','https://www.coffeeandajoint.co/'];
async function inspect(base){
  const u=`${base}?__canonical_verify=${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const r=await fetch(u,{redirect:'follow',headers:{'cache-control':'no-cache','user-agent':'MisfitCanonicalVerifier/1.0'}});
  const body=await r.text();
  return {
    requested:base,
    status:r.status,
    finalUrl:r.url,
    length:body.length,
    hasHat:body.includes('THE DRUGS TRUCKER')&&body.includes('$45'),
    hasCrate:body.includes('MAKE LOVE.')&&body.includes('$199'),
    hasBundle:(body.includes('THE FULL BAD IDEA')||body.includes('BUY BOTH'))&&body.includes('234'),
    hasAuthorizedCrateImage:body.includes('authorized-crate-catalog'),
    hasClassicHerb:body.includes('CLASSIC HERB')
  };
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  try{
    const results=await Promise.all(URLS.map(inspect));
    return res.status(200).json({ok:results.every(x=>x.status===200&&x.hasHat&&x.hasCrate&&!x.hasClassicHerb),results});
  }catch(error){
    return res.status(500).json({ok:false,error:String(error?.message||error)});
  }
}
