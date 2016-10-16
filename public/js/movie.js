var socket = io();
var pairInfo = {};

var message1 = {message: "Hey. Just got to the hotel.", choices: ["Glad to hear it.","👍"],choiceID: 1}
var message2 = {message: "Having borderline panic attack about this meeting."}
var message3 = {message: "Lol."}
var message4 = {message: "But actually..."}
var message7 = {choices: ["Definitely get that. It's a big deal!","It'll be fine. You got this!"],choiceID: 2}
var message5 = {message: "Yeah, I'm sooo unprepared. 😔"}
var message6 = {message: "Thanks! Wish me luck. 😬"}

var videos = [{name: "01", messages: {15: message1, 23: message2, 30: message3, 38: message4, 53: message7}}, {name: "02", messages: {14: message6}}, {name: "03", messages: {15: message5}}, {name: "04"}]
var loaded = [];
var nowPlaying;
var vidData;
var nextVid = "04";
var willEnd = false;
//var videos = ["01"];

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
  createVideos();
});

$(".testLink").click(function(e) {
  e.preventDefault()
  socket.emit('sendMessage', {dest: pairInfo.phoneID, message: message1});
});

/////////////

function createVideos() {
  for (var i = 0, l = videos.length; i < l; i++) {
    var video = $('<div class="videoPart invisible" id="video-' + videos[i].name + '"><video id="video1" preload="auto" src="/assets/' + videos[i].name + '.mp4" type="video/mp4"></video></div>')
      .on('canplaythrough', didLoad(videos[i].name))
      .appendTo($("#videoHolder"));
  }
}

//.on('ended', showAndPlayVideo(nextVid))

function didLoad(videoId) {
  loaded.push(videoId);
  if (loaded.length === videos.length) {
    console.log("ALL LOADED");
    showAndPlayVideo("01");
  }
}

function showAndPlayVideo(whichVid) {

  var vidId = "#video-" + whichVid;
  if (nowPlaying !== undefined) {
    nowPlaying.onended = null;
    nowPlaying.pause();
  }
  $('.videoPart').each(function() {
    $(this).addClass('invisible');
  })
  $(vidId).removeClass("invisible");
  nowPlaying = $(vidId + " video")[0];
  for (var i = 0, l = videos.length; i < l; i++) {
    if (videos[i].name === whichVid) {
      vidData = videos[i];
    }
  }
  if (nowPlaying !== undefined) {
    nowPlaying.play();
    nowPlaying.ontimeupdate = function() {
      checkProgress();
    };
    nowPlaying.onended = function() {
      if (willEnd) {
        console.log("GO TO END")
      } else {
        showAndPlayVideo(nextVid);
        willEnd = true;
      }
    };
  }
}

function checkProgress() {
  if (nowPlaying !== undefined && vidData !== undefined) {
    //console.log(nowPlaying.currentTime)

    // This is slow and sloppy. Sorry.
    for (var time in vidData.messages) {

      var t = parseInt(time)
      if (nowPlaying.currentTime > t) {
        if (vidData.messages[t] !== undefined) {
          console.log(vidData.messages[t]);
          socket.emit('sendMessage', {dest: pairInfo.phoneID, message: vidData.messages[t]});
          vidData.messages[t] = undefined;
        }
      }
    }
  }
}






