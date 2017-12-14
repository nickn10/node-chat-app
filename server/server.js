const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var chatUsers = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		let name = params.name;
		let room = params.room;


		if(!isRealString(name) || !isRealString(room)) {
			return callback('Name and room are required.')
		}

		socket.join(room)
		// socket.leave()

		chatUsers.removeUser(socket.id);
		chatUsers.addUser(socket.id, name, room);

		io.to(room).emit('updateUsersList', chatUsers.getUsersList(room))

		socket.emit('newMessage', generateMessage('Admin','Hello, welcome to ChatApp!'));
		socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined`));
		
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		let user = chatUsers.getUser(socket.id);
		message.from = user.name;
		io.emit('newMessage', generateMessage(message.from, message.text));
		// callback('This is from the server.');
		// socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
	})

	socket.on('disconnect', () => {
		let user = chatUsers.removeUser(socket.id)

		if (user) {
			io.to(user.room).emit('updateUsersList', chatUsers.getUsersList(user.room))
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name}, left the room`));
		}
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}...`);
})