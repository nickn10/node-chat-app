var socket = io();
const form = document.querySelector('#message-form')
const messages = document.querySelector('#messages')
const locationButton = document.querySelector('#share-location')
const usersList = document.querySelector('#users');



socket.on('connect', function() {
	var params = getParams(window.location.search);

	socket.emit('newUser', params, function(params, err) {
		if(err) {
			alert(err)
			window.location.href = '/'
		} else {
					
			socket.emit('join', params, function(err) {
			if(err) {
				alert(err);
				window.location.href = '/'
			} else {
			
			}
		})
		}
	})

	// socket.emit('join', params, function(err) {
	// 	if(err) {
	// 		alert(err);
	// 		window.location.href = '/'
	// 	} else {
			
	// 	}
	// })
});

socket.on('disconnect', function() {
	console.log('User Disconnected')
});

socket.on('updateUsersList', function(users) {
	// console.log('Users list', users);
	let ol = document.createElement('ol');

	users.forEach(function(user) {
		let li = document.createElement('li')
		let newUser = document.createTextNode(user.name + " ")
		let a = document.createElement('a')
		a.setAttribute('href', user.location.url)
		a.setAttribute('target', "_blank")
		a.innerHTML = user.location.text
		li.appendChild(newUser);
		li.appendChild(a)
		ol.appendChild(li)
	});
	usersList.innerHTML = ol.innerHTML
})

socket.on('newMessage', function(message,) {
	// Using mustache.js
	let formattedTime = moment(message.createdAt).format('h:mm a')
	let template = document.querySelector('#message-template').innerHTML
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime,
		});

	messages.insertAdjacentHTML('beforeend', html)
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	// Using mustache.js
	let formattedTime = moment(message.createdAt).format('h:mm a')
	let template = document.querySelector('#location-message-template').innerHTML
	let html = Mustache.render(template, {
		from: message.user.name,
		url: message.user.location.url,
		text: message.user.location.text,
		createdAt: formattedTime	
	})

	messages.insertAdjacentHTML('beforeend', html)
	scrollToBottom();
})

// ============ Event Listeners ======================


form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  socket.emit('createMessage', {
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
