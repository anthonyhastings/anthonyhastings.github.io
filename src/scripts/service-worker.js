/**
 * The name of the latest cache.
 *
 * @type {String}
 */
const CACHE_NAME = 'portfolio-v1';

/**
 * Opens the cache object and retrieves listed assets whose responses are added
 * to the cache object. The request objects created during retrieval become
 * keys to the stored response operations.
 *
 * @return {Promise}
 */
function cacheOfflineAssets() {
    return caches.open(CACHE_NAME).then(function(cache) {
        let cachingAction = cache.addAll([
            '/',
            'dist/styles/landing.css',
            'dist/images/me-380.jpg',
            'dist/scripts/app.min.js',
            'web-manifest.json'
        ]);

        cachingAction.then(null, (rejection) => {
            console.warn('ServiceWorker::cacheOfflineAssets', rejection);
        });

        return cachingAction;
    });
};

/**
 * After the service worker is registered, the browser will attempt to install
 * then activate the service worker. Installation is attempted when the
 * downloaded file is found to be new — either different to an existing service
 * worker (byte-wise compared), or the first service worker encountered.
 *
 * The install event is fired when an install is successfully completed. It is
 * generally used to populate your browser’s offline caching capabilities with
 * the assets you need to run your app offline.
 *
 * @param {Object} event
 */
self.addEventListener('install', (event) => {
    console.info('ServiceWorker::install', event);

    event.waitUntil(cacheOfflineAssets());
});

/**
 * The activate event is a good time to clean up old caches and other things
 * associated with the previous version of your service worker.
 *
 * @param {Object} event
 */
self.addEventListener('activate', (event) => {
    console.info('ServiceWorker::activate', event);

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * Intercepts resource requests and checks to see if the request is for HTML.
 * If it is we attempt to fetch the resource but failing that, serve the
 * main HTML page instead.
 *
 * @param {Object} event
 */
self.addEventListener('fetch', (event) => {
    let request = event.request;

    if (request.mode === 'navigate' || (request.method === 'GET'
        && request.headers.get('accept').includes('text/html'))) {
        console.info('Handling fetch event for', request.url);

        event.respondWith(
            fetch(request).catch(() => caches.match('/'))
        );
    }
});
