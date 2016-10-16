///////////////////////////
// set up environment
var express = require('express');
// var bodyParser = require('body-parser');
var app = express();
var favicon = require('serve-favicon');

var genid = require('./genid');


// replace this with a real DB if we decide to scale
var controllerPairs = []

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
  res.sendFile(__dirname + '/pages/movieScreen.html');
});

app.get('/:data', function(req, res){
  //var code = req.params.data;
  res.sendFile(__dirname + '/pages/movieScreen.html');
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

  // socket.on('started', function(dest){
  //   io.sockets.to(dest).emit('started', socket.id);
  // });

  // socket.on('songPart', function(data){
  //   io.sockets.to(data.controller).emit('songPart', data);
  // });

  // socket.on('hasDied', function(data){
  //   io.sockets.to(data).emit('hasDied', true);
  // });

  // socket.on('Over', function(data){
  //   io.sockets.to(data).emit('Over', true);
  // });

  // socket.on('noReturn', function(data){
  //   io.sockets.to(data).emit('noReturn', true);
  // });

///////////////////////////
// Custom Functions

function createNewPair(socketID){
  for (var i = 0, l = controllerPairs.length; i < l; i++) {
    if (controllerPairs[i].viewerID === socketID) {
      console.log("this viewer exists!")
    } else {
      makeUniqueID(socketID)
    }
  }
}

function makeUniqueID(socketID){
  ControllerPair.find().count(function(err, count){
    // console.log(count);
    var whichAlpha = 0;
    if (count > 7950) {
      whichAlpha = 1;
    }
    // console.log(whichAlpha);
    genid(3,0,function(err,newid) {
      if (err) {
        throw err
        return
      }

      var found = false;
      for (var i = 0, l = controllerPairs.length; i < l; i++) {
        if (controllerPairs[i].name === newid) {
          controllerPairs[i].viewerID = socketID;
          found = true;
          break;
        }
      }

      if (!found) {
        var newPair = {
          name: newid,
          viewerID: socketID
        }
        controllerPairs.push(newPair)
      }
      io.sockets.to(socketID).emit('roomId', newid);
    });
  });
}

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
