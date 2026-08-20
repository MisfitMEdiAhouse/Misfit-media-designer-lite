export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='GET') return res.status(405).json({ok:false});
  const names=Object.keys(process.env).filter(k=>/(GITHUB|GH_|GIT_TOKEN|PAT)/i.test(k)).sort();
  const present={};
  for(const k of names) present[k]=Boolean(process.env[k]);
  return res.status(200).json({ok:true,keys:names,present});
}
