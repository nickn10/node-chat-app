var socket = io();

const form = document.querySelector('#message-form')
const send = document.querySelector('#message-send')
const messages = document.querySelector('#messages');


socket.on('connect', function() {
	console.log('Connected to server.');
});

socket.on('disconnect', function() {
	console.log('Disconnected from server.');
});

socket.on('newEmail', function(email) {
	console.log('New email.', email);
})

socket.on('newMessage', function(message) {
	console.log('New message', message);
	let entry = document.createElement('li');
	entry.appendChild(document.createTextNode(`${message.from}: ${message.text}`))
	messages.appendChild(entry);
});

// socket.emit('createMessage', {from: 'Andy', text: 'New message'}, (data) => {
// 	console.log('Got it', data);
// });



form.addEventListener('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: form.message.value
	}, function() {

	})
})