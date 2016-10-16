var socket = io();
var pairInfo;
var placeId;

/////////////

socket.on('setPairInfo', function(msg) {
  pairInfo = msg;
  console.log(msg)
});

socket.on('getMessage', function(msg) {
  console.log("got Message")
  displayMessage(msg)
});

/////////////

$(document).ready(function() {
  var place = location.href.split("/");
  placeId = place[place.length-1];
});

$( window ).load(function() {
  socket.emit('registerController', placeId);
});

/////////////

function displayMessage(messageObject) {
  $("#messageArea").append(messageObject.message)

  if (messageObject.choices !== undefined) {
    var html = ""
    for (var i = 0, l = messageObject.choices.length; i < l; i++) {
      html += '<a href="#" class="choice" data-choice="' + i + '" data-question="' + messageObject.choiceID + '">' + messageObject.choices[i] + '</a></br>';
    }
    $("#inputArea").html(html);
  }
}

$(document).on('click', '.choice', function(e) {
  e.preventDefault();
  socket.emit('makeChoice', {dest: pairInfo.viewerID, question: $(this).attr('data-question'), answer: $(this).attr('data-choice')});
  //console.log($(this).attr('data-choice'));
});
