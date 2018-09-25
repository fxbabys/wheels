/**
 *  call apply bind 都改变了 this 的指向, call 接收一个参数列表 apply 接收一个参数数组 bind 返回一个函数
 * 
 * 模拟思路:
 * 1. 默认为window
 * 2. 传了参数后让新的对象可以执行该函数: 给新的对象添加一个函数, 执行完后再删除
 */
var a = {
  value: 1
}

function getValue (name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)
}

Function.prototype.myCall = function (context) {
  var context = context || window
  context.fn = this

  var args = [...arguments].slice(1)
  var result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function (context) {
  var context = context || window
  context.fn = this

  var args = [...arguments].slice(1)
  if (args[0]) {
    result = context.fn(...args[0])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}

Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  return function F () {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.call(context, ...arguments)
  }
}

console.log('call vs myCall: ')
getValue.call(a, 'jeremy', '20')
getValue.myCall(a, 'jeremy', '20')

console.log('apply vs myApply: ')
getValue.apply(a, ['jeremy', '20'])
getValue.myApply(a, ['jeremy', '20'])

console.log('bind vs myBind: ')
var getValueBind = getValue.bind(a)
getValueBind('jeremy', '20')
var getValueMyBind = getValue.myBind(a)
getValueMyBind('jeremy', '20')
