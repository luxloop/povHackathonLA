///////////////////////////
// set up environment
var express = require('express');
// var bodyParser = require('body-parser');
var app = express();
var favicon = require('serve-favicon');

var genid = require('./genid');

///////////////////////////
// Routes

// try {
//   var toobusy = require('toobusy-js');
//   app.use(function(req, res, next) {
//     // check if we're toobusy() - note, this call is extremely fast, and returns
//     // state that is cached at a fixed interval
//     if (toobusy()) res.redirect('http://pigments.luxloop.com/server'); //res.send(503, "I'm busy right now, sorry."); //
//     else next();
//   });
//   console.log("Loaded and registered toobusy middleware")
// } catch (e) {
//   console.log("Error loading and registering toobusy")
// }

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res){
  if (process.env.TESTSERV === "true") {
    res.redirect('http://icantmakeuloveu.com');
  } else {
    res.sendFile(__dirname + '/viewer.html');
  }
});

app.get('/test', function(req, res){
  if (process.env.TESTSERV === "true") {
    res.sendFile(__dirname + '/viewer.html');
  } else {
    res.redirect('http://icantmakeuloveu.com');
  }
});

app.get('/server', function(req, res){
  res.sendFile(__dirname + '/overflow.html');
});

app.get('/:data', function(req, res){
  //var code = req.params.data;
  res.sendFile(__dirname + '/controller.html');
});

app.get('/heartbeats/:data', function(req, res){
  var code = req.params.data;
  var codeClean = code.replace(".png", "");
  if (process.env.TESTSERV === "true") {
    res.redirect('http://icantmakeuloveu.com/heartbeats/'+code);
  } else {
    res.render('payoff', {imageCode: codeClean});
  }
});


///////////////////////////
// Start server
var server = app.listen(8010, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening on http://%s:%s', host, port);
});

///////////////////////////
// Sockets

//io.nsps["/"].adapter.rooms[group] != undefined

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('%s - a user connected width ID: %s', new Date().toUTCString(), socket.id);


  socket.on('disconnect', function(){
    console.log('%s - user disconnected', new Date().toUTCString());
    handleDisconnect(socket.id);
  });

  socket.on('registerViewer', function(msg){
    createNewPair(socket.id);
    //io.sockets.to(socket.id).emit('roomId', Math.random());
  });

  socket.on('registerController', function(msg){
    addController(socket.id,msg);
    //createNewPair(socket.id);
    //io.sockets.to(socket.id).emit('roomId', Math.random());
  });

  socket.on('heartbeat', function(beat){
    if (beat.dest) {
      io.sockets.to(beat.dest).emit('heartbeat', beat);
    }
  });

  socket.on('sectionArray', function(data){
    if (data.dest) {
      io.sockets.to(data.dest).emit('sectionArray', data);
    }
  });

  socket.on('isDying', function(data){
    if (data) {
      io.sockets.to(data).emit('isDying',data);
    }
  });

  socket.on('started', function(dest){
    io.sockets.to(dest).emit('started', socket.id);
  });

  socket.on('songPart', function(data){
    io.sockets.to(data.controller).emit('songPart', data);
  });

  socket.on('hasDied', function(data){
    io.sockets.to(data).emit('hasDied', true);
  });

  socket.on('Over', function(data){
    io.sockets.to(data).emit('Over', true);
  });

  socket.on('noReturn', function(data){
    io.sockets.to(data).emit('noReturn', true);
  });

///////////////////////////
// Custom Functions

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

///////////////////////////
// Cleanup on Close
var gracefulExit = function() {
  process.exit(0);
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
