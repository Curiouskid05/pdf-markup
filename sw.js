const CACHE = 'pdfmarkup-cda39376bb';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './lib/pdf.min.js', './lib/pdf.worker.min.js', './lib/pdf-lib.min.js', './lib/xlsx.full.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; });
    if (e.request.mode === 'navigate') {
      const slow = new Promise(res => setTimeout(() => res(null), 3000));
      const first = await Promise.race([net.catch(() => null), slow]);
      return first || hit || net;
    }
    return hit || net;
  }));
});