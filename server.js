var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('message', function (message) {
		console.log('Message received:' + message.text);

		// socket.broadcast.emit('message', message);
		message.timestamp = moment().valueOf();
		io.emit('message', message);
	});

	socket.emit('message',  {
		name: '系统登录时间',
		text: '欢迎进入聊天室!',
		timestamp: moment().valueOf()
	});
});


http.listen(PORT, function() {
	console.log('Server started');
});