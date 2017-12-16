var socket = io();
const activeRooms = document.querySelector('#active-rooms')
const roomInput = document.getElementsByName('room')
const form = document.querySelector('#form')

// socket.on('connect', function() {
// 	socket.emit('newUser', function() {
// 		console.log('new user');
// 	})
// })

socket.on('updateActiveRooms', function(roomslist) {
	roomslist.forEach(function(room) {
		for(let prop in room) {
			const option = document.createElement('option');
			option.setAttribute('value', prop)
			option.setAttribute('name', 'room')
			option.innerHTML = prop + " (" + room[prop] + ")"
			activeRooms.appendChild(option);
		}
	})
})

activeRooms.onchange = function() {
	roomInput[0].value = activeRooms.value;
	form.submit()

}

