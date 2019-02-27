/**
 * 装饰模式：给对象添加功能
 */

// ES7 装饰器语法
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = 'jeremy'
}

let t = new Test()
t.name = '123'