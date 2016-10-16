var socket = io();
var pairInfo = {};

var message1 = {message: "Hey. Just got to the hotel.", choices: ["Glad to hear it.","👍"],choiceID: 1}
var message2 = {message: "Having borderline panic attack about this meeting."}
var message3 = {message: "Lol."}
var message4 = {message: "But actually...", choices: ["Definitely get that. It's a big deal!","It'll be fine. You got this!"],choiceID: 2}
var message5 = {message: "Yeah, I'm sooo unprepared. 😔"}
var message6 = {message: "Thanks! Wish me luck. 😬"}

/////////////

socket.on('roomId', function(msg) {
  pairInfo.name = msg;
  console.log(pairInfo);
});

socket.on('setPairInfo', function(msg) {
  pairInfo = msg;
  console.log(msg)
});

socket.on('madeChoice', function(msg) {
  console.log(msg)
});

/////////////

$(document).ready(function() {
  //
});

$( window ).load(function() {
  socket.emit('registerViewer', null);
});

$(".testLink").click(function(e) {
  e.preventDefault()
  socket.emit('sendMessage', {dest: pairInfo.phoneID, message: message1});
});

/////////////
