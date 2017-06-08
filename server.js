var express = require('express')
var raspivid = require('raspivid')
var os = require('os')
var fs = require('fs')
var path = require('path')
var app = express()
var appPort = process.env.PORT || 80

// Configure express
app.set('view engine', 'pug')
app.use(express.static('public'))

// Start recording if camera is available
var cameraPath = path.join(os.tmpdir(), 'raspicam', 'video.mp4')
if (process.env.RESIN) {
  var file = fs.createWriteStream(cameraPath);
  var video = raspivid();
  video.pipe(file);
}

// Default route
app.get('/', function (req, res) {
  res.render('index', {
    resinAppName: process.env.RESIN_APP_NAME || '(Not Set)',
    title: process.env.RESIN_APP_NAME || '(Not Set)'
  })
})

// Default route
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

// Read camera file from /tmp
app.get('/video.mp4', function (req, res) {
  var s = fs.createReadStream(cameraPath)
  s.on('open', function () {
    res.set('Content-Type', 'video/mp4')
    s.pipe(res)
  })
  s.on('error', function () {
    res.set('Content-Type', 'text/plain')
    res.status(404).end('Video not found.')
  })
})

// start a server on port app_port and log its start to our console
var server = app.listen(appPort, function () {
  var port = server.address().port
  console.log('Listening on port:', port)
})
