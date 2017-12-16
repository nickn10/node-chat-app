//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users {
	constructor() {
		this.users = []
	}

	addUser(id, name, room, location) {
		location = {url: '', text: ''}
		const user = {id, name, room, location}
		this.users.push(user)
		return user;
	}
	removeUser(id) {
		const user = this.getUser(id);
		if (user) {
			return this.users.splice(this.users.indexOf(user), 1)[0]
		}
		return user
	}
	getUser(id) {
		return this.users.filter((user) => user.id === id)[0];
	}
	getUsersList(room) {
		const users = this.users.filter((user) => user.room === room);
		const namesArray = users.map((user) => {return {name: user.name, location: user.location}});
		
		return namesArray
	}

	groupUsersByRoom() {
		let roomsObj = this.users.reduce((rooms, user) => {
						if(rooms[user.room]) {
							rooms[user.room]++
						} else {
							rooms[user.room] = 1
						}
						return rooms
						}, {})
		let roomsArray = []

		for(const prop in roomsObj)	{
			let room = {}
			room[prop] = roomsObj[prop]
			roomsArray.push(room)
		}
		return roomsArray
	}
}


module.exports = {Users};

