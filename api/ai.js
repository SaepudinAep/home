// Vercel Serverless Function — Proxy AI untuk Teaching Tools Hub
// Meneruskan panggilan dari browser ke Ollama / NVIDIA tanpa blokir CORS.
//
// Endpoint: POST /api/ai
// Body: { provider: 'ollama'|'nvidia', model, messages, temperature, max_tokens }
// Auth:  Authorization: Bearer <api-key>  (atau set OLLAMA_API_KEY / NVIDIA_API_KEY di env Vercel)
// Respons: { content: string, raw: object }

export default async function handler(req, res) {
  try {
    // ---- CORS ---------------------------------------------------------
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Gunakan metode POST' });
    }

    // ---- Baca body ----------------------------------------------------
    const raw = await readBody(req);
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch (e) { return res.status(400).json({ error: 'Body bukan JSON yang valid' }); }

    const provider = String(body.provider || 'ollama').toLowerCase();
    const model = String(body.model || '').trim();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const temperature = typeof body.temperature === 'number' ? body.temperature : 0.5;
    const max_tokens = parseInt(body.max_tokens, 10) || 8192;

    if (messages.length === 0) return res.status(400).json({ error: 'messages kosong' });

    // Key: prioritaskan dari header, fallback ke environment variable.
    const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();

    if (provider === 'ollama') {
      const apiKey = bearer || process.env.OLLAMA_API_KEY;
      if (!apiKey) return res.status(401).json({ error: 'Ollama API key tidak tersedia. Isi field API Key atau set OLLAMA_API_KEY.' });
      const p = await postJSON('https://api.ollama.com/api/chat', {
        model: model || 'gemma4:31b',
        messages,
        stream: false,
        options: { num_predict: max_tokens },
      }, apiKey);

      const data = await p.json().catch(() => ({}));
      const content = (data && data.message && typeof data.message.content === 'string') ? data.message.content : '';
      return res.status(p.ok ? 200 : (data.status || p.status || 500)).json({ content, raw: data });
    }

    if (provider === 'nvidia') {
      const apiKey = bearer || process.env.NVIDIA_API_KEY;
      if (!apiKey) return res.status(401).json({ error: 'NVIDIA API key tidak tersedia. Isi field API Key atau set NVIDIA_API_KEY.' });
      const p = await postJSON('https://integrate.api.nvidia.com/v1/chat/completions', {
        model: model || 'google/gemma-3-12b-it',
        messages,
        temperature,
        max_tokens,
      }, apiKey);

      const data = await p.json().catch(() => ({}));
      const content = (data && data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') ? data.choices[0].message.content : '';
      return res.status(p.ok ? 200 : (data.status || p.status || 500)).json({ content, raw: data });
    }

    return res.status(400).json({ error: 'Provider tidak dikenal. Gunakan "ollama" atau "nvidia".' });
  } catch (err) {
    console.error('proxy-error', err);
    return res.status(500).json({ error: (err && err.message) || 'Terjadi kesalahan pada server proxy.' });
  }
}

// ---- Helpers ----------------------------------------------------------
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 2_000_000) req.destroy(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function postJSON(url, payload, apiKey) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(55000),
  });
}