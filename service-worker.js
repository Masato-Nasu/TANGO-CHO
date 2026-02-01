/* TANGO-CHO Service Worker (stable updates)
 * Build: v47.0.9
 */
const CACHE_NAME = "tango-cho-cache-v47.0.9";

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
  "./data/pos_noun.txt",
  "./data/pos_verb.txt",
  "./data/pos_adj.txt",
  "./data/pos_adv.txt",
  "./data/WORDNET_LICENSE.txt",
];

// Allowlist a small set of cross-origin static assets (offline support).
const EXTERNAL_ASSETS = [
  "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);

    // Cache critical cross-origin libraries for offline reliability (best-effort).
    for (const url of EXTERNAL_ASSETS) {
      try { await cache.add(url); } catch (_) {}
    }

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

  const isExternalAllowed = EXTERNAL_ASSETS.includes(url.href);
  if (url.origin !== self.location.origin && !isExternalAllowed) return;

  const accept = event.request.headers.get("accept") || "";
  const isNav = event.request.mode === "navigate" || accept.includes("text/html");

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // External allowlisted assets: cache-first.
    if (isExternalAllowed) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const fresh = await fetch(event.request);
        if (fresh && fresh.ok) cache.put(event.request, fresh.clone());
        return fresh;
      } catch (_) {
        return cached || Response.error();
      }
    }

    // HTML navigation: network-first (so updates apply), fallback to cache.
    if (isNav) {
      try {
        const fresh = await fetch(event.request);
        if (fresh && fresh.ok) cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match("./index.html")) || Response.error();
      }
    }

    // Static assets: cache-first, fallback to network.
    const cached = await cache.match(event.request);
    if (cached) return cached;

    try {
      const fresh = await fetch(event.request);
      if (fresh && fresh.ok) cache.put(event.request, fresh.clone());
      return fresh;
    } catch (_) {
      return Response.error();
    }
  })());
});
