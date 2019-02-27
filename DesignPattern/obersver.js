/**
 * 发布-订阅模式：通过一对一或者一对多的依赖关系，当对象发生改变时，订阅方都会收到通知
 * 在 Vue 中，对于需要实现响应式的对象， get 时进行依赖收集，set 时派发更新
 */

// 点击一个按钮触发了事件
let ul = document.createElement('ul')
ul.addEventListener('click', event => {
  console.log(event.target)
})