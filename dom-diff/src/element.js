class Element {
  constructor (type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

function setAttr (el, key, value) {
  switch (key) {
    case 'value':
      if (el.tagName.toUpperCase() === 'INPUT' || el.tagName.toUpperCase === 'TEXTAREA') {
        el.value = value
      } else {
        el.setAttribute(key, value)
      }
      break
    case 'style':
      el.style.cssText = value
      break;
    default:
      el.setAttribute(key, value)
      break;
  }
}

function createElement (type, props, children) {
  return new Element(type, props, children)
}

/**
 * virtual dom -> reality dom
 */
function render (elObj) {
  const el = document.createElement(elObj.type)
  for (let key in elObj.props) {
    setAttr(el, key, elObj.props[key])  // 属性处理
  }
  // 遍历子节点，虚拟节点继续渲染，文本节点直接创建
  elObj.children.forEach(child => {
    console.log(child.nodeType)
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    el.appendChild(child)
  })
  return el
}

function renderDOM (el, target) {
  target.appendChild(el)
}

export { createElement, render, renderDOM, setAttr }