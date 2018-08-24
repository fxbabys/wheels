class Observer {
    constructor (data) {
        this.observe(data)
    }
    observe (data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            this.observe(data[key])  // 递归劫持
        })
    }
    defineReactive (data, key, value) {
        const _this = this
        const dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get () {
                Dep.target && dep.subcribe(Dep.target) 
                return value
            },
            set (newValue) {
                if (newValue !== value) {
                    value = newValue
                    _this.observe(value)  // 赋值也劫持
                    dep.notify()
                }
            }
        })
    }
}

class Dep {
    constructor () {
        this.subs = []
    }
    subcribe (watcher) {
        this.subs.push(watcher)
    }
    notify () {
        this.subs.forEach(watcher => watcher.update())
    }
}