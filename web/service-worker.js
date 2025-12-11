const CACHE_NAME = 'stabilis-shell-v1.1.4';
const SHELL_ASSETS = [
    '/',
    '/landing.html',
    '/index.html',
    '/executive-dashboard.html',
    '/turnaround.html',
    '/wellness.html',
    '/css/style.css',
    '/css/executive-dashboard.css',
    '/css/landing.css',
    '/css/ai-chat-component.css',
    '/js/app.js',
    '/js/data.js',
    '/js/auth.js',
    '/js/turnaround-data.js',
    '/js/turnaround-app.js',
    '/js/wellness-data.js',
    '/js/wellness-app.js',
    '/js/executive-dashboard.js',
    '/js/ai-copilot.js',
    '/js/edit-milestone.js',
    '/js/ai-chat-component.js'
];

// Network-first strategy for API calls, cache-first for static assets
const NETWORK_FIRST_URLS = ['/api/'];

self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching shell assets');
            return cache.addAll(SHELL_ASSETS);
        })
    );
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            );
        })
    );
    return self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Network-first for API calls
    if (NETWORK_FIRST_URLS.some(path => url.pathname.startsWith(path))) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache successful responses
                    if (response.ok) {
                        const cloned = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
                    }
                    return response;
                })
                .catch(error => {
                    console.log('[SW] Network failed for API:', url.pathname);
                    // Try to return cached version
                    return caches.match(request).then(cached => {
                        if (cached) {
                            return cached;
                        }
                        // Return a proper error response instead of undefined
                        return new Response(
                            JSON.stringify({ error: 'Network unavailable' }),
                            {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                // Return cached version, but update in background
                fetch(request).then(response => {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then(cache => cache.put(request, response));
                    }
                }).catch(() => {
                    // Silently fail background update - cached version is still valid
                });
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(request)
                .then(response => {
                    // Cache successful responses
                    if (response.ok) {
                        const cloned = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try to return landing page as fallback
                    return caches.match('/landing.html');
                });
        })
    );
});

// Handle messages from clients
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
