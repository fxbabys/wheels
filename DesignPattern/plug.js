  /**
 * 适配器模式：解决两个接口不兼容的情况，不改变已有的接口，通过包装一层实现两个接口的正常协作
 * Vue 中父组件传递给子组件一个时间戳属性，组件内部需要转成正常的日期(一般使用 computed)
 * 
 */
class Plug {
  getName () {
    return '苹果充电口'
  }
}

class Target {
  constructor () {
    this.plug = new Plug()
  }
  getName () {
    return this.plug.getName() + '适配器转安卓充电口'
  }
}

let target = new Target()
console.log(target.getName())