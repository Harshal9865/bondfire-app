// ==============================================================================
// BONDFIRE SERVICE WORKER (v26)
// Network-first for dynamic code and navigation, with resilient offline fallback
// ==============================================================================

const CACHE_NAME = 'bondfire-v26';
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
  '/js/components/gateScreen.js',
  '/js/components/roomsHubScreen.js',
  '/js/components/gameCountdownOverlay.js',
  '/js/visuals/fluidCanvas.js',
  '/js/visuals/audioSynth.js',
  '/js/visuals/confetti.js',
  '/js/services/webrtcService.js',
  '/assets/cyber_gate_scene.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ Pre-caching Bondfire v6 offline assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => console.warn('Pre-cache notice:', err));
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
  if (event.request.method !== 'GET' || event.request.url.includes('/ws') || event.request.url.includes('supabase.co')) {
    return;
  }

  // Network-first strategy for HTML pages, navigation requests, and JavaScript files
  // This guarantees users always receive the latest live updates without black-screen cache bugs
  const isCodeOrDocument =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    event.request.destination === 'script' ||
    event.request.url.endsWith('.js');

  if (isCodeOrDocument) {
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

  // Stale-while-revalidate for images, fonts, and stylesheets
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
