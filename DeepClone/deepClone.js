function deepClone (obj, hash = new WeakMap()) {
  const isObj = o => (typeof o === 'object' || typeof o === 'function') && o !== null

  if (!isObj(obj)) return obj
  if (hash.has(obj)) return hash.get(obj)

  const isArray = Array.isArray(obj)
  const newObj = isArray ? [...obj] : { ...obj }
  hash.set(obj, newObj)
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObj(obj[key]) ? deepClone(obj[key], hash) : obj[key]
  })

  return newObj
}

const obj = {
  a: [1, 2, 3],
  b: {
    c: {
      d: 3
    },
    e: 4
  }
}

const newObj = deepClone(obj)
newObj.b.c.d = 2
console.log(obj.b.c.d)