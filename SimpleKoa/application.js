const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
  constructor () {
    this.callbackFunc = null
    this.context = context
    this.request = request
    this.response = response
  }
  listen (...args) {
    let server = http.createServer(this.callback())
    server.listen(...args)
  }
  use (fn) {
    this.callbackFunc = fn
  }
  callback () {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      this.callbackFunc(ctx).then(respond)
    }
  }
  /**
   * 构造 ctx
   * @param {Object} req 实例 
   * @param {Object} res 实例
   * @return {Object} ctx 实例
   */
  createContext (req, res) {
    const ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.request.res = res
    return ctx
  }
  /**
   * 返回给客户端
   * @param {Object} ctx 实例 
   */
  responseBody (ctx) {
    const content = ctx.body
    if (typeof content === 'string') {
      ctx.res.end(content)
    } else if (typeof content === 'object') {
      ctx.res.end(JSON.stringify(content))
    }
  }
}

module.exports = Application