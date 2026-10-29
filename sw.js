/* Chronos3D service worker — offline shell, network-first for the app itself */
const CACHE = 'chronos3d-v6';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The app shell must never be pinned to an old build: fetch it from the
   network first and only fall back to the cached copy when offline. */
function networkFirst(req, key) {
  return fetch(req, { cache: 'no-store' })
    .then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(key || req, copy)).catch(() => {});
      }
      return res;
    })
    .catch(() =>
      caches.match(key || req).then((hit) => hit || caches.match('./index.html'))
    );
}

/* Everything else (icons, manifest) is served from cache instantly and
   refreshed in the background. */
function staleWhileRevalidate(req) {
  return caches.match(req).then((hit) => {
    const network = fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => hit);
    return hit || network;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isShell =
    req.mode === 'navigate' ||
    (sameOrigin && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')));

  if (isShell) {
    event.respondWith(networkFirst(req, sameOrigin ? './index.html' : null));
    return;
  }

  if (sameOrigin) {
    event.respondWith(staleWhileRevalidate(req));
  }
  /* cross-origin (fonts) is left to the browser so a slow CDN never blocks */
});
