process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

// Configure exposed port
var port = process.env.PORT || 80;

// Configure express
var express = require('express');
var app = express();
var wss = require('express-ws')(app);

// Configure video streaming
var raspividStream = require('raspivid-stream');

// Configure rendering engine
app.set('view engine', 'pug');

// Home route
app.get('/', function (req, res) {
  res.render('index', {
    title: process.env.RESIN_APP_NAME || '(Not Set)'
  });
});

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
  });
});

// Websocket video
app.ws('/video-stream', function (ws, req) {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '960',
      height: '540'
    }), function (error) {
      if (error) {
        console.log(error);
      }
    });

    var videoStream = raspividStream({ rotation: 180 });

    videoStream.on('data', function (data) {
        ws.send(data, { binary: true }, function (error) {
          if (error) {
            console.log(error);
          }
        });
    });

    ws.on('close', function () {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

// Handle exceptions
app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
});

// Launch server
app.listen(port, function () {
  console.log('Server started on ' + port);
});
