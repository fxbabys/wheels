if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function (resgiteration) {
      console.log('service worker 注册成功')
    })
    .catch(function (err) {
      console.log('service worker 注册失败')
    })
}