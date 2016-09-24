var express = require('express');
var app = express();
var path = require('path');
var port = 8080;
var faceDetection = require('./face-detection')

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function() {
	console.log('server listening at ' + port)
})

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var counter = 0;
var people = [];

function nameAlreadyExists(name) {
	for (var i=0; i < people.length; i++) {
		if(name === people[i].name) {
			return true;
		}
	}
}

io.sockets.on('connection', function (socket) {

	//IMAGE RECOGNITION
	faceDetection(socket);

	socket.on('personPresent', function() {
		console.log(socket.username + ' is present');

		var nameSearch = socket.username;
		var index = -1;
		for(var i=0; i<people.length; i++) {
			if (people[i].name === nameSearch) {
				people[i].present = true;
				break;
			}
		}

		socket.emit('peopleCount', people);
		socket.broadcast.emit('peopleCount', people);
	})

	socket.on('personAbsent', function(){
		console.log(socket.username + ' is absent');

		var nameSearch = socket.username;
		var index = -1;
		for(var i=0; i<people.length; i++) {
			if (people[i].name === nameSearch) {
				people[i].present = false;
				break;
			}
		}

		socket.emit('peopleCount', people);
		socket.broadcast.emit('peopleCount', people);
	})

	socket.on('addUser', function(name) {
		socket.username = name;
		// NEED TO HANDLE DUPLICATES
		people.push({
			name: socket.username,
			present: true,
		})
		console.log(people)
	})

	socket.on('disconnect', function() {
		var nameSearch = socket.username;
		var index = -1;
		for(var i=0; i<people.length; i++) {
			if (people[i].name === nameSearch) {
				index = i;
				people.splice(index, 1);
				break;
			}
		}
		console.log(people)
	})

});
