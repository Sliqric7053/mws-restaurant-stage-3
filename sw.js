importScripts("./js/idb.js");
importScripts('./js/dbhelper.js');

var staticCacheName = 'restaurant-info-v2';
var urlsToCache = [
  './',
  './index.html',
  './restaurant.html',
  './js/dbhelper.js',
  './js/main.js',
  './js/idb.js',
  './js/restaurant_info.js',
  './manifest.json',
  './sw.js',
  './img/',
  './favicon.ico',
  './css/styles.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

//Delete old cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCachName) {
        //If this was a previous cache
        if (thisCachName !== staticCacheName) {
          //Delete the cached file
          console.log('Deleting old cached files');
          return caches.delete(thisCachName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return response || fetch(event.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        })
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', function(event) {
  /*
   * If page has a connection, it will try and fetch the reviews, and if it fulfills,
   the sync is complete. If it fails, another sync will be scheduled to retry.
   Retry syncs also wait for connectivity, and employ an exponential back-off.
  */
  if (event.tag === 'offlineSync') {
    console.log('offlineSync tag: ', event.tag);
    event.waitUntil(
      DBHelper.offlineReviewsSubmission()
       .then(data => {
         for (const review of data) {
           fetch(`${DBHelper.DATABASE_URL}/reviews/`, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json'
             },
             body: JSON.stringify(review)
           })
           .then(response => response.json())
           .then(() => {
            DBHelper.deleteReviewsOffline();
             })
             .catch(error => console.log('Review not synced to database', error));
           }
       })
       .catch(error => console.log('Unable to fetch reviews', error))
    )
  }
})

// const APP_CACHE = "restaurant-review-v4";

// // Cached files
// const urlsToCache = [
//   "./index.html",
//   "./restaurant.html",
//   "./css/styles.css",
//   "./img/1.jpg",
//   "./img/2.jpg",
//   "./img/3.jpg",
//   "./img/4.jpg",
//   "./img/5.jpg",
//   "./img/6.jpg",
//   "./img/7.jpg",
//   "./img/8.jpg",
//   "./img/9.jpg",
//   "./img/10.jpg",
//   "./js/main.js",
// ];

// // Install essential URLs.
// self.addEventListener("install", event => {
//   event.waitUntil(
//     caches.open(APP_CACHE).then(cache => cache.addAll(urlsToCache))
//   );
// });

// // Delete old caches.
// self.addEventListener("activate", event => {
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames
//           .filter(cacheName => cacheName !== APP_CACHE)
//           .map(cacheName => caches.delete(cacheName))
//       );
//     })
//   );
// });

// // Fetch data from cache.
// self.addEventListener("fetch", event => {
//   const requestUrl = new URL(event.request.url);
//   if (requestUrl.pathname === "./api") {
//     // Mapbox api. Don't cache.
//     fetch(event.request);
//   } else if (requestUrl.pathname === "./") {
//     // Serve from cache, update in background.
//     cacheThenUpdateWithCacheBust(event);
//   } else {
//     // Try cache first. If that fails, go to network and update cache.
//     cacheWithNetworkFallbackAndStore(event);
//   }
// });

// // Attempt to retrieve from cache first. If that fails, go to network and
// // store it in the cache for later.
// function cacheWithNetworkFallbackAndStore(event) {
//   let response = null;
//   event.respondWith(
//     fromCache(event.request).catch(() =>
//       fetch(event.request.clone())
//         .then(resp => {
//           response = resp;
//           return update(event.request, resp.clone());
//         })
//         .then(() => response)
//     )
//   );
// }

// // Immediately respond from cache, but update from network in the background.
// // Perform a cache bust when updating.
// function cacheThenUpdateWithCacheBust(event) {
//   const networkRequest = new Request(
//     `${event.request.url}?${Date.now().toString()}`
//   );

//   const network = fetch(networkRequest);
//   const networkClone = network.then(response => response.clone());

//   event.respondWith(fromCache(event.request).catch(() => networkClone));
//   event.waitUntil(network.then(resp => update(event.request, resp)));
// }

// // Retrieve response from cache.
// function fromCache(request) {
//   return caches.open(APP_CACHE).then(cache => {
//     return cache.match(request).then(matching => {
//       return matching || Promise.reject("no-match");
//     });
//   });
// }

// // Store response in the cache.
// function update(request, response) {
//   return caches.open(APP_CACHE).then(cache => cache.put(request, response));
// }

