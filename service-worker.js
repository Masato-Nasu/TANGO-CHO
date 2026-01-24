// TANGO-CHO Service Worker (stable updates)
// Build: v17
const CACHE_NAME = "tango-cho-cache-v38.1.0";

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


const EXTERNAL_ASSETS = [
  "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"
];
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);

    // Cache critical cross-origin libraries for offline reliability (best-effort).
    for (const url of EXTERNAL_ASSETS) {
      try {
        await cache.add(url);
      } catch (e) {
        // Ignore failures (offline/blocked). The SW should still install.
      }
    }

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

  // Allowlist a small set of cross-origin static assets (offline support).
  const isExternalAllowed = EXTERNAL_ASSETS.includes(url.href);
  if (url.origin !== self.location.origin && !isExternalAllowed) return;

  const accept = event.request.headers.get("accept") || "";
  const isNav = event.request.mode === "navigate" || accept.includes("text/html");

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (isExternalAllowed) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const fresh = await fetch(event.request);
        if (fresh && fresh.ok) {
          try { await cache.put(event.request, fresh.clone()); } catch (_) {}
        }
        return fresh;
      } catch (err) {
        return cached || Response.error();
      }
    }

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
