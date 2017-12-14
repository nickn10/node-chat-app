//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users {
	constructor() {
		this.users = []
	}

	addUser(id, name, room) {
		const user = {id, name, room}
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
		const namesArray = users.map((user) => user.name);
		return namesArray
	}
}


module.exports = {Users};

