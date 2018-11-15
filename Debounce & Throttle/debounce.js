/**
 * 函数防抖
 * 如用户一直触发一个函数并且间隔小于wait则只会调用一次
 */

/**
 * func 连续操作停止 wait ms后只执行一次
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

/**
 * func 立即执行, 等停止触发 wait ms 后才可以重新触发
 */

function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  const later = () => setTimeout(() => {
    timer = null
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  return funtion (...params) {
    if (!timer) {  // 判断有无定时器
      timer = later()
      if (immediate) {
        func.apply(this, params) // 立即执行
      } else {
        context = this
        args = params
      }
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}