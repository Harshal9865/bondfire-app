// ==============================================================================
// BONDFIRE SERVICE WORKER
// Caches core application assets for instant load and offline resilience
// ==============================================================================

const CACHE_NAME = 'bondfire-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
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
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ Pre-caching Bondfire offline assets');
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
            console.log('Cleaning obsolete cache:', key);
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset and update in background (Stale-While-Revalidate)
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
