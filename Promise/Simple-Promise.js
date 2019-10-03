const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise (fn) {
  const _this = this
  _this.state = PENDING
  _this.value = undefined
  _this.resolvedCallbacks = []
  _this.rejectedCallbacks = []

  function resolve (value) {
    setTimeout(() => {
      if (_this.state === PENDING) {
        _this.state = RESOLVED
        _this.value = value
        _this.resolvedCallbacks.forEach(cb => cb(_this.value))
      }
    }, 0)
  }

  function reject (value) {
    setTimeout(() => {
      if (_this.state === PENDING) {
        _this.state = REJECTED
        _this.value = value
        _this.rejectedCallbacks.forEach(cb => cb(_this.value))
      }
    }, 0)
  }

  try {
    fn(resolve, reject)
  } catch (e) {
    _this.reject(e)
  }
}

MyPromise.prototype.then = function (fn, onResolved, onRejected) {
  const _this = this
  onResolved = typeof onResolved === 'function' ? onResolved : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }

  
  if (_this.state === PENDING) {
    _this.resolvedCallbacks.push(onResolved)
    _this.rejectedCallbacks.push(onRejected)
  }

  if (_this.state === RESOLVED) {
    onResolved(_this.value)
  }

  if (_this.state === REJECTED) {
    onRejected(_this.value)
  }
}

// 返回一个没有 resolve 的 then 结果
MyPromise.prototype.catch = function (callback) {
  return this.then(null, callback)
}

MyPromise.prototype.finally = function (callback) {
  const p = this.constructor
  return this.then(
    value => p.resolve(callback()).then(() => value()),
    err => p.resolve(callback()).then(() => { throw err })
  )
}

// 接受一个 promises 数组, 全部完成再 resolve
MyPromise.all = function (promises) {
  return new MyPromise(function (resolve, reject) {
    let arr = [] // 最终返回值的结果
    let i = 0    // 成功了多少次
    function processData (index, y) {
      arr[index] = y
      if (++i === promises.length) {
        resolve(arr)
      }
    }
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function (y) {
        processData(i, y)
      }, reject)
    }
  })
}

// 接受一个 promises 数组, 有一个成功就成功, 如果第一个失败就失败
MyPromise.race = function (promises) {
  return new MyPromise(function (resolve, reject) {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}