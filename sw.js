const APP_CACHE = "restaurant-review-v2";

// Cached files
const urlsToCache = [
  "./index.html",
  "./restaurant.html",
  "./css/styles.css",
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
  "./img/8.jpg",
  "./img/9.jpg",
  "./img/10.jpg",
  "./js/main.js",
];

// Install essential URLs.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

// Delete old caches.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== APP_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch data from cache.
self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname === "/api") {
    // Mapbox api. Don't cache.
    fetch(event.request);
  } else if (requestUrl.pathname === "/") {
    // Serve from cache, update in background.
    cacheThenUpdateWithCacheBust(event);
  } else {
    // Try cache first. If that fails, go to network and update cache.
    cacheWithNetworkFallbackAndStore(event);
  }
});

// Attempt to retrieve from cache first. If that fails, go to network and
// store it in the cache for later.
function cacheWithNetworkFallbackAndStore(event) {
  let response = null;
  event.respondWith(
    fromCache(event.request).catch(() =>
      fetch(event.request.clone())
        .then(resp => {
          response = resp;
          return update(event.request, resp.clone());
        })
        .then(() => response)
    )
  );
}

// Immediately respond from cache, but update from network in the background.
// Perform a cache bust when updating.
function cacheThenUpdateWithCacheBust(event) {
  const networkRequest = new Request(
    `${event.request.url}?${Date.now().toString()}`
  );

  const network = fetch(networkRequest);
  const networkClone = network.then(response => response.clone());

  event.respondWith(fromCache(event.request).catch(() => networkClone));
  event.waitUntil(network.then(resp => update(event.request, resp)));
}

// Retrieve response from cache.
function fromCache(request) {
  return caches.open(APP_CACHE).then(cache => {
    return cache.match(request).then(matching => {
      return matching || Promise.reject("no-match");
    });
  });
}

// Store response in the cache.
function update(request, response) {
  return caches.open(APP_CACHE).then(cache => cache.put(request, response));
}
