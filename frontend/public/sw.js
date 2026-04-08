/**
 * Service Worker — PWA Offline Support
 * 
 * Caching strategy:
 *   - Cache-first for static assets (JS, CSS, fonts, images)
 *   - Network-first for navigation requests
 *   - Offline fallback page for failed navigations
 */

const CACHE_NAME = 'dev-walkie-talkie-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html',
];

// ─── Install Event ───────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// ─── Activate Event ──────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Delete old cache versions
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// ─── Fetch Event ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and WebSocket connections
  if (request.method !== 'GET') return;
  if (url.protocol === 'ws:' || url.protocol === 'wss:') return;

  // Skip cross-origin requests (like Google Fonts CDN — they handle their own caching)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      // For navigation requests: network-first with offline fallback
      if (request.mode === 'navigate') {
        try {
          const networkResponse = await fetch(request);
          // Cache the latest version
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch {
          // Offline: try cache, then fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('/offline.html');
        }
      }

      // For static assets: cache-first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(request);
        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // Return a basic offline response for non-navigation requests
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      }
    })()
  );
});
