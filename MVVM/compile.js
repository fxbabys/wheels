class Compile {
    constructor (el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm

        if (this.el) {
            /**
             *  将真实dom移入内存中
             *  编译 v-model 和 {{}} 节点
             *  重新塞回页面中
             */
            const fragment = this.nodeToFragment(this.el)
            this.compile(fragment)
            this.el.appendChild(fragment)
        }
    }
    // 辅助方法
    isElementNode (el) {
        return el.nodeType === 1
    }
    isDirective (attr) {
        return attr.includes('v-')
    }

    // 核心方法
    compileElement (node) {
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            if (this.isDirective(attr.name)) {
                const [, type] = attr.name.split('-')   // 对 v- 指令的扩展
                CompileUtil[type](node, this.vm, attr.value)
            }
        })
    }
    compileText (node) {
        const expr = node.textContent
        const reg = /\{\{([^}]+)\}\}/g
        if (reg.test(expr)) {
            CompileUtil['text'](node, this.vm, expr)
        }
    }
    compile (fragment) {
        const nodes = fragment.childNodes
        Array.from(nodes).forEach(node => {
            if (this.isElementNode(node)) {
                this.compileElement(node)
                this.compile(node)  // 元素节点需要递归判断
            } else {
                this.compileText(node)
            }
        })
    }
    nodeToFragment (el) {
        const fragment = document.createDocumentFragment()
        let firstChild
        while (firstChild = el.firstChild) {  // firstChild 是一个引用，添加到fragment后el元素的firstChild自动移到下一个
            fragment.appendChild(firstChild)
        }
        return fragment
    }
}

CompileUtil = {
    getVal (vm, expr) {
        const attrs = expr.split('.')
        return attrs.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    },
    getTextVal (vm, expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1].trim())
        })
    },
    setVal (vm, expr, value) {
        const attrs = expr.split('.')
        return attrs.reduce((prev, next, currentIndex) => {
            if (currentIndex == attrs.length - 1) {
                return prev[next] = value
            }
            return prev[next]
        }, vm.$data)
    },
    text (node, vm, expr) {
        const updateFn = this.updater['textUpdater']
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1].trim(), (newValue) => {
                updateFn && updateFn(node, this.getTextVal(vm, expr))  // 数据变化时文本节点需要重新获取依赖属性更新文本内容
            })
        })
        updateFn && updateFn(node, this.getTextVal(vm, expr))
    },
    model (node, vm, expr) {
        const updateFn = this.updater['modelUpdater']
        new Watcher(vm, expr, (newValue) => {
            updateFn && updateFn(node, newValue)  // 数据变化时元素节点 value值更新
        })
        node.addEventListener('input', e => {   // 监听 input 事件赋值
            const newValue = e.target.value
            this.setVal(vm, expr, newValue)
        })
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    updater: {
        textUpdater (node, value) {
            node.textContent = value
        },
        modelUpdater (node, value) {
            node.value = value
        }
    }
}