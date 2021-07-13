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
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });