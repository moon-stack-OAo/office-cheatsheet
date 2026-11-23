/* 办公速查手册 Service Worker
 * 策略：
 *  - 导航请求（页面 HTML）网络优先，断网才回退缓存 —— 避免部署新版后仍加载旧 index.html 导致白屏
 *  - 静态资源缓存优先，网络回退 —— 保证离线可用
 *  - activate 时清理旧版本缓存
 * 注意：每次发布若需强制刷新用户缓存，把 CACHE 版本号递增（v2 -> v3 ...）。
 */
const CACHE = 'office-cheatsheet-v2'
const SCOPE = self.registration.scope // 以 sw.js 所在目录为基准，兼容相对 base 的子路径部署
const INDEX_URL = SCOPE + 'index.html'
const PRECACHE = [SCOPE, INDEX_URL]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
        .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
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

    // 页面导航：网络优先，成功则更新缓存；失败回退缓存入口
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone()
                        caches.open(CACHE).then((cache) => cache.put(INDEX_URL, copy))
                    }
                    return response
                })
                .catch(async () => (await caches.match(INDEX_URL)) || (await caches.match(SCOPE))),
        )
        return
    }

    // 静态资源：缓存优先，命中即返回；否则请求并缓存，失败返回入口页
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
          .catch(() => caches.match(INDEX_URL))
    }),
  )
})
