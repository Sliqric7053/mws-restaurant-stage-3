self.importScripts('./js/idb.js');
self.importScripts('./js/dbhelper.js');

let staticCacheName = 'restaurant-info-v4';
let urlsToCache = [
  './',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './favicon.ico',
  './js/dbhelper.js',
  './js/idb.js',
  './js/main.js',
  './js/offline_persitence.js',
  './js/restaurant_info.js',
  './manifest.json',
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
  './sw.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
});

//Delete stale cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          //If this was a previous cache
          if (thisCacheName !== staticCacheName) {
            //Delete the cached file
            console.log('Deleting stale cached files');
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

// Update cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      return (
        response ||
        fetch(event.request).then(res => {
          if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
          }
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});

// Immediately update cache
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
              .catch(error =>
                console.log('Review not synced to db: ', error)
              );
          }
        })
        .catch(error => console.log('Unable to fetch reviews: ', error))
    );
  }
});
