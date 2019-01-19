const simpleKoa = require('./application')
const app = new simpleKoa()

let responseData = {}

app.use(async (ctx, next) => {
  responseData.name = 'jeremy'
  await next()
  ctx.body = responseData
})

app.use(async (ctx, next) => {
  responseData.age = 21
  await next()
})

app.use(async (ctx, next) => {
  responseData.sex = 'male'
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
