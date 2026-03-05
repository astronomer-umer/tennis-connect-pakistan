// Tennis Connect Pakistan — Service Worker
// Network-first strategy with offline fallback

const CACHE_VERSION = "tcp-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const STATIC_ASSETS = [
  "/offline",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// ── Install ─────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== IMAGE_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API requests entirely — never cache them
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  // Image caching (picsum, randomuser)
  if (
    url.hostname === "picsum.photos" ||
    url.hostname === "randomuser.me" ||
    url.hostname === "images.unsplash.com"
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // For same-origin requests: always network first
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
});

// ── Strategies ────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Serve offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/offline") ?? new Response("Offline", { status: 503 });
    }
    return new Response("", { status: 503 });
  }
}
