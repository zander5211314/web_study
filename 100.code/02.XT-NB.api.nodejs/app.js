var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var morgan = require('morgan')

var winston = require('./config/winston')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/account')
var meterRouter = require('./routes/meters')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('combined', { stream: winston.stream }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// api CORS
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, accept, origin, content-type'
  )
  res.header('Access-Control-Allow-Methods', 'POST')
  res.header('X-Powered-By', ' 3.2.1')
  // res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
app.use('/', indexRouter)

// api接口
app.use('/api/account/', usersRouter)
app.use('/api/meters/', meterRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // add this line to include winston logging
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip} - ${'zander'}`
  )

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
