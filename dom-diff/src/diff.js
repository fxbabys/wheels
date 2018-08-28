let Index = 0
export const ATTR = 'ATTR'
export const TEXT = 'TEXT'
export const REMOVE = 'REMOVE'
export const REPLACE = 'REPLACE'

function diff (oldTree, newTree) {
  const patches = {}
  let index = 0
  walk(oldTree, newTree, index, patches)
  return patches
}

function diffAttr (oldAttrs, newAttrs) {
  const patch = {}
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {  // 属性减少或者修改
      patch[key] = newAttrs[key]
    }
  }
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {  // 属性新增
      patch[key] = newAttrs[key]
    }
  }
  return patch
}

function diffChildren (oldChildren, newChildren, patches) {
  oldChildren.forEach((child, idx) => {
    walk(child, newChildren[idx], ++Index, patches)
  })
}

function isString (node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

function walk (oldNode, newNode, index, patches) {
  const currentPatch = []
  if (!newNode) {                                       // 节点删除
    currentPatch.push({
      type: REMOVE,
      index
    })
  } else if (isString(oldNode) && isString(newNode)) {  // 文本节点替换
    if (oldNode !== newNode) {
      currentPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type === newNode.type) {           // 节点类型相同，属性更新
    const attrs = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(attrs).length > 0) {
      currentPatch.push({
        type: ATTR,
        attrs
      })
    }
    diffChildren(oldNode.children, newNode.children, patches)
  } else {                                              // 节点类型不同，即节点替换
    currentPatch.push({
      type: REPLACE,
      newNode
    })
  }
  if (currentPatch.length > 0) {
    patches[index] = currentPatch
  }
}

export { diff }