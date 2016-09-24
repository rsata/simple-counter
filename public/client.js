var socket = io.connect('http://localhost:8080');
var name;

function setName() {
  name = document.getElementById('name').value;
  document.getElementById("usernameInput").style.display = "none";
  document.getElementById("countArea").style.display = "block";
  socket.emit('addUser', name);
}

function addOne() {
	socket.emit('clientAddOne', {});
}

function subOne() {
	socket.emit('clientSubOne', {});
}


socket.on('peopleCount', function (people) {  
  var isPresentFilter = people.filter(function(el) { return el.present === true })
  console.log ('LENGTH FILTERED ' + isPresentFilter.length);
  document.getElementById('liveCount').innerHTML = isPresentFilter.length;
})

/////////


var canvas = document.getElementById('canvas-video');
var context = canvas.getContext('2d');
var img = new Image();

socket.on('frame', function (data) {
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;

  if (data.present && name != '') { //(see in face-detection)
    console.log('present')
    socket.emit('personPresent', {})
  } else {
    console.log('absent')
    socket.emit('personAbsent', {})
  }

});


function randomNum () {
  return Math.floor(Math.random() * (99999 - 10000) + 10000);
}
