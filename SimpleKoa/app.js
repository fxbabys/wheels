const simpleKoa = require('./src/application')
const app = new simpleKoa()

app.use(async ctx => {
  throw new Error('ooops')
})

app.on('error', err => {
  console.log(err.stack)
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
