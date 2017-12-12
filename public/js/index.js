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
	let formattedTime = moment(message.createdAt).format('h:mm a')
	let template = document.querySelector('#message-template').innerHTML
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
		});

	messages.insertAdjacentHTML('beforeend', html)

	
	// let entry = document.createElement('li');
	// entry.appendChild(document.createTextNode(`${formattedTime} ${message.from}: ${message.text}`))
	// messages.appendChild(entry);
});

socket.on('newLocationMessage', function(locationMessage) {
	// dynamic templates
	let formattedTime = moment(locationMessage.createdAt).format('h:mm a')
	let template = document.querySelector('#location-message-template').innerHTML
	let html = Mustache.render(template, {
		from: locationMessage.from,
		url: locationMessage.url,
		createdAt: formattedTime
	})

	messages.insertAdjacentHTML('beforeend', html)

	//Creates new <li> for each message
	// let entry = document.createElement('li');
	// let aTag = document.createElement('a');
	// aTag.setAttribute('href', locationMessage.url)
	// aTag.setAttribute('target', "_blank");
	// aTag.innerHTML = "My current location"
	// entry.appendChild(document.createTextNode(`${formattedTime} ${locationMessage.from}: `))
	// entry.appendChild(aTag)
	// messages.appendChild(entry);
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
