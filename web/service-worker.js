const CACHE_NAME = 'stabilis-shell-v1';
const SHELL_ASSETS = [
  '/diversification/',
  '/diversification/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/data.js',
  '/js/auth.js',
  '/js/ai-copilot.js',
  '/js/edit-milestone.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(response => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match('/diversification/index.html'));
    })
  );
});
