/* 办公速查手册 Service Worker：预缓存入口 + 同源 GET 缓存优先、网络回退 */
const CACHE = 'office-cheatsheet-v1'
const SCOPE = self.registration.scope // 以 sw.js 所在目录为基准，兼容相对 base 的子路径部署
const PRECACHE = [SCOPE, SCOPE + 'index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(req, copy))
          }
          return response
        })
          .catch(() => caches.match(SCOPE + 'index.html'))
    }),
  )
})
