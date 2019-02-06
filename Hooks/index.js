const state = []
const setters = []
let cursor = 0
let firstRun = true

function createServer (cursor) {
  return function setterWithCursor (newVal) {
    state[cursor] = newVal
  }
}

export function userState (initVal) {
  if (firstRun) {
    state.push(initVal)
    setters.push(createServer(cursor))
    firstRun = false
  }

  const setter = setters[cursor]
  const value = state[cursor]

  cursor++
  return [value, setter]
}