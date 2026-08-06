self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('qianqian-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/new.html',
        '/detail.html',
        '/setting.html',
        '/theme.html',
        '/stat.html',
        '/debts.html',
        '/style.css',
        '/script.js',
        '/icon 192.png',
        '/icon 512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
