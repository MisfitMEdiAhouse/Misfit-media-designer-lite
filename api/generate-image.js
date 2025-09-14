// /api/generate-image.js
// Vercel Node Serverless Function – generates an image with OpenAI and returns a data URL.

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Body should be JSON: { prompt: "..." }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = body.prompt?.trim();
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY in Vercel env' });
    }

    // OpenAI Images API
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024'
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: text });
    }

    const data = await resp.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ error: 'No image returned from model' });
    }

    // Return a data URL so the client can place it on canvas directly
    return res.status(200).json({ dataUrl: `data:image/png;base64,${b64}` });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Unexpected server error' });
  }
}
