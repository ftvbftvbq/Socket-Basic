var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined') {
	return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
			name: '系统登录时间',
			text: '目前的用户有：' + users.join(', '),
			timestamp: moment().valueOf()
	});
}


io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function () {
		var userdData = clientInfo[socket.id];

		if (typeof userdData !== 'undefined') {
			socket.leave(userdData.room);
			io.to(userdData.room).emit('message', {
			name: '系统登录时间',
			text: userdData.name + ' 已离开!',
			timestamp: moment().valueOf()
			});
			delete userdData;
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: '系统登录时间',
			text: req.name + ' 已加入! ',
			timestamp: moment().valueOf()
		});
	});


	socket.on('message', function (message) {
		console.log('Message received:' + message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
		// socket.broadcast.emit('message', message);
		message.timestamp = moment().valueOf();
		// io.emit('message', message);
		io.to(clientInfo[socket.id].room).emit('message', message);
		}
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