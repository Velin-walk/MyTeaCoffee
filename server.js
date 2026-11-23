import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_SCRIPT_URL = process.env.WEB_APP_URL || "https://script.google.com/macros/s/AKfycbwXOTn__dyqNI-8JvsTPEGtC4OPJYuC9-_jqIlq-lutQZDeQzlmM-46XwWAmWYQu8mT/exec";

// In-memory cache for GET responses
const memoryCache = new Map();

// Enable body parsing for JSON and text payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// Disable cache headers globally for all requests
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

function isHtmlErrorResponse(contentType, text) {
  const ct = String(contentType || '').toLowerCase();
  const body = String(text || '').trim();
  return ct.includes('text/html') || body.startsWith('<!') || body.startsWith('<html');
}

// Serve runtime config with server proxy enabled for any hostname running server.js
app.get('/js/config.js', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'js', 'config.js');
    const source = fs.readFileSync(configPath, 'utf8');
    const injected = `window.__STUDY_FLOW_CONFIG__ = ${JSON.stringify({
      directGasUrl: GOOGLE_SCRIPT_URL,
      proxyUrl: '/api/data',
      proxyEnabled: true
    })};\n`;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.status(200).send(injected + source);
  } catch (err) {
    console.error('[Config] Failed to serve /js/config.js:', err.message);
    return res.status(500).send('// Failed to load config');
  }
});

// Server-side proxy for Google Apps Script data API to avoid iframe CORS/redirect fetch errors
app.all(['/api/data', '/api/proxy'], async (req, res) => {
  try {
    const customUrl = req.query.customUrl || req.headers['x-custom-gas-url'];
    const baseScriptUrl = (customUrl && typeof customUrl === 'string' && customUrl.startsWith('http')) ? customUrl : GOOGLE_SCRIPT_URL;
    const targetUrl = new URL(baseScriptUrl);

    for (const [key, val] of Object.entries(req.query)) {
      if (key !== 'customUrl') {
        targetUrl.searchParams.set(key, val);
      }
    }

    const cacheKey = req.method === 'GET' ? targetUrl.toString() : null;

    if (req.method === 'GET') {
      try {
        const response = await fetch(targetUrl.toString(), {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json, text/plain, */*'
          }
        });

        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (response.ok && text && !isHtmlErrorResponse(contentType, text)) {
          if (cacheKey) {
            if (memoryCache.size >= 200) memoryCache.delete(memoryCache.keys().next().value);
            memoryCache.set(cacheKey, text);
          }
          return res.status(200).send(text);
        }

        const errMsg = `Upstream returned status ${response.status}`;
        if (cacheKey && memoryCache.has(cacheKey)) {
          res.setHeader('X-Proxy-Cache', 'stale');
          res.setHeader('X-Backend-Error', errMsg);
          return res.status(200).send(memoryCache.get(cacheKey));
        }

        return res.status(502).json({ error: 'Upstream backend failure', status: response.status, message: errMsg });
      } catch (networkErr) {
        console.warn('[Proxy] Network fetch failed:', networkErr.message);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (cacheKey && memoryCache.has(cacheKey)) {
          res.setHeader('X-Proxy-Cache', 'stale');
          res.setHeader('X-Backend-Error', networkErr.message);
          return res.status(200).send(memoryCache.get(cacheKey));
        }
        return res.status(502).json({ error: 'Upstream backend unreachable', message: networkErr.message });
      }
    }

    if (req.method === 'POST') {
      let bodyData = req.body;
      if (typeof bodyData === 'object') {
        bodyData = JSON.stringify(bodyData);
      }
      try {
        const response = await fetch(targetUrl.toString(), {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          },
          body: bodyData || '{}'
        });
        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (!response.ok || isHtmlErrorResponse(contentType, text)) {
          return res.status(502).json({ error: 'Upstream POST failed', status: response.status });
        }
        return res.status(200).send(text);
      } catch (postErr) {
        console.warn('[Proxy] POST fetch failed:', postErr.message);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(502).json({ error: 'Upstream POST unreachable', message: postErr.message });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[Proxy] Error forwarding request:', err);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Proxy internal error', message: err.message });
  }
});

// Never serve server/config files as static assets
const BLOCKED_FILES = new Set(['/server.js', '/package.json', '/package-lock.json', '/metadata.json', '/wrangler.jsonc', '/bun.lock', '/readme.md']);
app.use((req, res, next) => {
  if (BLOCKED_FILES.has(req.path.toLowerCase())) return res.status(404).send('Not found');
  next();
});

// Serve static assets with strict no-cache
app.use(express.static(__dirname, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Ensure manifest.json and Manifest.json can both be requested
app.get(['/manifest.json', '/Manifest.json'], (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Dedicated Forest App route
app.get('/forest', (req, res) => {
  res.sendFile(path.join(__dirname, 'forest.html'));
});

// Single Page Application fallback to index.html
app.get('*', (req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Not found');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
