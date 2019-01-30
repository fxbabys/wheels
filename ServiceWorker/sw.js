self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-cache').then(function (cache) {
      return cache.addAll(['./index.html', './index.js'])
    })
  )
})

// 拦截所有请求事件
// 缓存中有就返回缓存，否则去请求数据
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response
      }
      console.log('请求数据')
    })
  )
})