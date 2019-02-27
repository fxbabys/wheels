/**
 * 工厂模式:
 * 隐藏创建实例的复杂度，只提供一个接口
 * 在 Vue 源码中创建异步组件即使用了工厂模式
 * createComponent 只需传入一个参数即可创建一个组件实例
 */

class Developer {
  constructor (name) {
    this.name = name
  }
  consoleName () {
    console.log(this.name)
  }
}

class Factory {
  static create (name) {
    return new Developer(name)
  }
}

Factory.create('jeremy').consoleName()