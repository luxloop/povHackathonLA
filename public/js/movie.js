var socket = io();
var pairInfo;

socket.on('roomId', function(msg){
  pairInfo = msg;
  console.log(pairInfo);
});

$(document).ready(function() {
  socket.emit('registerViewer', null);
});

$( window ).load(function() {
  //
});
