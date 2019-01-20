class EventEmitter {
  constructor () {
    this.handlers = []
  }
  on (eventName, callback) {
    if (!this.eventName) this.handlers = {}
    if (!this.handlers[eventName]) this.handlers[eventName] = []
    this.handlers[eventName].push(callback)
  }
  emit (eventName, ...arg) {
    if (this.handlers[eventName]) {
      for (let i = 0; i < this.handlers[eventName].length; i++) {
        this.handlers[eventName][i](...arg)
      }
    }
  }
}