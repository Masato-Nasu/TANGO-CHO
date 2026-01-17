const CACHE_NAME = "tango-cho-cache-v3.7.5-root";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./share-target.html",
  "./icons/icon-192-v26.png",
  "./icons/icon-512-v26.png",
  "./icons/apple-touch-icon-v26.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin) return;

  const accept = req.headers.get("accept") || "";
  const isNav = req.mode === "navigate" || accept.includes("text/html");

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // IMPORTANT: Share Target must load share-target.html, not the app shell.
      if (isNav && url.pathname.endsWith("share-target.html")) {
        const cachedShare = await cache.match("./share-target.html", { ignoreSearch: true });
        if (cachedShare) return cachedShare;
        try {
          const r = await fetch("./share-target.html", { cache: "no-store" });
          if (r && r.ok) cache.put("./share-target.html", r.clone());
          return r;
        } catch (err) {
          // last resort: fall back to app shell
        }
      }

      if (isNav) {
        const cachedIndex = await cache.match("./index.html", { ignoreSearch: true });
        if (cachedIndex) return cachedIndex;

        try {
          const r = await fetch("./index.html", { cache: "no-store" });
          if (r && r.ok) cache.put("./index.html", r.clone());
          return r;
        } catch (err) {
          return new Response("Offline", { status: 503, statusText: "Offline" });
        }
      }

      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const r = await fetch(req);
        if (r && r.ok) cache.put(req, r.clone());
        return r;
      } catch (err) {
        return new Response("", { status: 504, statusText: "Network error" });
      }
    })()
  );
});
