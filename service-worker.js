const CACHE_NAME = "tango-cho-cache-v3.7.9";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./share-target.html",
  "./icons/icon-192-v26.png",
  "./icons/icon-512-v26.png",
  "./icons/apple-touch-icon-v26.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

async function cacheFirst(cache, request, opts) {
  const cached = await cache.match(request, opts);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

async function networkFirst(cache, request, opts, fetchOpts) {
  try {
    const fresh = await fetch(request, fetchOpts || undefined);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request, opts);
    return cached || Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Only cache same-origin assets (GitHub Pages). Cross-origin should pass through.
  if (url.origin !== self.location.origin) return;

  const accept = e.request.headers.get("accept") || "";
  const isNav = e.request.mode === "navigate" || accept.includes("text/html");

  const isScriptOrStyle =
    e.request.destination === "script" ||
    e.request.destination === "style" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css");

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      if (isNav) {
        const isShareTarget =
          url.pathname.endsWith("/share-target.html") || url.pathname.endsWith("share-target.html");

        const isIndexLike =
          url.pathname.endsWith("/") ||
          url.pathname.endsWith("/index.html") ||
          url.pathname.endsWith("index.html");

        if (isShareTarget) {
          return cacheFirst(cache, "./share-target.html", { ignoreSearch: true });
        }

        // Allow other .html pages (e.g., recovery) if ever added
        if (!isIndexLike && url.pathname.endsWith(".html")) {
          const rel = "./" + url.pathname.split("/").pop();
          return networkFirst(cache, rel, { ignoreSearch: true }, { cache: "no-store" });
        }

        // App shell: network-first to avoid being stuck on a bad cached HTML/JS.
        return networkFirst(cache, "./index.html", { ignoreSearch: true }, { cache: "no-store" });
      }

      // Scripts/styles: network-first so updates apply quickly.
      if (isScriptOrStyle) {
        return networkFirst(cache, e.request, { ignoreSearch: false }, { cache: "no-store" });
      }

      // Other assets: cache-first.
      return cacheFirst(cache, e.request, { ignoreSearch: false });
    })
  );
});
