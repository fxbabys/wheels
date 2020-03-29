const targetMap = new WeakMap()
let activeEffect = null

// 保存所有 effect
function track(target, key) {
  if(activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, depsMap = new Map())
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, dep = new Set())
    }
    dep.add(activeEffect)
  }
}

// 触发对应的 effect
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

// 核心 reactive 函数
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (oldValue != result) {
        trigger(target, key)
      }
      return result
    }
  }
  return new Proxy(target, handler)
}

// function ref(raw) {
//   const r = {
//     get value() {
//       track(r, 'value')
//       return raw
//     },
//     set value(newVal) {
//       raw = newVal
//       trigger(r, 'value')
//     }
//   }
//   return r
// }

function ref(initialValue) {
  return reactive({ value: initialValue })
}

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

function computed(getter) {
  let result = ref()

  effect(() => result.value = getter())

  return result
}

exports.reactive = reactive
exports.effect = effect
exports.computed = computed