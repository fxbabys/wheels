/**
 * 计算首页有多少种 DOM 元素
 */

function walk (el, action) {
  if (el) {
    action(el)
    walk(el.firstElementChild, action)
    walk(el.nextElementSibling, action)
  }
}

function compute () {
  const set = new Set()
  walk(document.documentElement, el => set.add(el.nodeName))
  return set.size
}