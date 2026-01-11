const CACHE = "tango-cho-cache-v3.6.0-root";
const ASSETS = [
  "./",
  "./index.html",
  "./index.html?v=3.6.0",
  "./style.css?v=3.6.0",
  "./script.js?v=3.6.0",
  "./manifest.json",
  "./icons/apple-touch-icon-v25.png",
  "./icons/icon-192-v25.png",
  "./icons/icon-512-v25.png",];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
