export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const has = (k) => Boolean(process.env[k]);
  return res.status(200).json({
    ok: true,
    godaddy_pat: has('GODADDY_PAT'),
    vercel_token: has('VERCEL_TOKEN'),
    vercel_access_token: has('VERCEL_ACCESS_TOKEN'),
    vercel_api_token: has('VERCEL_API_TOKEN'),
    cloudflare_api_token: has('CLOUDFLARE_API_TOKEN'),
    cloudflare_account_id: has('CLOUDFLARE_ACCOUNT_ID'),
    printful_api_token: has('PRINTFUL_API_TOKEN'),
    misfit_admin_api_key: has('MISFIT_ADMIN_API_KEY')
  });
}
