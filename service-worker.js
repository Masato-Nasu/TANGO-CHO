const CACHE_NAME = "tango-cho-cache-v3.7.8-root";
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
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Only cache same-origin assets (GitHub Pages). Cross-origin (HF/DeepL) should pass through.
  if (url.origin !== self.location.origin) return;

  const accept = e.request.headers.get("accept") || "";
  const isNav = e.request.mode === "navigate" || accept.includes("text/html");

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      if (isNav) {
        // AppShell: serve index.html for normal navigation, but serve share-target.html
        // when the PWA is launched via Web Share Target (Android share sheet).
        const isShareTarget = url.pathname.endsWith("/share-target.html") || url.pathname.endsWith("share-target.html");
        const shellPath = isShareTarget ? "./share-target.html" : "./index.html";

        const cachedShell = await cache.match(shellPath, { ignoreSearch: true });
        if (cachedShell) return cachedShell;

        try {
          const fresh = await fetch(shellPath, { cache: "no-store" });
          if (fresh && fresh.ok) cache.put(shellPath, fresh.clone());
          return fresh;
        } catch (err) {
          return cachedShell || Response.error();
        }
      }

      const cached = await cache.match(e.request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const fresh = await fetch(e.request);
        if (fresh && fresh.ok) cache.put(e.request, fresh.clone());
        return fresh;
      } catch (err) {
        return cached || Response.error();
      }
    })
  );
});

