// 通过 Proxy 实现一个响应式数据操作
const onWatch = (obj, setBind, getLogger) => {
  const handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

const obj = {
  a: 1
}

const p = onWatch(obj, (v, property) => console.log(`listening ${property} to ${v}`), (target, property) => console.log(`${property} = ${target[property]}`))

p.a = 2
p.a