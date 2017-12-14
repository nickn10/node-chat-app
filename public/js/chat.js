var socket = io();

const form = document.querySelector('#message-form')
const messages = document.querySelector('#messages')
const locationButton = document.querySelector('#share-location')
const usersList = document.querySelector('#users');

socket.on('connect', function() {
	var params = getParams(window.location.search);
	socket.emit('join', params, function(err) {
		if(err) {
			alert(err);
			window.location.href = '/'
		} else {
			console.log('No error');
		}
	})
});

socket.on('disconnect', function() {
	socket.emit('newMessage', generateMessage('Admin','Disconnected from server!'));
});

socket.on('updateUsersList', function(users) {
	console.log('Users list', users);
	let ol = document.createElement('ol');

	users.forEach(function(user) {
		let li = document.createElement('li')
		let newUser = document.createTextNode(user)
		li.appendChild(newUser);
		ol.appendChild(li)
	});
	usersList.innerHTML = ol.innerHTML
})

socket.on('newMessage', function(message) {
	// Using mustache.js
	let formattedTime = moment(message.createdAt).format('h:mm a')
	let template = document.querySelector('#message-template').innerHTML
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
		});

	messages.insertAdjacentHTML('beforeend', html)
	scrollToBottom();
});

socket.on('newLocationMessage', function(locationMessage) {
	// Using mustache.js
	let formattedTime = moment(locationMessage.createdAt).format('h:mm a')
	let template = document.querySelector('#location-message-template').innerHTML
	let html = Mustache.render(template, {
		from: locationMessage.from,
		url: locationMessage.url,
		createdAt: formattedTime
	})

	messages.insertAdjacentHTML('beforeend', html)
	scrollToBottom();
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
