const simpleKoa = require('./application')
const app = new simpleKoa()

app.context.echoData = function (errno = 0, data = null, errmsg = '') {
  this.res.setHeader('Content-Type', 'application/json;charset=utf-8')
  this.body = {
    errno,
    data,
    errmsg
  }
}

app.use(async ctx => {
  let data = {
    name: 'jeremy',
    age: 16,
    sex: 'male'
  }
  ctx.echoData(0, data, 'success')
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
