// TANGO-CHO Service Worker (stable updates)
// Build: v16
const CACHE_NAME = "tango-cho-cache-v37.7.12-v38";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./bank_enja.js",
  "./vocab_pool.js",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./share-target.html",
  "./icons/icon-192-v26.png",
  "./icons/icon-512-v26.png",
  "./icons/apple-touch-icon-v26.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    // Always advance quickly to avoid being stuck on broken cached JS.
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Only handle same-origin requests (GitHub Pages). Cross-origin (HF/DeepL) pass-through.
  if (url.origin !== self.location.origin) return;

  const accept = event.request.headers.get("accept") || "";
  const isNav = event.request.mode === "navigate" || accept.includes("text/html");

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (isNav) {
      // Network-first for HTML to prevent stale index.html from pinning old JS.
      try {
        const fresh = await fetch(new Request(event.request.url, { cache: "no-store" }));
        if (fresh && fresh.ok) {
          // Normalize to index.html for reliable fallback.
          await cache.put("./index.html", fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cached = await cache.match("./index.html");
        return cached || Response.error();
      }
    }

    // Cache-first for other same-origin assets (ignore query for versioned URLs).
    const normalizedKey = url.pathname;
    const cached = (await cache.match(normalizedKey, { ignoreSearch: true })) || (await cache.match(event.request, { ignoreSearch: true }));
    if (cached) return cached;

    try {
      const fresh = await fetch(event.request);
      if (fresh && fresh.ok) {
        try {
          await cache.put(normalizedKey, fresh.clone());
        } catch (_) {
          // Fallback (some browsers require Request objects)
          await cache.put(event.request, fresh.clone());
        }
      }
      return fresh;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});
