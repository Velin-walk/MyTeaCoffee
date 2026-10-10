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
    const targetUrl = new URL(GOOGLE_SCRIPT_URL);
    for (const [key, val] of Object.entries(req.query)) {
      targetUrl.searchParams.set(key, val);
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
            memoryCache.set(cacheKey, text);
          }
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return res.status(200).send(text);
        }
      } catch (networkErr) {
        console.warn('[Proxy] Network fetch failed, checking memory cache:', networkErr.message);
        if (cacheKey && memoryCache.has(cacheKey)) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return res.status(200).send(memoryCache.get(cacheKey));
        }
        throw networkErr;
      }
    }

    if (req.method === 'POST') {
      let bodyData = req.body;
      if (typeof bodyData === 'object') {
        bodyData = JSON.stringify(bodyData);
      }
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
      return res.status(response.status).send(text);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[Proxy] Error forwarding request:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Failed to fetch from data source', message: err.message });
  }
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
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
