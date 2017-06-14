// Handle Node exceptions
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err)
  console.log(err.stack)
})

// Configure exposed port
var port = process.env.PORT || 80

// Use proxy for streaming
var proxy = require('express-http-proxy')

// Configure express
var express = require('express')
var app = express()

// Configure rendering engine
app.set('view engine', 'pug')

// Home route
app.get('/', function (req, res) {
  res.render('index', {
    title: process.env.RESIN_APP_NAME || '(Not Set)',
    imageSource: '/camera.gif'
  })
})

// Camera proxy
app.use('/camera.gif', proxy('http://127.0.0.1:8081'))

// Configuration route
app.get('/config', function (req, res) {
  res.render('config', {
    resinAppId: process.env.RESIN_APP_ID || '(Not Set)',
    resinDeviceType: process.env.RESIN_DEVICE_TYPE || '(Not Set)',
    resin: process.env.RESIN || '(Not Set)',
    resinSupervisorAddress: process.env.RESIN_SUPERVISOR_ADDRESS || '(Not Set)',
    resinSupervisorHost: process.env.RESIN_SUPERVISOR_HOST || '(Not Set)',
    resinDeviceUuid: process.env.RESIN_DEVICE_UUID || '(Not Set)',
    resinAppRelease: process.env.RESIN_APP_RELEASE || '(Not Set)',
    resinSupervisorVersion: process.env.RESIN_SUPERVISOR_VERSION || '(Not Set)',
    resinAppName: process.env.RESIN_APP_NAME || '(Not Set)',
    resinDeviceNameAtInit: process.env.RESIN_DEVICE_NAME_AT_INIT || '(Not Set)',
    resinHostOsVersion: process.env.RESIN_HOST_OS_VERSION || '(Not Set)',
    resinSupervisorPort: process.env.RESIN_SUPERVISOR_PORT || '(Not Set)',
    title: process.env.RESIN_APP_NAME || '(Not Set)'
  })
})

// Handle Express exceptions
app.use(function (err, req, res, next) {
  console.error(err)
  next(err)
})

// Launch server
app.listen(port, function () {
  console.log('Server started on ' + port)
})
