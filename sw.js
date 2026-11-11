const CACHE_NAME = 'aung-gas-pos-v1';
const ASSETS = [
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/db.js',
  './js/dashboard.js',
  './js/sales.js',
  './js/products.js',
  './js/inventory.js',
  './js/cylinders.js',
  './js/oxygen.js',
  './js/customers.js',
  './js/expenses.js',
  './js/reports.js',
  './js/backup.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
