class EventEmitter {
  constructor () {
    this._events = {}
  }

  on(eventName, callback) {
    let callbacks = this._events[eventName] || []
    callbacks.push(callback)
    this._events[eventName] = callbacks
  }
  off(eventName) {
    delete this._events[eventName]
  }
  emit(eventName, ...arg) {
    let callbacks = this._events[eventName]
    
    if (!callbacks || callbacks.length === 0) {
      throw new Error('You should register listener for event ' + eventName)
    }
    
    callbacks.forEach(fn => fn.apply(this, arg))
  }
}

let ee = new EventEmitter()
ee.on('test1', (x) => console.log('in test1', x))
ee.on('test2', () => console.log('in test2'))

ee.emit('test1', 1)
ee.emit('test2')

ee.off('test2')
console.log(ee._events)