class Watcher {
    constructor (vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        this.value = this.get()
    }
    getVal (vm, expr) {
        const attrs = expr.split('.')
        return attrs.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    }
    get () {
        Dep.target = this
        const value = this.getVal(this.vm, this.expr)
        Dep.target = null
        return value
    }
    update () {
        const newValue = this.getVal(this.vm, this.expr)
        const oldValue = this.value

        if (newValue !== oldValue) {
            this.cb(newValue)  // 对应 watcher 的更新 callback
        }
    }
}