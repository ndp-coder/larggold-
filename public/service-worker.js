const CACHE_VERSION = 'v1';
const STATIC_CACHE = `larg-gold-static-${CACHE_VERSION}`;
const API_CACHE    = `larg-gold-api-${CACHE_VERSION}`;
const OFFLINE_URL  = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  OFFLINE_URL,
];

const API_PATTERNS = [
  /\/functions\/v1\/metal-rates/,
];

// ── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { cache: 'reload' })))
    ).then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => pattern.test(url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isStaticAsset(url) {
  return /\.(js|css|png|webp|jpg|jpeg|svg|woff2?|ico|json)(\?.*)?$/.test(url);
}

async function networkFirst(request, cacheName, ttlSeconds = 30) {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request.clone());
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      const body = await responseToCache.arrayBuffer();
      cache.put(request, new Response(body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers,
      }));
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      const cachedAt = cached.headers.get('sw-cached-at');
      if (cachedAt) {
        const age = (Date.now() - parseInt(cachedAt, 10)) / 1000;
        if (age > ttlSeconds * 60) {
          return cached;
        }
      }
      return cached;
    }
    return new Response(
      JSON.stringify({ error: 'Offline — cached rates unavailable' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Asset unavailable offline', { status: 503 });
  }
}

async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request) || await caches.match('/index.html');
    if (cached) return cached;
    const offlinePage = await caches.match(OFFLINE_URL);
    return offlinePage || new Response('<h1>You are offline</h1>', {
      headers: { 'Content-Type': 'text/html' },
      status: 503,
    });
  }
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  if (request.method !== 'GET') return;

  if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE, 5));
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
});

// ── Message ───────────────────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_API_CACHE') {
    caches.delete(API_CACHE);
  }
});
