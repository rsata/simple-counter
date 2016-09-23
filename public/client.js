var socket = io.connect('http://localhost:8080');
var name;

function setName() {
  var setName = document.getElementById('name').value;
  name = setName;
  document.getElementById("usernameInput").style.display = "none";
  document.getElementById("countArea").style.display = "block";
  socket.emit('addUser', {data: name});
}

socket.on('newCount', function (data) {
	document.getElementById('count').innerHTML = data.current;
});


function addOne() {
	socket.emit('clientAddOne', {});
}

function subOne() {
	socket.emit('clientSubOne', {});
}


socket.on('peopleCount', function (data) {
  console.log(data.numberOfPeople);
  document.getElementById('liveCount').innerHTML = data.numberOfPeople;
  //THIS IS MESSY AND STUPID.  NEEDS FIX.
  // if (data.count >= numberOfPeople) {    
  //   return document.getElementById('liveCount').innerHTML = data.numberOfPeople;
  // } else {
  //   return document.getElementById('liveCount').innerHTML = data.count;
  // }  
})

/////////


var canvas = document.getElementById('canvas-video');
var context = canvas.getContext('2d');
var img = new Image();
// var userId = randomNum();

socket.on('frame', function (data) {
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;

  if (data.person && name != '') { //(see in face-detection)
    console.log('present')
    socket.emit('personPresent', {name: name})
  } else {
    console.log('absent' && name != '')
    socket.emit('personAbsent', {name: name})
  }

});


function randomNum () {
  return Math.floor(Math.random() * (99999 - 10000) + 10000);
}






/*

// CAMERA
var video = document.getElementById('videoElement');;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia; 

if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    alert('could not load from camera');
}

// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
  context.drawImage(video, 0, 0, 640, 480);
  document.querySelector('img').src = canvas.toDataURL('image/png');
});

*/
