const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, uniqueUserName} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var chatUsers = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	
	socket.emit('updateActiveRooms', chatUsers.groupUsersByRoom())

	socket.on('newUser', (params, callback) => {
		if(params.room ==="") {
			let currentRooms = chatUsers.groupUsersByRoom();
			
			currentRooms.forEach((room) => {
				for(const prop in room) {
					if (prop === params.newRoom.toLowerCase()) {
						return callback(params, 'Room name already taken.');
					}
				}
			})

			params.room = params.newRoom
			callback(params)
		} else {
			callback(params)
		}
	})

	socket.on('join', (params, callback) => {
		let name = params.name;
		let room = params.room.toLowerCase();
		let roomUsers = chatUsers.getUsersList(room);

		if(!isRealString(name) || !isRealString(room)) {
			return callback('Name and room are required.')
		}

		if(uniqueUserName(name, roomUsers).length > 0) {
			return callback('Username already taken.')
		}

		socket.join(room)
		// socket.leave()

		chatUsers.removeUser(socket.id);
		chatUsers.addUser(socket.id, name, room);

		io.to(room).emit('updateUsersList', chatUsers.getUsersList(room))

		socket.emit('newMessage', generateMessage('Admin',`Hello, welcome to the room.`));
		socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined`));
		
		callback();
	});



	socket.on('createMessage', (message, callback) => {
		let user = chatUsers.getUser(socket.id);

		if(user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text), user.location);
		}
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		let user = chatUsers.getUser(socket.id);

		if (user) {	
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user, coords.latitude, coords.longitude))
			io.to(user.room).emit('updateUsersList', chatUsers.getUsersList(user.room))
		}
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