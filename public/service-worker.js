const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./assets/css/styles.css",
    "./assets/js/index.js",
    "./assets/js/db.js",
    "./assets/images/icons/icon-128x128.png",
    "./assets/images/icons/icon-144x144.png",
    "./assets/images/icons/icon-192x192.png",
    "./assets/images/icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME = "runtime-cache";

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });

self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
    if(
        evt.request.method !== 'GET' ||
        !evt.request.url.startsWith(self.location.origin)
    ) {
        evt.respondWtih(fetch(evt.request));
        return;
    }

    if(evt.request.url.includes('/api/transaction')) {
        evt.respondWtih(
            caches.open(RUNTIME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    cache.put(evt.request, response.clone());
                    return response;
                })
                .catch(() => caches.match(evt.request));
            })
        );
        return;
    }

    evt.respondWtih(
        caches.match(evt.request).then(cachedResponse => {
            if(cachedResponse) {
                return cachedResponse;
            }
            return caches.open(RUNTIME).then(cache => {
                return fetch(evt.request).then(response => {
                    return cache.put(evt.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});