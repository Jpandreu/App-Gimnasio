// Service worker: la app funciona sin conexión.
const VERSION = 'forja-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/app.css', './css/fonts.css',
  './fonts/Figtree.woff2', './fonts/BigShouldersDisplay.woff2',
  './js/app.js', './js/core.js', './js/coach.js', './js/ui.js',
  './js/data/exercises.js', './js/data/foods.js', './js/data/plans.js',
  './js/views/today.js', './js/views/train.js', './js/views/workout.js',
  './js/views/nutrition.js', './js/views/progress.js', './js/views/profile.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // Archivos propios: red primero (para recibir actualizaciones) y caché si no hay conexión
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
