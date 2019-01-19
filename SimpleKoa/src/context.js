/**
 * 代理对象
 */
// module.exports = {
//   get query () {
//     return this.request.query
//   },
//   get body () {
//     return this.reponse.body
//   },
//   set body (data) {
//     this.reponse.body = data
//   },
//   get status () {
//     return this.reponse.status
//   },
//   set status (statusCode) {
//     this.reponse.status = statusCode
//   }
// }

/**
 * 精简版： 通过对象的 __defineSetter__ 和 __defineGetter__ 来实现
 */
let proto = {}
function delegateSet (property, name) {
  proto.__defineSetter__(name, function (val) {
    this[property][name] = val
  })
}
function delegateGet (property, name) {
  proto.__defineGetter__(name, function () {
    return this[property][name]
  })
}

let requestSet = []
let requestGet = ['query']

let responseSet = ['body', 'status']
let responseGet = responseSet

requestSet.forEach(ele => {
  delegateSet('request', ele)
})
requestGet.forEach(ele => {
  delegateGet('request', ele)
})

responseSet.forEach(ele => {
  delegateSet('response', ele)
})
responseGet.forEach(ele => {
  delegateGet('response', ele)
})

module.exports = proto