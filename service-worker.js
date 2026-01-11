const CACHE = "tango-cho-cache-v3.6.1-ui";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./share-target.html",
  "./icons/apple-touch-icon-v25.png",
  "./icons/icon-192-v25.png",
  "./icons/icon-512-v25.png",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    (async () => {
      const direct = await caches.match(e.request);
      if (direct) return direct;

      // クエリ付きでも同一パスのキャッシュを返す（更新用 cache-bust に強くする）
      if (url.search) {
        const strippedReq = new Request(url.origin + url.pathname, {
          method: "GET",
          headers: e.request.headers,
          mode: e.request.mode,
          credentials: e.request.credentials,
          redirect: e.request.redirect,
        });
        const stripped = await caches.match(strippedReq);
        if (stripped) return stripped;
      }

      // ナビゲーション時は index を返す（オフライン起動用）
      if (e.request.mode === "navigate") {
        const cachedIndex = await caches.match("./index.html");
        if (cachedIndex) return cachedIndex;
      }

      try {
        return await fetch(e.request);
      } catch (err) {
        return direct;
      }
    })()
  );
});
