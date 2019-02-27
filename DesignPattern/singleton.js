/**
 * 单例模式：全局只有一个对象可以访问
 * Vuex 源码中使用了单例模式: 通过一个外部变量来控制只安装一次 Vuex
 */

class Singleton {
  constructor () {}
}

Singleton.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new Singleton()
    }
    return instance
  }
})()

let s1 = Singleton.getInstance()
let s2 = Singleton.getInstance()
console.log(s1 === s2)