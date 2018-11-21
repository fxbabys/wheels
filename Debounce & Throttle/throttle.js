/**
 * 函数连续调用时, func 执行频率限定为 次/wait
 */

const prevThrottle = (func, wait = 50) => {
  let previous, timer

  return function () {
    // 保存函数调用时的上下文及参数
    const _this = this
    const args = arguments

    const now = +new Date()
    if (previous && now < previous + wait) {
      if (timer) clearTimeout(timer)

      // 保证在当前时间区间结束后再执行一次 func
      timer = setTimeout(function () {
        previous = now
        func.apply(_this, args)
      }, wait)
    } else {
      // 开始或者到达指定间隔时执行一次　fn
      previous = now
      fn.apply(_this, args)
    }
  }
}

const throttle = (func, wait = 50, options = {}) => {
  let context, args, result
  let timeout = 0
  let previous = 0

  const later = () => {
    previous = options.leading === false ? 0 : +new Date()
    // 防止内存泄露以及下文的定时器判断
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  return function () {
    var now = +new Date()

    if (!previous && options.leading === false) previous = now
    let remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) { // 当前时间超过间隔
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) { // 不存在定时器并且未设置 options.trailing
      timeout = setTimeout(later, remaining)
    }
  }
}