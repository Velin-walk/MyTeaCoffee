const SHELL_CACHE = 'studyflow-shell-v1';
const RUNTIME_CACHE = 'studyflow-runtime-v1';

const APP_SHELL_URLS = [
  '/',
  '/forest',
  '/forest.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/css/style.css',
  '/css/forest.css',
  '/css/quotes.css',
  '/js/config.js',
  '/js/storage.js',
  '/js/log-queue.js',
  '/js/charts.js',
  '/js/timer.js',
  '/js/forest-diorama.js',
  '/js/forest-tab.js',
  '/js/forest.js',
  '/js/quotes.js',
  '/js/pwa.js',
  '/plants/rhododendron.js',
  '/plants/peepal.js',
  '/plants/banyan.js',
  '/plants/sal.js',
  '/plants/pine.js',
  '/plants/mugwort.js',
  '/plants/bamboo.js',
  '/plants/nettle.js',
  '/plants/lotus.js',
  '/plants/marigold.js',
  '/plants/sunakhari.js',
  '/plants/sunpati.js',
  '/plants/suntala.js',
  '/plants/jacaranda.js',
  '/plants/registry.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      Promise.allSettled(
        APP_SHELL_URLS.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => {
              if (res && res.ok) {
                return cache.put(url, res);
              }
            })
            .catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const validCaches = new Set([SHELL_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !validCaches.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!req || req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept backend API proxy or direct Google Apps Script calls
  if (url.pathname.startsWith('/api/') || url.hostname === 'script.google.com' || url.hostname === 'script.googleusercontent.com') {
    return;
  }

  // Cache Google Charts library scripts/CSS opportunistically so offline charts load when previously cached
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/charts/')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, clone)).catch(() => null);
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Same-origin shell/static assets: network-first with offline cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(req, clone)).catch(() => null);
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req, { ignoreSearch: false }) || await caches.match(url.pathname);
          if (cached) return cached;
          if (req.mode === 'navigate') {
            if (url.pathname.startsWith('/forest')) {
              return (await caches.match('/forest')) || (await caches.match('/forest.html')) || caches.match('/');
            }
            return caches.match('/');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
  }
});
