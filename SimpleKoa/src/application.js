const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

const EventEmitter = require('events')

class Application extends EventEmitter {
  constructor () {
    super()
    this.middlewares = []
    this.context = context
    this.request = request
    this.response = response
  }
  listen (...args) {
    let server = http.createServer(this.callback())
    server.listen(...args)
  }
  use (middleware) {
    this.middlewares.push(middleware)
  }
  /**
   * 中间件合并
   */
  compose () {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext)
        }
      }
      let next = async () => {
        return Promise.resolve()
      }
      for (let len = this.middlewares.length, i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middlewares[i]
        next = createNext(currentMiddleware, next)
      }

      await next()
    }
  }
  /**
   * 获取 http server 所需的 callback 函数
   * @return {Funtion} fn
   */
  callback () {
    return (req, res) => {
      const ctx = this.createContext(req, res)
      const respond = () => this.responseBody(ctx)
      const onerror = err => this.onerror(err, ctx)
      const fn = this.compose()
      return fn(ctx).then(respond).catch(onerror)
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
    ctx.res = ctx.response.res = res
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
  /**
   * 错误处理
   * @param {Object} err Error 对象
   * @param {Object} ctx 实例
   */
  onerror (err, ctx) {
    if (err.code === 'ENOENT') {
      ctx.status = 404
    } else {
      ctx.status = 500
    }
    let msg = err.message || 'Internal error'
    ctx.res.end(msg)
    this.emit('error', err)
  }
}

module.exports = Application