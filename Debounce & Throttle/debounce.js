/**
 * 函数防抖
 * 如用户一直触发一个函数并且间隔小于wait则只会调用一次
 */

const debounce = (func, wait = 50) => {
  let timer = 0

  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

