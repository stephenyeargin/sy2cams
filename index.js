'use strict';

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

const port = process.env.PORT || 80;
const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);

// Configuring rendering iamge
app.set('view engine', 'pug');

// Home route
app.get('/', function (req, res) {
  res.render('index', {});
});

// Websocket video
app.ws('/video-stream', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '960',
      height: '540'
    }));

    var videoStream = raspividStream({ rotation: 180 });

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
})

app.listen(port, () => console.log('Server started on ' + port));
