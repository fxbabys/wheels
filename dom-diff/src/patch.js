import { ATTR, TEXT, REMOVE, REPLACE } from './diff'
import { render, setAttr } from './element'

let index = 0
let allPatches = []

function patch (el, patches) {
  allPatches = patches
  walk(el)
}

function walk (node) {
  const currentPatch = allPatches[index++]
  const childNodes = node.childNodes
  childNodes.forEach(child => walk(child))
  if (currentPatch) {
    doPatch(node, currentPatch)
  }
}

function doPatch (node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case ATTR:
        for (let key in patch.attrs) {
          const value = patch.attrs[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case TEXT:
        node.textContent = patch.text
        break
      case REPLACE:
        // here is a instanceof Element unexcepted boolean
        const newNode = (patch.newNode.type) ? render(patch.newNode) : document.createTextNode(patch.newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case REMOVE:
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}

export default patch