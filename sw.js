---
layout: null
---
var CACHE_VERSION = 'jacobcharleswilson.com-{{ "now" | date_to_xmlschema }}';
var CACHE_FILES = [
    '/',
    '/404',
    '/offline',
    '/about',
    'favicon.ico',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    '512.png',
    '192.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function(cache) {
            cache.addAll([
                {% for post in site.posts limit: 10 %}
                    {{ post.url | prepend: "'" | append: "'," }}
                    {% if post.cdn-image %}
                        {{ site.cdn_url | prepend: "'" }}jpg/{{ post.cdn-image | append: ".jpg'," }}
                        {{ site.cdn_url | prepend: "'" }}webp/{{ post.cdn-image | append: ".webp'," }}
                    {% endif %}
                {% endfor %}
            ]);
            return cache.addAll(CACHE_FILES);
	 }).then(function() {
          return self.skipWaiting();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                if (response.status === 404) {
                    return caches.match('/404');
                }
                return response
            });
        }).catch(function() {
            return caches.match('/offline');
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.map(function(key, i) {
                    if (key !== CACHE_VERSION) {
                        return caches.delete(keys[i]);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim()
        })
    );
});
