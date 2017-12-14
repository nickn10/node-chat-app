const expect = require('expect')
const {Users} = require('./users');


describe('Users', () => {
	let chatUsers;

	beforeEach(() => {
		chatUsers = new Users();
		chatUsers.users = [{
			id: '1',
			name: 'Mike',
			room: 'The Office Fans'
		},{
			id: '2',
			name: 'Jen',
			room: 'The Office Fans'
		},{
			id: '3',
			name: 'Caleb',
			room: 'Psych Fans'
		}]
	});

	it('should add a new user', () => {
		let chatUsers = new Users();
		let user = {
			id: '123',
			name: 'Nick',
			room: 'Psych'
		}
		let addedUser = {
			id: '123',
			name: 'Nick',
			room: 'Psych',
			location: {
				url: '',
				text: ''
			}
		}
		let resUser = chatUsers.addUser(user.id, user.name, user.room);
		expect(resUser).toEqual(addedUser)
		expect(chatUsers.users).toContainEqual(addedUser);
	})

	it('should return user names for specified room', () => {
		let userList = chatUsers.getUsersList('The Office Fans')
		expect(userList.length).toBe(2);
	});

	it('should not find a user', () => {
		expect(chatUsers.removeUser('22')).toBeFalsy();
		expect(chatUsers.getUser('22')).toBeFalsy();
	})

	it('should return/remove specified user from array', () => {
		const user = {id: '1', name: 'Mike', room: 'The Office Fans'}
		expect(chatUsers.removeUser('1')).toEqual(user);
		expect(chatUsers.users).not.toContainEqual(user);	
	});

	it('should return specified user', () => {
		const user = {id: '1', name: 'Mike', room: 'The Office Fans'}
		expect(chatUsers.getUser('1')).toEqual(user);
		expect(chatUsers.users.length).toBe(3);
	});	
});