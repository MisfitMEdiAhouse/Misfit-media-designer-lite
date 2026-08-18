const STORE='https://d-a-joint.printify.me';

function unescapeHtml(s=''){
  return s.replace(/\\u002F/gi,'/').replace(/\\\//g,'/').replace(/&amp;/g,'&').replace(/\\u0026/gi,'&');
}
function urlsFrom(text=''){
  const raw=unescapeHtml(text);
  const out=[];
  const re=/https?:\/\/[^\s"'<>\\]+/g;
  for(const m of raw.matchAll(re)){
    let u=m[0].replace(/[),;]+$/,'');
    if(!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(u) && !/(printify|mockup|image|cdn)/i.test(u)) continue;
    if(/logo|favicon|icon|avatar/i.test(u)) continue;
    out.push(u);
  }
  return [...new Set(out)];
}
function productLinks(text=''){
  const raw=unescapeHtml(text);
  const links=[];
  const re=/(?:href=)?["']([^"']*(?:product|products)[^"']*)["']/gi;
  for(const m of raw.matchAll(re)){
    let p=m[1];
    if(!/drugs|trucker|hat/i.test(p)) continue;
    try{links.push(new URL(p,STORE).href)}catch{}
  }
  return [...new Set(links)];
}
async function collect(){
  const h=await fetch(STORE,{headers:{'user-agent':'Mozilla/5.0 CoffeeAndAJointRestore/1.0','accept':'text/html'}});
  if(!h.ok) throw new Error(`store_${h.status}`);
  const home=await h.text();
  let urls=urlsFrom(home);
  const links=productLinks(home);
  for(const link of links.slice(0,3)){
    try{
      const r=await fetch(link,{headers:{'user-agent':'Mozilla/5.0 CoffeeAndAJointRestore/1.0','accept':'text/html'}});
      if(r.ok) urls.push(...urlsFrom(await r.text()));
    }catch{}
  }
  urls=[...new Set(urls)];
  // Prefer Printify/mockup CDN assets over generic page assets.
  urls.sort((a,b)=>Number(/mockup|images-api|printifycdn|images\.printify/i.test(b))-Number(/mockup|images-api|printifycdn|images\.printify/i.test(a)));
  return urls;
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
  try{
    const urls=await collect();
    if(req.query?.debug==='1') return res.status(200).json({ok:true,count:urls.length,urls:urls.slice(0,30)});
    const index=Math.max(0,Math.min(Number(req.query?.index||0)||0,urls.length-1));
    const src=urls[index];
    if(!src) return res.status(404).end('image_not_found');
    const r=await fetch(src,{headers:{'user-agent':'Mozilla/5.0 CoffeeAndAJointRestore/1.0'}});
    if(!r.ok) return res.redirect(302,src);
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type',r.headers.get('content-type')||'image/jpeg');
    res.setHeader('X-Coffee-Asset-Index',String(index));
    return res.status(200).send(buf);
  }catch(e){return res.status(502).end('asset_source_unavailable')}
}
