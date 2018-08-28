import { createElement, render, renderDOM } from './element'
import { diff } from './diff'
import patch from './patch'

const virtualDOM1 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c'])
])

const virtualDOM2 = createElement('ul', { class: 'list-group' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('div', { class: 'item' }, ['a'])
])

const element = render(virtualDOM1)  // vdom -> rdom
renderDOM(element, window.root)      // rdom -> add to the root
// console.log(virtualDOM)
// console.log(element)

window.setTimeout(() => {
  const patches = diff(virtualDOM1, virtualDOM2)  // oldVDom vs newVDom
  console.log(patches)
  patch(element, patches)                         // patch to the element
}, 2000)

