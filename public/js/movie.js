var socket = io();
var pairInfo = {};

socket.on('roomId', function(msg){
  pairInfo.name = msg;
  console.log(pairInfo);
});

socket.on('setPairInfo', function(msg){
  pairInfo = msg;
  console.log(msg)
});

$(document).ready(function() {
  //
});

$( window ).load(function() {
  socket.emit('registerViewer', null);
});
