---
---
    var CACHE_VERSION = 'jclwilson-{{ "now" | date_to_xmlschema }}';
	var CACHE_FILES = [
	    '/',
	    '/404',
	    '/offline',
		'/about',
	    '/assets/img/favicon-16.png',
        '/assets/img/favicon-32.png',
        '/assets/img/favicon-96.png'
	];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function(cache) {
            cache.addAll([
                {% for post in site.posts limit: 10 %}
                    {{ post.url | prepend: "'" | append: "'," }}
                    {% if post.image %}
                    	{{ site.cdn_url | prepend: "'" }}jpg/{{ post.image | append: ".jpg'," }}
                    	{{ site.cdn_url | prepend: "'" }}webp/{{ post.image | append: ".webp'," }}
                    {% endif %}
                {% endfor %}
            ]);
            return cache.addAll(CACHE_FILES);
        })
    );
});

// Adds offline analytics
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
workbox.googleAnalytics.initialize();

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
            )
        })
    );
});
