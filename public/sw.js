const STATIC_CACHE = 'planetai-static-v5';
const DATA_CACHE = 'planetai-data-v5';

const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

function isLiveJobDataRequest(url) {
  return (
    url.hostname.includes('remotive.com') ||
    url.hostname.includes('jobicy.com') ||
    url.pathname.endsWith('jobs.json')
  );
}

function isViteDevAsset(url) {
  return (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.searchParams.has('v') ||
    url.searchParams.has('t') ||
    url.searchParams.has('import')
  );
}

function shouldBypassCache(url) {
  return (
    url.hostname.includes('googlesyndication.com') ||
    url.hostname.includes('doubleclick.net') ||
    url.hostname.includes('google-analytics.com') ||
    isViteDevAsset(url)
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS).catch(() => Promise.resolve());
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const allowedCaches = new Set([STATIC_CACHE, DATA_CACHE]);
  event.waitUntil(
    caches.keys().then(async (keys) => {
      const staleKeys = keys.filter((key) => !allowedCaches.has(key));
      await Promise.all(staleKeys.map((key) => caches.delete(key)));
      await self.clients.claim();

      if (staleKeys.length > 0) {
        const windowClients = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        });
        for (const client of windowClients) {
          if ('navigate' in client) {
            client.navigate(client.url).catch(() => {});
          }
        }
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http') || shouldBypassCache(url)) {
    return;
  }

  // Network-first strategy for live ATS API calls & jobs.json
  if (isLiveJobDataRequest(url)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Network-first for HTML navigation so fresh Vite entrypoints & production hashes load immediately
  if (
    request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname === '/index.html'
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match('/index.html'))
        )
    );
    return;
  }

  // Only cache same-origin static production assets (icons, manifest, built /assets/*)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Cache-first strategy for static assets & app shell
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});
