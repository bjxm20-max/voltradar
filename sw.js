const CACHE = 'voltradar-v1';
const ASSETS = [
  '/voltradar/',
  '/voltradar/index.html',
  '/voltradar/manifest.json',
  '/voltradar/icon-192.png',
  '/voltradar/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only handle same-origin or CDN requests
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
