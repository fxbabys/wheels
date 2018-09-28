const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise (fn) {
  const _this = this
  _this.currentState = PENDING
  _this.value = undefined

  _this.resolvedCallbacks = []
  _this.rejectedCallbacks = []

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => {
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED
        _this.value = value
        _this.resolvedCallbacks.forEach(cb => cb())
      }
    })
  }

  _this.reject = function (reason) {
    setTimeout(() => {
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED
        _this.value = reason
        _this.rejectedCallbacks.forEach(cb => cb())
      }
    })
  }

  try {  // 考虑到执行fn时可能出错, 所以这里try/catch一下, 并将catch到的值reject回去
    fn(_this.resolve, _this.reject)
  } catch (e) {
    _this.reject(e)
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  const self = this
  // 规范 2.2.7: then 必须返回一个新的Promise
  let promise2
  // 规范 2.2: onResolved 和 onRejected 为可选参数 如果类型不是函数需要忽略并且实现了透传
  onResolved = typeof onResolved === 'function' ? onResolved : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }

  if (self.currentState === RESOLVED) {
    // promise1(this/self)的状态已经确定并且为resolved, 调用onResolved
    return promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4: 保证 onFulfilled onRjected 异步执行
      setTimeout(function () {
        try {
          const x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  if (self.currentState === REJECTED) {
    return promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          const x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  if (self.currentState === PENDING) {
    // 当前Promise还处于pending状态不能确定调用onResolved还是onRejected
    // 所以需要将 两种情况的判断处理逻辑 作为callback 放入当前Promise对象的回调数组里
    return promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function (value) {
        try {
          const x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      self.rejectedCallbacks.push(function (reason) {
        try {
          const x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

// 规范2.3: 针对不同的Promise实现交互
function resolutionProcedure (promise2, x, resolve, reject) {
  // 规范2.3.1: x与promise2不能相同, 避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaing cycle detected for promise'))
  }

  // 规范2.3.2: x是一个Promise 状态为pending则需要继续等待 否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }

  // 2.3.3.3: resolve或reject其中一个执行过则忽略其它的
  let thenCalledOrThrow = false
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) { // 规范2.3.3
    try {
      // 2.3.3.1: x.then可能是getter（函数）, 如果是函数就执行
      let then = x.then
      if (typeof then === 'function') {
        // 2.3.3.3
        then.call(
          x, 
          y => {
            if (thenCalledOrThrow) return  // 2.3.3.3.3 三处谁执行就以谁的为准
            thenCalledOrThrow = true
            resolutionProcedure(promise2, y, resolve, reject)  // 2.3.3.3.1
          },
          r => {
            if (thenCalledOrThrow) return  // 2.3.3.3.3 三处谁执行就以谁的为准
            thenCalledOrThrow = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      reject(e)
    }
  } else { // 2.3.4
    resolve(x)
  }
}

MyPromise.deferred = function () {
  var dfd = {}
  dfd.promise = new MyPromise(function (resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

try {
  module.exports = MyPromise
} catch (e) {}