const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin','Hello, welcome to the chat app!'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined'));


	socket.on('createMessage', (message, callback) => {
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from the server.');
		// socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
	})

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	})

	socket.on('disconnect', () => {
		console.log('User was disconnected from server.');
	});
});


server.listen(port, () => {
	console.log(`Server running on port ${port}...`);
})