// TradieMatch service worker — minimal v1.
// Caches the app shell on install. Network-first for API + auth.

const CACHE = "tradiematch-v1";
const APP_SHELL = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache auth / API / Stripe / Supabase
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/auth") ||
    url.hostname.endsWith("supabase.co") ||
    url.hostname.endsWith("stripe.com")
  ) {
    return;
  }

  // Static assets — cache-first
  if (
    event.request.method === "GET" &&
    /\.(?:png|jpg|jpeg|webp|gif|svg|ico|woff2?|css|js)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
            return res;
          }),
      ),
    );
  }
});
