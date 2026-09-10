// ==============================================================================
// BONDFIRE SERVICE WORKER
// Caches core application assets for instant load and offline resilience
// ==============================================================================

// ==============================================================================
// BONDFIRE SERVICE WORKER
// Caches core application assets for instant load and offline resilience
// ==============================================================================

const CACHE_NAME = 'bondfire-v3';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/output.css',
  '/css/tokens.css',
  '/css/base.css',
  '/css/components.css',
  '/css/modes.css',
  '/css/canvas-shader.css',
  '/css/book-3d.css',
  '/js/app.js',
  '/js/config.js',
  '/js/state/store.js',
  '/js/visuals/fluidCanvas.js',
  '/js/visuals/audioSynth.js',
  '/js/visuals/confetti.js',
  '/js/services/webrtcService.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ Pre-caching Bondfire v3 offline assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('⚡ Evicting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through non-GET requests or WebSocket connections
  if (event.request.method !== 'GET' || event.request.url.includes('/ws')) {
    return;
  }

  // Network-first strategy for HTML pages / navigation requests to prevent stale cached HTML
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
