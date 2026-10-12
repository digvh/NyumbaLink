// public/sw.js
// Service Worker for offline map tile caching

const CACHE_NAME = 'nyumbalink-tiles-v1';
const MAX_ENTRIES = 500;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache map tiles
  const isTile =
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('tile.opentopomap.org');

  if (!isTile) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try cache first
      const cached = await cache.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        if (response.ok) {
          // Clone before putting in cache
          cache.put(event.request, response.clone());
          // Trim cache size
          cache.keys().then((keys) => {
            if (keys.length > MAX_ENTRIES) {
              keys.slice(0, keys.length - MAX_ENTRIES).forEach((k) => cache.delete(k));
            }
          });
        }
        return response;
      } catch (err) {
        // Offline and not cached — return transparent tile
        return new Response(
          atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
          { headers: { 'Content-Type': 'image/gif' } }
        );
      }
    })
  );
});