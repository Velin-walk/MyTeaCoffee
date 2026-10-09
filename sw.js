// Strictly NO caching anytime - purge all existing caches and unregister
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});

self.addEventListener('fetch', e => {
  // Always fetch fresh from network, never use cache
  e.respondWith(fetch(e.request, { cache: 'no-store' }));
});

