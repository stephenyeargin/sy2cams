var express = require('express')
var RaspiCam = require('raspicam')
var os = require('os')
var fs = require('fs')
var path = require('path')
var app = express()
var appPort = process.env.PORT || 80

// Configure express
app.set('view engine', 'pug')
app.use(express.static('public'))

// Set up camera
var cameraPath = path.join(os.tmpdir(), 'raspicam', 'camera.jpg')
var camera = new RaspiCam({
  mode: 'timelapse',
  timelapse: 3000,
  timeout: 999999999,
  quality: 10,
  nopreview: true,
  output: cameraPath
})

// Start recording if camera is available
var cameraEnabled = false
if (process.env.RESIN) {
  cameraEnabled = camera.start()

  // When started
  camera.on('started', function () {
    console.log('camera started')
  })

  // When file written to disk
  camera.on('read', function (err, filename) {
    if (err) {
      console.log('camera.on.read.err', err)
    } else {
      // console.log('wrote: ' + filename)
    }
  })

  // When timeout reached
  camera.on('exited', function () {
    console.log('timeout reached.')
  })
}

// Default route
app.get('/', function (req, res) {
  res.render('index', {
    cameraEnabled: cameraEnabled !== false,
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
app.get('/camera.jpg', function (req, res) {
  var s = fs.createReadStream(cameraPath)
  s.on('open', function () {
    res.set('Content-Type', 'image/jpeg')
    s.pipe(res)
  })
  s.on('error', function () {
    res.set('Content-Type', 'text/plain')
    res.status(404).end('Image not found.')
  })
})

// start a server on port app_port and log its start to our console
var server = app.listen(appPort, function () {
  var port = server.address().port
  console.log('Listening on port:', port)
})
