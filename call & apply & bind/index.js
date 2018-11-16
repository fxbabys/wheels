/**
 *  call apply bind 都改变了 this 的指向
 *  call 接收一个参数列表 
 *  apply 接收一个参数数组 
 *  bind 返回一个函数
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
  var context = context || windowjjjjjjj
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
  if (args[0]) { // 判断是否存在第二个参数
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
    if (this instanceof F) {  // new 调用
      return new _this(...args, ...arguments)
    }
    return _this.call(context, ...arguments)
    // or return _this.apply(context, args.concat(...arguments))
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


/**
 * Implements
 * Pass sucs test as: plus(1)(4)(2)(3).toString() === 10
 */

function plus () {
  var _args = [].slice.call(arguments)  // 类数组 arguemnts 转成数组
  var _adder = function () {
    [].push.apply(_args, [].slice.call(arguments)) // 与下行等价
    // _args.push([].slice.call(arguments)[0])
    return _adder
  }
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b
    })
  }
  return _adder
}

console.log(plus(1)(4)(2)(3).toString())