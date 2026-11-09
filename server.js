import express from 'express';
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

// Server-side proxy for Google Apps Script data API to avoid iframe CORS/redirect fetch errors
app.all(['/api/data', '/api/proxy'], async (req, res) => {
  try {
    const customUrl = req.query.customUrl;
    const baseScriptUrl = (customUrl && customUrl.startsWith('http')) ? customUrl : GOOGLE_SCRIPT_URL;
    const targetUrl = new URL(baseScriptUrl);

    for (const [key, val] of Object.entries(req.query)) {
      if (key !== 'customUrl') {
        targetUrl.searchParams.set(key, val);
      }
    }

    const cacheKey = req.method === 'GET' ? targetUrl.search : null;

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

        if (response.ok) {
          const text = await response.text();
          if (cacheKey && text) {
            if (memoryCache.size >= 200) memoryCache.delete(memoryCache.keys().next().value);
            memoryCache.set(cacheKey, text);
          }
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return res.status(200).send(text);
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (cacheKey && memoryCache.has(cacheKey)) {
          return res.status(200).send(memoryCache.get(cacheKey));
        }
        const action = req.query.action;
        const defaultFallback = action === 'getGoalData' ? { current: 0, goal: 4 } : action === 'getGoal' ? { goal: 4 } : [];
        return res.status(200).json(defaultFallback);
      } catch (networkErr) {
        console.warn('[Proxy] Network fetch failed, checking memory cache:', networkErr.message);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (cacheKey && memoryCache.has(cacheKey)) {
          return res.status(200).send(memoryCache.get(cacheKey));
        }
        const action = req.query.action;
        const defaultFallback = action === 'getGoalData' ? { current: 0, goal: 4 } : action === 'getGoal' ? { goal: 4 } : [];
        return res.status(200).json(defaultFallback);
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
        const text = await response.text();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send(text);
      } catch (postErr) {
        console.warn('[Proxy] POST fetch failed:', postErr.message);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send('Queued');
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[Proxy] Error forwarding request:', err);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json([]);
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
