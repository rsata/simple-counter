var socket = io.connect('http://localhost:8080');

socket.on('newCount', function (data) {
	console.log(data.current);
	document.getElementById('count').innerHTML = data.current;
});


function addOne() {
	console.log('added one')
	socket.emit('clientAddOne', {});
}

function subOne() {
	console.log('removed one')
	socket.emit('clientSubOne', {});
}