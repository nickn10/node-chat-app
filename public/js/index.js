var socket = io();

const form = document.querySelector('#message-form')
const messages = document.querySelector('#messages')
const locationButton = document.querySelector('#share-location')


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

socket.on('newLocationMessage', function(locationMessage) {
	let entry = document.createElement('li');
	let aTag = document.createElement('a');
	aTag.setAttribute('href', locationMessage.url)
	aTag.setAttribute('target', "_blank");
	aTag.innerHTML = "My current location"
	entry.appendChild(document.createTextNode(`${locationMessage.from}: `))
	entry.appendChild(aTag)
	messages.appendChild(entry);
})

form.addEventListener('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: form.message.value
	}, function() {

	})
	form.reset();
});

locationButton.addEventListener('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your current browser.');
	}

	locationButton.setAttribute('disabled', 'disabled');
	locationButton.textContent = "Sending..."

	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttribute('disabled');
		locationButton.textContent = "Share Location"
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function() {
		locationButton.removeAttribute('disabled');
		locationButton.textContent = "Share Location"
		alert('Unable to fetch location.');
	})
})
