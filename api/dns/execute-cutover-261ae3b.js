export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  return res.status(410).json({
    ok: false,
    disabled: true,
    message: 'One-time DNS cutover endpoint has been permanently disabled.'
  });
}
