const path = require('path')
const express = require('express')
const compression = require('compression')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const options =  { 
  connectTimeoutMS: 10000,
  useNewUrlParser: true
}

mongoose
  .connect(process.env.MONGODB_URI, options)
  .then(() => console.log(`connected to ${process.env.MONGODB_URI} ...`))
  .catch((error) => console.log(error))

const app = express()

app.set('port', (process.env.PORT || 5000))
app.set('session', 'eatyourowndogfood')
app.use(compression())
app.enable('trust proxy')

app.use(function (req, res, next) {
  if (req.secure) {
    next()
  } else {
    res.redirect('https://' + req.headers.host + req.url)
  }
})

app.use('/api/register', require('./router-register.js'))
app.use('/api/login', require('./router-login.js'))
app.use('/api/callback/:userId', require('./router-callback.js'))
app.use('/api/phone', require('./router-phone.js'))
app.use('/api/setup', require('./router-setup.js'))
app.use('/', require('./router-page.js'))

app.use('/fonts', express.static(path.join(__dirname, '/public/fonts'), { maxAge: '7d', etag: false }))
app.use('/images', express.static(path.join(__dirname, '/public/images'), { maxAge: '7d', etag: false }))
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts'), { etag: false }))
app.use('/styles', express.static(path.join(__dirname, '/public/styles'), { etag: false }))
app.use('/templates', express.static(path.join(__dirname, '/public/templates'), { etag: false }))

app.set('etag', false)

app.listen(app.get('port'), function onStart() {
  console.log('magic happens on port', app.get('port'))
})
