---
layout: null
---
var CACHE_VERSION = 'jclwilson-v2';
var CACHE_FILES = [
    '/',
    '/404',
    '/offline',
    '/work',
    '/node_modules/reframe.js/dist/reframe.min.js',
    'https://fonts.gstatic.com/s/worksans/v2/ElUAY9q6T0Ayx4zWzW63VFtXRa8TVwTICgirnJhmVJw.woff2',
    'https://fonts.gstatic.com/s/droidserif/v6/0AKsP294HTD-nvJgucYTaI4P5ICox8Kq3LLUNMylGO4.woff2'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            cache.addAll([
                {% for page in site.posts limit: 5 %}
                    {{ page.url | prepend: "'" | append: "'," }}
                {% endfor %}
            ]);
            return cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.map(function(key, i){
                    if (key !== CACHE_VERSION){
                        console.log('will delete '  + keys[i]);
                        return caches.delete(keys[i]);
                    }
                })
            )
        })
    )
});

// First, import the library into the service worker global scope:
importScripts('vendor/sw-offline-google-analytics/offline-google-analytics-import.js');
// Then, call goog.offlineGoogleAnalytics.initialize():
// See https://github.com/GoogleChrome/sw-helpers/tree/master/projects/sw-offline-google-analytics#googofflinegoogleanalyticsinitialize
goog.offlineGoogleAnalytics.initialize();
// At this point, implement any other service worker caching strategies
// appropriate for your web app.

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      // Fall back to network
      return response || fetch(event.request);
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline');
    })
  );
});
