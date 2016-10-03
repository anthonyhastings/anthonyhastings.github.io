// Registering service worker for offline ability and installable app banners.
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/serviceworker.min.js', {scope: '/'})
        .then((reg) => console.info('ServiceWorker::registered', reg))
        .catch((err) => console.error('ServiceWorker::error', err));
}
