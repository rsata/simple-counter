var express = require('express');
var app = express();
var path = require('path');
var port = 8080;

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function() {
	console.log('server listening at ' + port)
})

app.use(express.static(__dirname + '/'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var counter = 0;

io.sockets.on('connection', function (socket) {

	socket.emit('newCount', {current: counter})

	socket.on('clientAddOne', function(data) {
		counter++;
		socket.emit('newCount', {current: counter});
		socket.broadcast.emit('newCount', {current: counter});
	})

	socket.on('clientSubOne', function(data) {
		counter--;
		socket.emit('newCount', {current: counter});
		socket.broadcast.emit('newCount', {current: counter});
	})
});