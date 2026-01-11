const CACHE = "tango-cho-cache-v3.6.3-root";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./share-target.html",
  "./icons/apple-touch-icon-v26.png",
  "./icons/icon-192-v26.png",
  "./icons/icon-512-v26.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null))))
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  // For navigations (including start_url with query), ignore the query string and fall back to cached index.html.
  if (sameOrigin && (e.request.mode === "navigate" || (e.request.headers.get("accept") || "").includes("text/html"))) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);

      try {
        // Try network first so updates show up when online.
        const fresh = await fetch(e.request);
        if (fresh && fresh.ok) {
          // Cache the version without query as well, for stable offline startup.
          cache.put("./index.html", fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (_) {
        const cached = await cache.match("./index.html", { ignoreSearch: true });
        return cached || Response.error();
      }
    })());
    return;
  }

  // Static assets: cache-first.
  e.respondWith(
    caches.match(e.request, { ignoreSearch: false }).then((cached) =>
      cached ||
      fetch(e.request).then((res) => {
        if (sameOrigin && res && res.ok) {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone())).catch(() => {});
        }
        return res;
      })
    )
  );
});
