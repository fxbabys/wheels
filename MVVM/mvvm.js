class MVVM {
    constructor (options) {
        this.$el = options.el
        this.$data = options.data

        if (this.$el) {
            new Observer(this.$data)     // 数据劫持
            new Compile(this.$el, this)  // 节点编译
        }
    }
}