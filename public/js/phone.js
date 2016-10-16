var socket = io();
var pairInfo;
var placeId;


$(document).ready(function() {
  var place = location.href.split("/");
  placeId = place[place.length-1];
});

socket.on('setPairInfo', function(msg){
  pairInfo = msg;
  console.log(msg)
});

$( window ).load(function() {
  socket.emit('registerController', placeId);
});
