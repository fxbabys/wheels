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