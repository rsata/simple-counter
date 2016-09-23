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

// app.use(express.static(__dirname + '/'));
app.use(express.static('public'));


// viewed at http://localhost:8080
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

	//COUNTING STUFF
	// socket.emit('newCount', {current: counter})

	// socket.on('clientAddOne', function(data) {
	// 	counter++;
	// 	socket.emit('newCount', {current: counter});
	// 	socket.broadcast.emit('newCount', {current: counter});
	// })

	// socket.on('clientSubOne', function(data) {
	// 	counter--;
	// 	socket.emit('newCount', {current: counter});
	// 	socket.broadcast.emit('newCount', {current: counter});
	// })

	//IMAGE RECOGNITION
	faceDetection(socket);

	socket.emit('peopleCount', {
		numberOfPeople: people.length,
		count: counter,
	})

	socket.on('personPresent', function(data) {
		if (nameAlreadyExists(data.name))
			return
		
		people.push(data);
		socket.emit('peopleCount', {
			numberOfPeople: people.length,
			count: counter,
		});
		socket.broadcast.emit('peopleCount', {
			numberOfPeople: people.length,
			count: counter,
		});	

		console.log(data.name + ' is present')
		console.log(people)
	})

	socket.on('personAbsent', function(data){
		if (!nameAlreadyExists(data.name))
			return

		people.pop() // this will only delete the last person, not the right user - only use as count
		socket.emit('peopleCount', {
			numberOfPeople: people.length,
			count: counter,
		});
		socket.broadcast.emit('peopleCount', {
			numberOfPeople: people.length,
			count: counter,
		});

		console.log(data.name + ' is absent')
	})

	socket.on('addUser', function(name) {
		counter++;
		socket.emit('newCount', {current: counter})
		socket.broadcast.emit('newCount', {current: counter})
	})

	socket.on('disconnect', function(name) {
		counter--;
		socket.emit('newCount', {current: counter})
		socket.broadcast.emit('newCount', {current: counter})
	})

});



// // clean this shit up...
// function checkAndAdd(name) {
//   var id = arr.length + 1;
//   var found = arr.some(function (el) {
//     return el.username === name;
//   });
//   if (!found) { arr.push({ id: id, username: name }); }
// }