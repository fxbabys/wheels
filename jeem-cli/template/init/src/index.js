import jeem from 'jeem'

const app = jeem()

app.init()

app.router(require('./router'))

app.start('#app')


module.hot && module.hot.accept();